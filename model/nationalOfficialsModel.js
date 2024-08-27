const mongoose = require("mongoose");

const OfficialSchema = new mongoose.Schema({
  post: {
    type: String,
    enum: [
      "President",
      "Vice President",
      "Secretary General",
      "Assistant Secretary",
      "Financial Secretary",
      "Treasurer",
      "Welfare & Social Secretary",
      "Legal Advisor",
      "Deputy Legal Advisor",
      "Publicity Secretary",
      "Auditor",
    ],
    required: [true, "Every official must have a post"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Please provide user"],
  },
});
module.exports = mongoose.model("Official", OfficialSchema);
