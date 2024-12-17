const mongoose = require("mongoose");

const NosaSetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide set name!"],
    unique: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  banner: {
    type: String,
  },
  coverImage: {
    type: String,
  },
});

module.exports = mongoose.model("NosaSet", NosaSetSchema);
