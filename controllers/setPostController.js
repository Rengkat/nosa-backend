const CustomError = require("../errors");
const SetPost = require("../model/setPostModel");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const createPost = async (req, res, next) => {
  try {
    const { content, image, nosaSet, isPinned } = req.body;
    console.log({ content, image, nosaSet, isPinned });
    if (!content || !nosaSet) {
      throw new CustomError.BadRequestError("Please provide content and set");
    }

    if (req.user.nosaSet !== nosaSet) {
      throw new CustomError.UnauthorizedError(
        "You are not authorized to post in this group. You are not a set member"
      );
    }
    await SetPost.create({ content, image, nosaSet, author: req.user.id, isPinned });

    res.status(StatusCodes.CREATED).json({ message: "Post created successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const getAllPost = async (req, res, next) => {
  try {
    const { setId } = req.query;
    if (!setId) {
      throw new CustomError.BadRequestError("Please provide set ID");
    }
    const posts = await SetPost.find({ nosaSet: setId })
      .sort("-createdAt")
      .populate("nosaSet", "name")
      .populate("author", "firstName surname, image")
      .populate("interactions.likes", "firstName surname")
      .populate("interactions.dislikes", "firstName surname")
      .populate({
        path: "interactions.comments",
        populate: { path: "author", select: "firstName surname" }, // Nested populate for comments' authors
      });

    res.status(StatusCodes.OK).json({ posts, success: true });
  } catch (error) {
    next(error);
  }
};
const getSinglePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError.BadRequestError("Please provide post ID");
    }

    const post = await SetPost.findById(id)
      .populate("nosaSet", "name")
      .populate("author", "firstName lastName")
      .populate("interactions.likes", "firstName lastName")
      .populate("interactions.dislikes", "firstName lastName")
      .populate("interactions.comments");

    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    res.status(StatusCodes.OK).json({ post, success: true });
  } catch (error) {
    next(error);
  }
};
const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content, isPinned } = req.body;

    if (!id) {
      throw new CustomError.BadRequestError("Please provide post ID");
    }

    const post = await SetPost.findById(id);

    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    post.content = content;
    post.isPinned = isPinned;
    await post.save();

    res.status(StatusCodes.OK).json({ message: "Post updated successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const likePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    // Find the post by ID
    const post = await SetPost.findById(postId);
    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    let message = "";

    // Check if the user has already liked the post
    if (post.interactions.likes.includes(userId)) {
      // Remove the like
      post.interactions.likes = post.interactions.likes.filter(
        (like) => like.toString() !== userId
      );
      message = "Post unliked successfully";
    } else {
      // Check if the user has disliked the post
      if (post.interactions.dislikes.includes(userId)) {
        // Remove the dislike
        post.interactions.dislikes = post.interactions.dislikes.filter(
          (dislike) => dislike.toString() !== userId
        );
      }

      // Add the like
      post.interactions.likes.push(userId);
      message = "Post liked successfully";
    }

    // Save the post after updating interactions
    await post.save();

    // Return a response with the appropriate message
    return res.status(StatusCodes.OK).json({ message });
  } catch (error) {
    next(error);
  }
};
const dislikePost = async (req, res, next) => {
  try {
    const { postId } = req.body;
    const userId = req.user.id;

    // Find the post by ID
    const post = await SetPost.findById(postId);
    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    let message = "";

    // Check if the user has already disliked the post
    if (post.interactions.dislikes.includes(userId)) {
      // Remove the dislike
      post.interactions.dislikes = post.interactions.dislikes.filter(
        (dislike) => dislike.toString() !== userId
      );
      message = "Dislike removed successfully";
    } else {
      // Check if the user has liked the post
      if (post.interactions.likes.includes(userId)) {
        // Remove the like
        post.interactions.likes = post.interactions.likes.filter(
          (like) => like.toString() !== userId
        );
      }

      // Add the dislike
      post.interactions.dislikes.push(userId);
      message = "Post disliked successfully";
    }

    // Save the post after updating interactions
    await post.save();

    // Return a response with the appropriate message
    return res.status(StatusCodes.OK).json({ message });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new CustomError.BadRequestError("Please provide post ID");
    }

    const post = await SetPost.findByIdAndDelete(id);

    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    res.status(StatusCodes.OK).json({ message: "Post deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const uploadImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      throw new CustomError.BadRequestError("No image file uploaded");
    }

    if (!fs.existsSync(req.files.image.tempFilePath)) {
      throw new CustomError.BadRequestError("Temporary file not found");
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_SET_POST_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(StatusCodes.CREATED).json({ postImgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createPost,
  updatePost,
  deletePost,
  getAllPost,
  getSinglePost,
  likePost,
  dislikePost,
  uploadImage,
};
