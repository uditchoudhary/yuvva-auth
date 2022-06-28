const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserSchema");
const Cart = require("../Model/CartSchema");

const defResponse = require("../Response/Default");
const { transformError } = require("../Response/Errors");
const dotenv = require("dotenv");
const verifyUser = require("../Middlewares/AuthVerifyUser");
const verifyAdmin = require("../Middlewares/AuthVerifyAdmin");
const { request } = require("express");
const Orders = require("../Model/OrderSchema");
dotenv.config();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let secret = process.env.jwtSeceret;

router.get("/", (req, res) => {
  res.send("Hello! Welcome to auth router");
});

// Fetch all users
router.get("/users", verifyUser, verifyAdmin, (req, res) => {
  User.find({}, (err, data) => {
    if (err) throw err;
    res.send(data);
  });
});

// Register a user
router.post("/register", (req, res) => {
  if (!req.body.password)
    return res.status(400).send(defResponse.RES_PASSWORD_MISSING);
  User.findOne(
    {
      email: req.body.email,
    },
    (err, user) => {
      if (err)
        return res
          .status(500)
          .send(transformError(defResponse.RES_SERVER_ERROR, err));
      if (user) {
        return res.status(409).send(defResponse.RES_USER_EXIST);
      } else {
        let hashPassword = bcrypt.hashSync(req.body.password, 8);
        User.create(
          {
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            isAdmin: req.body.isAdmin ? req.body.isAdmin : false,
            phone: req.body.phone,
            address: req.body.address ? req.body.address : undefined,
          },
          (err, data) => {
            if (err) {
              return res
                .status(500)
                .send(transformError(defResponse.RES_SERVER_ERROR, err));
            }
            res.status(200).send(defResponse.RES_REGISTRATION_SUCCESS);
          }
        );
      }
    }
  );
});

const generateAccessToken = (_id) => {
  return jwt.sign({ id: _id }, secret, {
    expiresIn: 1000 * 60 * 24 * process.env.jwtTokenExpireTimeInDays,
  });
};

// User logout
router.get("/logout", (req, res) => {
  res.status(200).clearCookie("token").send({ success: true });
});

// User Login
router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send(transformError(defResponse.RES_SERVER_ERROR, err));
    }
    if (!user) {
      return res.status(404).send(defResponse.RES_USER_NOT_EXIST);
    } else {
      const passValidity = bcrypt.compareSync(req.body.password, user.password);
      if (!passValidity)
        return res.status(401).send(defResponse.RES_USER_UNAUTHORISED);
      else {
        const { name, email, phone, isAdmin, address, _id } = user;
        console.log(user);
        let accessToken = generateAccessToken(user._id);
        res
          .status(200)
          .cookie("token", accessToken, {
            sameSite: "none",
            secure: true,
            httpOnly: true,
          })
          .send({
            success: true,
            user: {
              name,
              email,
              phone,
              isAdmin,
              address,
              userId: _id,
            },
          });
      }
    }
  });
});

// User information for self
router.get("/profile", verifyUser, (req, res) => {
  User.findOne({ _id: req.user.id }, (err, user) => {
    if (!user)
      return res
        .status(404)
        .send(transformError(defResponse.RES_USER_NOT_EXIST));

    const { name, email, phone, isAdmin, address, _id } = user;

    res.status(200).send({
      name,
      email,
      phone,
      isAdmin,
      address,
      userId: req.user.id,
    });
  });
});

// User update / add address
router.post("/updateAddress", verifyUser, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user.id,
    },
    {
      "address.line1": req.body.address.line1,
      "address.line2": req.body.address.line2,
      "address.line3": req.body.address.line3,
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        console.log("Error - ", err);
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
      if (!result)
        return res
          .status(404)
          .send(transformError(defResponse.RES_USER_NOT_EXIST));
      const { name, email, phone, isAdmin, address } = result;
      return res.status(200).send({
        name,
        email,
        phone,
        isAdmin,
        address,
        userId: req.user.id,
      });
    }
  );
});

// User update / update details
router.post("/updateUserDetails", verifyUser, (req, res) => {
  User.findOneAndUpdate(
    {
      _id: req.user.id,
    },
    {
      name: req.body.name,
      phone: req.body.phone,
      "address.line1": req.body.line1,
      "address.line2": req.body.line2,
      "address.line3": req.body.line3,
    },
    {
      new: true,
    },
    (err, result) => {
      if (err) {
        console.log("Error - ", err);
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
      if (!result)
        return res
          .status(404)
          .send(transformError(defResponse.RES_USER_NOT_EXIST));
      console.log("Address result", result);
      const { name, email, phone, isAdmin, address } = result;
      return res.status(200).send({
        name,
        email,
        phone,
        isAdmin,
        address,
        userId: req.user.id,
      });
    }
  );
});

// get Cart information - using token ( Authenticated Call )
router.get("/cart", verifyUser, (req, res) => {
  Cart.findOne({ userId: req.user.id }, (err, result) => {
    if (err)
      return res.send(400).send(transformError(defResponse.RES_CART_ERR, err));
    res.status(200).send(result);
  });
});

// add to cart - using token ( Authenticated Call )
router.post("/cartadditem", verifyUser, (req, res) => {
  const {
    item_name,
    item_id,
    productCategory_name,
    category_name,
    image,
    size,
    price,
    quantity,
    _id,
  } = req.body.item;
  const itemList = req.body.item;
  itemList.totalCost = price * quantity;
  const itemToBeAdded = {
    userId: req.user.id,
    itemList: [itemList],
    total: price * quantity,
  };
  Cart.findOne({ userId: req.user.id }, (err, result) => {
    if (err) {
      return res
        .status(400)
        .send(transformError(defResponse.RES_CART_ERR, err));
    }
    if (result) {
      const obj = result.itemList.find(
        (item) => item.item_id === Number(item_id)
      );
      if (obj) {
        Cart.findOneAndUpdate(
          {
            userId: req.user.id,
            "itemList.item_id": item_id,
          },
          {
            $inc: {
              "itemList.$.quantity": quantity,
              "itemList.$.totalCost": price * quantity,
              total: quantity * price,
            },
          },
          { new: true },
          (err, result) => {
            if (err) {
              return res
                .status(400)
                .send(transformError(defResponse.RES_CART_ERR, err));
            }
            return res.status(200).send(result);
          }
        );
      } else {
        Cart.findOneAndUpdate(
          {
            userId: req.user.id,
          },
          {
            $push: {
              itemList: itemToBeAdded.itemList[0],
            },
            $inc: {
              total: quantity * price,
            },
          },
          { new: true },

          (err, result) => {
            if (err) {
              return res
                .status(400)
                .send(transformError(defResponse.RES_CART_ERR, err));
            }
            res.status(200).send(result);
          }
        );
      }
    } else {
      // create cart
      Cart.create(itemToBeAdded, (err, result) => {
        if (err) {
          return res
            .status(400)
            .send(transformError(defResponse.RES_CART_ERR, err));
        }
        res.status(200).send(result);
      });
    }
  });
});

// remove from cart - using token ( Authenticated Call )
router.post("/cartremoveitem", verifyUser, (req, res) => {
  const { _id, price, quantity } = req.body;
  Cart.findOneAndUpdate(
    { userId: req.user.id },
    {
      $pull: { itemList: { _id: _id } },
      $inc: {
        total: -(quantity * price),
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
      res.status(200).send(result);
    }
  );
});

// update cart item
router.post("/cartupdateitem", verifyUser, (req, res) => {
  const { item_id, price, quantity } = req.body;
  const itemList = req.body;
  itemList.totalCost = price * quantity;

  Cart.findOne({ userId: req.user.id }, (err, result) => {
    // Failed to fetch cart
    if (err) {
      return res
        .status(400)
        .send(transformError(defResponse.RES_CART_ERR, err));
    }
    // user found
    if (result) {
      const obj = result.itemList.find(
        (item) => item.item_id === Number(item_id)
      );
      // Obj is the item we need to update
      if (obj) {
        const oldTotal = result.total;
        const oldItemTotalCost = obj.totalCost;
        const newItemTotalCost = price * quantity;
        const newTotal = oldTotal - oldItemTotalCost + newItemTotalCost;
        Cart.findOneAndUpdate(
          {
            userId: req.user.id,
            "itemList.item_id": item_id,
          },
          {
            $set: {
              "itemList.$.quantity": quantity,
              "itemList.$.totalCost": price * quantity,
              total: newTotal,
            },
          },
          { new: true },
          (err, result) => {
            if (err) {
              return res
                .status(400)
                .send(transformError(defResponse.RES_CART_ERR, err));
            }
            return res.status(200).send(result);
          }
        );
      } else {
        // item not in cart - throw error
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
    } else {
      // cart not found - throw error
      return res
        .status(400)
        .send(transformError(defResponse.RES_CART_ERR, err));
    }
  });
});

// delete cart - using token ( Authenticated Call )
router.post("/deleteCart", verifyUser, (req, res) => {
  Cart.findOneAndDelete(
    { userId: req.user.id },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
      res.status(200).send({});
    }
  );
});

// get cart total items and cost - using token ( Authenticated Call )
router.post("/getTotalCart", verifyUser, (req, res) => {
  Cart.findOne({ userId: req.user.id }, (err, result) => {
    if (err) {
      return res
        .status(400)
        .send(transformError(defResponse.RES_CART_ERR, err));
    }
    res.status(200).send(result);
  });
});

router.post("/addorder", verifyUser, (req, res) => {
  const orderToAdd = req.body;
  orderToAdd.userId = req.user.id;
  Orders.create(orderToAdd, (err, result) => {
    if (err) {
      return res
        .status(400)
        .send(transformError(defResponse.RES_ORDER_ERR, err));
    }
    if (result) {
      res.status(200).send(result);
    }
  });
});

router.post("/updateOrder", verifyUser, (req, res) => {
  console.log("update order body received", req.body.orderId);
  Orders.findOneAndUpdate(
    {
      orderId: req.body.orderid,
    },
    {
      $set: {
        txnStatus: req.body.orderStatus,
        bank: req.body.bank,
        orderDate: req.body.date,
      },
    },
    { new: true },
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .send(transformError(defResponse.RES_CART_ERR, err));
      }
      console.log("update order ", result);

      return res.status(200).send(result);
    }
  );
});

router.get("/getOrders", verifyUser, (req, res) => {
  Orders.find(
    {
      userId: req.user.id,
    },
    (err, result) => {
      if (err) {
        return res
          .status(400)
          .send(transformError(defResponse.RES_ORDER_ERR, err));
      }
      return res.status(200).send(result);
    }
  );
});

module.exports = router;
