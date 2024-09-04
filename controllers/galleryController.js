const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Gallery = require("../model/galleryModel");
const addToGallery = async (req, res, next) => {
  try {
    const { image, title, caption, date } = req.body;
    if (!image || !title || !caption || !date) {
      throw new CustomError.BadRequestError("Please provide all details");
    }
    await Gallery.create(image, title, caption, date);
    res.status(StatusCodes.CREATED).json({ message: "Image added to gallery", success: true });
  } catch (error) {
    next(error);
  }
};
const getAllGalleryImages = async (req, res, next) => {};
const getSingleGalleryImage = async (req, res, next) => {};
const updateGallery = async (req, res, next) => {};
const removeFromGallery = async (req, res, next) => {};
const uploadImage = async (req, res, next) => {};

module.exports = {
  addToGallery,
  updateGallery,
  removeFromGallery,
  getAllGalleryImages,
  getSingleGalleryImage,
  uploadImage,
};
