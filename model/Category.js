const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  category: {
    type: String,
    required: true,
    minLength: 1,
    maxLength: 20,
  },
});

module.exports = mongoose.model("Category", categorySchema);
