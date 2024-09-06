const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Gallery = require("../model/galleryModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const fs = require("fs");

const addToGallery = async (req, res, next) => {
  try {
    const { images, title, caption, date } = req.body;

    // Check if required fields are provided
    if (!images || !images.length || !title || !date) {
      throw new CustomError.BadRequestError("Please provide all details");
    }

    // Create a new gallery entry
    const gallery = await Gallery.create({
      images,
      title,
      caption,
      date,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Image added to gallery",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllGalleryImages = async (req, res, next) => {
  try {
    const galleryImages = await Gallery.find();
    res.status(StatusCodes.OK).json(galleryImages);
  } catch (error) {
    next(error);
  }
};
const getSingleGalleryImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const singleGallery = await Gallery.findById(id);
    if (!singleGallery) {
      throw new CustomError.NotFoundError("Gallery not found");
    }
    res.status(StatusCodes.OK).json(singleGallery);
  } catch (error) {
    next(error);
  }
};
const updateGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { images, title, caption, date } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }

    const updatedGallery = await Gallery.findByIdAndUpdate(
      id,
      { images, title, caption, date },
      { new: true, runValidators: true }
    );

    if (!updatedGallery) {
      throw new CustomError.NotFoundError("Gallery not found");
    }

    res.status(StatusCodes.OK).json({
      message: "Gallery updated successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const removeFromGallery = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const singleGallery = await Gallery.findByIdAndDelete(id);
    if (!singleGallery) {
      throw new CustomError.NotFoundError("Gallery not found");
    }
    res.status(StatusCodes.OK).json({ message: "Item deleted from gallery", success: true });
  } catch (error) {
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    // Check if files are uploaded
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image files uploaded", success: false });
    }

    // Ensure the number of images does not exceed 3
    const imageFiles = Array.isArray(req.files.images) ? req.files.images : [req.files.images];

    if (imageFiles.length > 3) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "You can upload a maximum of 3 images", success: false });
    }

    const imageUrls = [];
    for (const imageFile of imageFiles) {
      if (!fs.existsSync(imageFile.tempFilePath)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ message: "File not found", success: false });
      }

      const result = await cloudinary.uploader.upload(imageFile.tempFilePath, {
        use_filename: true,
        folder: process.env.CLOUDINARY_GALLERY_FOLDER_NAME,
      });

      imageUrls.push(result.secure_url);

      // Remove the temporary file
      fs.unlinkSync(imageFile.tempFilePath);
    }

    return res.status(StatusCodes.CREATED).json({ imgUrls: imageUrls, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addToGallery,
  updateGallery,
  removeFromGallery,
  getAllGalleryImages,
  getSingleGalleryImage,
  uploadImage,
};
