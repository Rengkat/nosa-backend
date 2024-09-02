const mongoose = require("mongoose");

const SetSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model("Set", SetSchema);
