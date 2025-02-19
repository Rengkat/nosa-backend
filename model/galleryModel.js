const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema(
  {
    images: [
      {
        type: String,
        required: true,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    caption: { type: String, required: false },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Gallery", GallerySchema);
