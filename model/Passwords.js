const mongoose = require("mongoose");

const passwordsSchema = mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  list: [
    {
      id_category: Array,
      title: String,
      username: String,
      email: String,
      password: String,
      security: Number,
      notes: String,
      visits: Number,
      url: String,
      urlLogo: String,
      date: Date,
    },
  ],
});

module.exports = mongoose.model("Passwords", passwordsSchema);
