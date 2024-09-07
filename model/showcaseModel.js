const mongoose = require("mongoose");

const ShowcaseSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },
    caption: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Showcase", ShowcaseSchema);
