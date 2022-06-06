const express = require("express");

const bodyparser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: "*",
  optionSuccessStatus: 200,
};

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(cors(corsOptions));

// DB Connection
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@maccluster.rphewph.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

console.log(process.env.USER);

mongoose
  .connect(uri)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("Error: " + error));

app.get("/", (request, result) =>
  result.json({
    status: true,
    message: "lets get it",
  })
);

const PORT = process.env.PORT || "3000";

app.listen(PORT, () =>
  console.log("Server on http://localhost:" + PORT + "/ or --:" + PORT + "/")
);
