const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const authRouter = require("./Routers/AuthRouter");
const router = require("./Routers/Router");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
mongoose.connect(process.env.mongoDbUrl);

let port = process.env.PORT || 8230;
console.log("Domain allowed ", process.env.allowDomain);
app.use(
  cors({
    credentials: true,
    origin: process.env.allowDomain,
  })
);
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.allowDomain);
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/", router);

app.listen(port, (res, err) => {
  if (err) console.log("Failed to start", err);
  console.log(`Running on port`, port);
});
