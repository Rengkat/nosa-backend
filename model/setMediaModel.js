const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: [String],
      required: [true, "At least one image URL is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    nosaSet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NosaSet",
      required: true,
    },
    tags: {
      type: [String],
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Media = mongoose.model("Media", MediaSchema);

module.exports = Media;
