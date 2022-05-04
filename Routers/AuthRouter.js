const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserSchema");
const Cart = require("../Model/CartSchema");

const defResponse = require("../Response/Default");
// import defResponse from "../Response/Default"
const { transformError } = require("../Response/Errors");
const dotenv = require("dotenv");
const verifyUser = require("../Middlewares/AuthVerifyUser");
const verifyAdmin = require("../Middlewares/AuthVerifyAdmin");
dotenv.config();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

let secret = process.env.jwtSeceret;

// router.all("/*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "content-type,x-request-application,x-otp,sid "
//   );
//   res.header(
//     "Access-Control-Allow-Methods",
//     "GET,PUT,POST,DELETE,OPTION,PATCH"
//   );
//   next();
// });

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
        let jwtToken = jwt.sign({ id: user._id }, secret, {
          expiresIn: "1800s",
        });
        res.status(200).send({ auth: true, token: jwtToken });
      }
    }
  });
});

// User information for self
router.get("/profile", verifyUser, (req, res) => {
  User.findOne({ _id: req.user.id }, (err, user) => {
    res.status(200).send({
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  });
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
  const itemToBeAdded = {
    userId: req.user.id,
    itemList: [
      {
        name: req.body.item_name,
        quantity: req.body.quantity,
        id: req.body.item_id,
        _id: req.body._id,
        size: req.body.size,
        price: req.body.price,
      },
    ],
  };
  Cart.findOne({ userId: req.user.id }, (err, result) => {
    if (err)
      return res
        .status(400)
        .send(transformError(defResponse.RES_CART_ERR, err));
    if (result) {
      console.log(result);
      const obj = result.itemList.find((item) => item._id === req.body._id);
      if (obj) {
        Cart.updateOne(
          {
            userId: req.user.id,
            "itemList.id": req.body.item_id,
          },
          {
            $inc: {
              "itemList.$.quantity": req.body.quantity,
              total: req.body.quantity * req.body.price,
            },
          },
          (err, result) => {
            if (err)
              return res
                .status(400)
                .send(transformError(defResponse.RES_CART_ERR, err));
            return res.status(200).send(result);
          }
        );
      } else {
        Cart.updateOne(
          
          {
            userId: req.user.id,
          },
          {
            $push: {
              itemList: itemToBeAdded.itemList[0],
            },
            $inc: {
              total: req.body.quantity * req.body.price,
            },
          },
          (err, result) => {
            if (err)
              return res
                .status(400)
                .send(transformError(defResponse.RES_CART_ERR, err));
            console.log(result)
            res.status(200).send(result);
          }
        );
      }
    } else {
      // create cart
      Cart.create(itemToBeAdded, (err, result) => {
        if (err) {
          console.log(err);
          return res
            .status(400)
            .send(transformError(defResponse.RES_CART_ERR, err));
        }
        res.status(200).send("Cart Created");
      });
    }
  });
});

// remove from cart - using token ( Authenticated Call )
router.post("/cartremoveitem", verifyUser, (req, res) => {
  Cart.updateOne(
    { userId: req.user.id },
    {
      $pull: { itemList: { "_id": req.body._id } },
    },
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

module.exports = router;
