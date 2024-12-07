const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // Reference to the user who uploaded the media
    },
    tags: {
      type: [String], // Array of tags for categorization
    },
    isPublic: {
      type: Boolean,
      default: true, // Determines visibility
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User", // Array of users who liked the media
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now, // Timestamp for when the media was uploaded
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Media = mongoose.model("Media", MediaSchema);

module.exports = Media;
