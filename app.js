const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRouter = require("./Routers/AuthRouter");
const router = require("./Routers/Router");
const dotenv = require("dotenv");

dotenv.config();
mongoose.connect(process.env.mongoDbUrl);

let port = process.env.PORT || 8230;

app.use(cors({ origin: true, credentials: true }));
app.all("/*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "content-type,x-request-application,x-otp,sid "
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTION,PATCH"
  );
  next();
});
app.use("/api/auth", authRouter);
app.use("/api/", router);


app.listen(port, (res, err) => {
    if(err) console.log("Failed to start", err)
    console.log(`Running on port`, port);
})