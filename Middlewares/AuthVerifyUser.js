const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const { RES_ACCESS_DENIED_NO_TOKEN } = require("../Response/Default");
const { transformError } = require("../Response/Errors");
dotenv.config();

const secretJWTToken = process.env.jwtSeceret;

module.exports = async (req, res, next) => {
  const authHeader = req.headers.cookie;

  if (!authHeader)
    return res
      .status(404)
      .send(transformError(RES_ACCESS_DENIED_NO_TOKEN, "No cookie found"));
  const tokenCookie = authHeader
    .split(";")
    .filter((cookie) => cookie.split("=")[0].replace(" ", "") === "token");
  const token = tokenCookie.toString().split("=")[1];

  if (!token)
    return res
      .status(404)
      .send(transformError(RES_ACCESS_DENIED_NO_TOKEN, "No token found"));
  try {
    const verifiedUser = await jwt.verify(token, secretJWTToken);
    req.user = verifiedUser;
    next();
  } catch (error) {
    res.status(400).send(transformError(RES_ACCESS_DENIED_NO_TOKEN, error));
  }
};
