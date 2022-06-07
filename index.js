const app = require("./app.js");
const connection = require("./model/connection.js");
const PORT = process.env.PORT || "3000";

app.listen(PORT, () =>
  console.log("Server on http://localhost:" + PORT + "/ or --:" + PORT + "/")
);
