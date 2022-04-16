const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const User = require("../Model/UserSchema");

dotenv.config();

const secretJWTToken = process.env.jwtSeceret;

module.exports = (req, res, next) => {
  let id = req.user.id;
  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send(transformError(defResponse.RES_SERVER_ERROR, err));
    } else {
      if (!user.isAdmin) {
        return res.status(404).send("Access Denied");
      }
      next();
    }
  });
};
