const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../Model/UserSchema");
const defResponse = require("../Response/Default");
// import defResponse from "../Response/Default"
const { transformError } = require("../Response/Errors");

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.send("Hello! Welcome to auth router");
});

// Fetch all users
router.get("/users", (req, res) => {
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
            role: req.body.role ? req.body.role : "User",
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
      return res.status(404).send();
    }
  });
});

module.exports = router;
