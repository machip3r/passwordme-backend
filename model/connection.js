const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@maccluster.rphewph.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;

mongoose
  .connect(uri)
  .then(() => console.log("DB Connected!"))
  .catch((error) => console.log("Error: " + error));

module.exports = mongoose;
