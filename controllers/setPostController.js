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

    // Find the post by ID
    const post = await SetPost.findById(postId);
    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    const userId = req.user.id;

    if (post.interactions.likes.includes(userId)) {
      post.interactions.likes = post.interactions.likes.filter(
        (like) => like.toString() !== userId
      );
      await post.save();
      return res.status(StatusCodes.OK).json({ message: "Post unliked successfully" });
    }

    post.interactions.likes.push(userId);
    await post.save();
    return res.status(StatusCodes.OK).json({ message: "Post liked successfully" });
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
module.exports = { createPost, updatePost, deletePost, getAllPost, getSinglePost, uploadImage };
