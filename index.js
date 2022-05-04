const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const authRouter = require("./Routers/AuthRouter");
const router = require("./Routers/Router");
const dotenv = require("dotenv");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

dotenv.config();
mongoose.connect(process.env.mongoDbUrl);

let port = process.env.PORT || 8230;

// // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
// app.all("*", (req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "https://localhost:3000");
//   next();
// });

app.use(cors(corsOptions));
app.use("/api/auth", authRouter);
app.use("/api/", router);

app.listen(port, (res, err) => {
  if (err) console.log("Failed to start", err);
  console.log(`Running on port`, port);
});
