const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Showcase = require("../model/showcaseModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const addShowcase = async (req, res, next) => {
  try {
    const { image, title, caption } = req.body;

    if (!image || !caption || !title) {
      throw new CustomError.BadRequestError("Please provide all details");
    }

    await Showcase.create({
      image,
      title,
      caption,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Showcase added successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllShowcase = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalShowcases = await Showcase.countDocuments();

    const showcases = await Showcase.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalShowcases / limit);
    res
      .status(StatusCodes.OK)
      .json({ data: showcases, totalShowcases, currentPage: page, limit, totalPages });
  } catch (error) {
    next(error);
  }
};
const getSingleShowcase = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const singleShowcase = await Showcase.findById(id);
    if (!singleShowcase) {
      throw new CustomError.NotFoundError("Showcase not found");
    }
    res.status(StatusCodes.OK).json(singleShowcase);
  } catch (error) {
    next(error);
  }
};
const updateShowcase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { images, title, caption } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }

    const updatedShowcase = await Showcase.findByIdAndUpdate(
      id,
      { images, title, caption },
      { new: true, runValidators: true }
    );

    if (!updatedShowcase) {
      throw new CustomError.NotFoundError("Showcase not found");
    }

    res.status(StatusCodes.OK).json({
      message: "Showcase updated successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteShowcase = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const showcase = await Showcase.findByIdAndDelete(id);
    if (!showcase) {
      throw new CustomError.NotFoundError("Showcase not found");
    }
    res.status(StatusCodes.OK).json({ message: "Showcase deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
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
      folder: process.env.CLOUDINARY_SHOWCASE_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ imgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addShowcase,
  updateShowcase,
  deleteShowcase,
  getAllShowcase,
  getSingleShowcase,
  uploadImage,
};
