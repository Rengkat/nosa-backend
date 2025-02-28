const mongoose = require("mongoose");
const validator = require("validator");

const NewsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
});
module.exports = mongoose.model("NewsLetter", NewsLetterSchema);
