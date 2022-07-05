const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 100,
  },
  password: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 150,
  },
});

module.exports = mongoose.model("User", userSchema);
