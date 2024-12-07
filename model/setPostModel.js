const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Post content is required"],
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    set: { type: mongoose.Schema.ObjectId, ref: "Set", required: [true, "Set is required"] },
    author: {
      name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Author is required"],
      },
      avatar: {
        type: String, // URL to the author's avatar
        required: true,
      },
    },
    interactions: {
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
      shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
