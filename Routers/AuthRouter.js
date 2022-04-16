const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserSchema");
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
            isAdmin: req.body.isAdmin ? req.body.isAdmin: false,
            phone: req.body.phone
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
          expiresIn: 1800000,
        });
        res.status(200).send({ auth: true, token: jwtToken });
      }
    }
  });
});

// User information for self
router.get('/profile', verifyUser, (req, res) => {
    User.findOne({"_id":req.user.id}, (err, user) => {
        res.status(200).send({
            name: user.name,
            email: user.email,
            phone: user.phone,
            isAdmin: user.isAdmin
        })
    })
})

module.exports = router;
