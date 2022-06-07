const express = require("express");

const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

const app = express();

const authRoutes = require("./routes/auth.js");
const passwordRoutes = require("./routes/password.js");
const verify = require("./routes/verify.js");

const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};

dotenv.config();
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors(corsOptions));
app.use(express.static(path.join(__dirname, "upload")));

app.use("/user", authRoutes);
app.use("/passwords", verify, passwordRoutes);

module.exports = app;
