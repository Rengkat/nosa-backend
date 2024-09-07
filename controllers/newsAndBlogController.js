const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NewsAndBlog = require("../model/newsAndBlogModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const addNewsAndBlog = async (req, res, next) => {
  try {
    const { image, title, content, category, user } = req.body;

    // Check if required fields are provided
    if (!image || !content || !title || !category || user) {
      throw new CustomError.BadRequestError("Please provide all details");
    }

    await NewsAndBlog.create({
      image,
      title,
      content,
      category,
      user,
    });

    res.status(StatusCodes.CREATED).json({
      message: `A(an) ${category} has been published`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllNewsAndBlogs = async (req, res, next) => {
  try {
    //add pagination
    const newsAndBlogs = await NewsAndBlog.find();
    res.status(StatusCodes.OK).json(newsAndBlogs);
  } catch (error) {
    next(error);
  }
};
const getSingleNewsOrBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const singleArticle = await NewsAndBlog.findById(id).populate("user", "-password");
    if (!singleArticle) {
      throw new CustomError.NotFoundError("Article not found");
    }
    res.status(StatusCodes.OK).json(singleArticle);
  } catch (error) {
    next(error);
  }
};
const updateNewsOrBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, title, content, category, user } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }

    const updatedNewsOrBlog = await NewsAndBlog.findByIdAndUpdate(
      id,
      { image, title, content, category, user },
      { new: true, runValidators: true }
    );

    if (!updatedNewsOrBlog) {
      throw new CustomError.NotFoundError("Resources not found");
    }

    res.status(StatusCodes.OK).json({
      message: `${updatedNewsOrBlog.category} updated successfully`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const removeNewsOrBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const singleNewsOrBlog = await NewsAndBlog.findByIdAndDelete(id);
    if (!singleNewsOrBlog) {
      throw new CustomError.NotFoundError("Result not found");
    }
    res
      .status(StatusCodes.OK)
      .json({ message: `${singleNewsOrBlog.category} deleted successfully`, success: true });
  } catch (error) {
    next(error);
  }
};

const uploadNewsOrBlogImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    if (!fs.existsSync(req.files.image.tempFilePath)) {
      // the file path
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "File not found", success: false });
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_NEWS_AND_BLOG_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ imgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addNewsAndBlog,
  updateNewsOrBlog,
  removeNewsOrBlog,
  getAllNewsAndBlogs,
  getSingleNewsOrBlog,
  uploadNewsOrBlogImage,
};