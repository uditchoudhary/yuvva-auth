const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const authRouter = require("./Routers/AuthRouter");
const router = require("./Routers/Router");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

dotenv.config();
mongoose.connect(process.env.mongoDbUrl);

let port = process.env.PORT || 8230;

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000", "http://yuvva.herokuapp.com/"],
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/", router);


app.listen(port, (res, err) => {
    if(err) console.log("Failed to start", err)
    console.log(`Running on port`, port);
})