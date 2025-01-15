const { default: mongoose } = require("mongoose");
const CustomError = require("../errors");
const SetMedia = require("../model/setMediaModel");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const addImage = async (req, res, next) => {
  try {
    const { imageUrl, caption, nosaSet } = req.body;

    if (!imageUrl || !Array.isArray(imageUrl) || imageUrl.length === 0) {
      throw new CustomError.BadRequestError("Please provide at least one image URL");
    }
    if (!nosaSet) {
      throw new CustomError.BadRequestError("Please provide a valid nosa set");
    }

    if (!mongoose.Types.ObjectId.isValid(nosaSet)) {
      throw new CustomError.BadRequestError("Invalid Nosa Set ID format");
    }

    await SetMedia.create({
      imageUrl,
      caption,
      nosaSet,
      uploadedBy: req.user.id,
    });

    res.status(StatusCodes.CREATED).json({
      message: "Media added successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllSetMedia = async (req, res, next) => {
  try {
    const { setId } = req.query;
    if (!setId) {
      throw new CustomError.BadRequestError("Please provide set ID");
    }
    const setMedia = await SetMedia.find({ nosaSet: setId });
    res.status(StatusCodes.OK).json({ setMedia, success: true });
  } catch (error) {
    next(error);
  }
};

const getSingleDetailMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide ID");
    }
    const media = await SetMedia.findById(id);
    res.status(StatusCodes.OK).json({ media, success: true });
  } catch (error) {}
};
const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imageUrl } = req.body;

    if (!id) {
      throw new CustomError.BadRequestError("Please provide media ID");
    }

    const media = await SetMedia.findById(id);
    if (!media) {
      throw new CustomError.NotFoundError("Media not found");
    }

    if (imageUrl) {
      const updatedImageUrls = media.imageUrl.filter((url) => url !== imageUrl);

      if (updatedImageUrls.length === 0) {
        await SetMedia.findByIdAndDelete(id);
        return res.status(StatusCodes.OK).json({
          message: "Media deleted as no images remain",
          success: true,
        });
      }

      media.imageUrl = updatedImageUrls;
      await media.save();

      return res.status(StatusCodes.OK).json({
        message: "Image deleted successfully",
        success: true,
        updatedMedia: media,
      });
    }

    await SetMedia.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json({
      message: "Media deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// Upload Image to Cloudinary
const uploadSetMediaImage = async (req, res, next) => {
  try {
    // Check if files are uploaded
    if (!req.files || !req.files.images || req.files.images.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image files uploaded", success: false });
    }

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
        folder: process.env.CLOUDINARY_SET_MEDIA_FOLDER_NAME,
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
  addImage,
  getSingleDetailMedia,
  deleteImage,
  uploadSetMediaImage,
  getAllSetMedia,
};
