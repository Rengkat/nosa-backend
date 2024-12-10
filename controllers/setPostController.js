const CustomError = require("../errors");
const SetPost = require("../model/setPostModel");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res, next) => {
  try {
    const { content, image, set, author } = req.body;

    if (!content || !set || !author) {
      throw new CustomError.BadRequestError("Please provide content, set, and author details");
    }

    if (req.user.set !== set) {
      throw new CustomError.UnauthorizedError(
        "You are not authorized to post in this group. You are not a set member"
      );
    }
    await SetPost.create({ content, image, set, author });

    res.status(StatusCodes.CREATED).json({ message: "Post created successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const getAllPost = async (req, res, next) => {
  try {
    const { setId } = req.query; //
    if (!setId) {
      throw new CustomError.BadRequestError("Please provide set ID");
    }

    const posts = await SetPost.find({ set: setId })
      .populate("set", "name")
      .populate("author.name", "firstName surname")
      .populate("interactions.likes", "firstName surname")
      .populate("interactions.dislikes", "firstName surname")
      .populate("interactions.comments");

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
      .populate("set", "name")
      .populate("author.name", "firstName lastName")
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

    if (!id) {
      throw new CustomError.BadRequestError("Please provide post ID");
    }

    const post = await SetPost.findById(id);

    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }

    post.set(req.body);
    await post.save();

    res.status(StatusCodes.OK).json({ message: "Post updated successfully", success: true });
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
module.exports = { createPost, updatePost, deletePost, getAllPost, getSinglePost };
