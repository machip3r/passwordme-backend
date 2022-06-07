const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  id_user: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
});

module.exports = mongoose.model("Category", categorySchema);
