const CustomError = require("../errors");
const SetPost = require("../model/setPostModel");
const { StatusCodes } = require("http-status-codes");

const createPost = async (req, res, next) => {
  try {
    const {} = req.body;
  } catch (error) {
    next(error);
  }
};
const getAllPost = async (req, res, next) => {};
const getSinglePost = async (req, res, next) => {};
const updatePost = async (req, res, next) => {};
const deletePost = async (req, res, next) => {};
module.exports = { createPost, updatePost, deletePost, getAllPost, getSinglePost };
