const mongoose = require("mongoose");
const TokenSchema = new mongoose.Schema({
  refreshToken: { type: String },
  ip: { type: String },
  userAgent: { type: String },
  isValid: { type: Boolean, default: true },
  user: { type: mongoose.Schema.ObjectId, ref: "User" },
});
module.exports = mongoose.model("Token", TokenSchema);
