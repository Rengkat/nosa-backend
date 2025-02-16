const mongoose = require("mongoose");

const NewsAndBlogSchema = new mongoose.Schema(
  {
    image: { type: String, required: [true, "Please provide image link"] },
    title: { type: String, required: [true, "Please provide the title"], maxLength: 100 },
    description: { type: String },
    content: { type: String, required: [true, "Please provide the content"] },
    user: { type: mongoose.Types.ObjectId, ref: "User" },
    category: {
      type: String,
      enum: ["news", "blog"],
      required: [true, "Please select category"],
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("NewsAndBlog", NewsAndBlogSchema);
