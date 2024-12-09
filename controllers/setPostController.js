const CustomError = require("../errors");
const SetPost = require("../model/setPostModel");
const User = require("../model/userModel");
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
const getAllPost = async (req, res, next) => {};
const getSinglePost = async (req, res, next) => {};
const updatePost = async (req, res, next) => {};
const deletePost = async (req, res, next) => {};
module.exports = { createPost, updatePost, deletePost, getAllPost, getSinglePost };
