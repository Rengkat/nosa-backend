const mongoose = require("mongoose");

const OfficialSchema = new mongoose.Schema({
  post: {
    type: String,
    required: [true, "Please provide post"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});
module.exports = mongoose.model("Official", OfficialSchema);
