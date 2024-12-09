const CustomError = require("../errors");
const SetMedia = require("../model/setMediaModel");
const { StatusCodes } = require("http-status-codes");
const addImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      throw new CustomError.BadRequestError("Please provide image URL");
    }
    await SetMedia.create({ imageUrl });
    res.status(StatusCodes.CREATED).json({ message: "Media added successfully", success: true });
  } catch (error) {
    next(error);
  }
};

// Delete Image
const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide media ID");
    }
    const image = await SetMedia.findByIdAndDelete(id);
    if (!image) {
      throw new CustomError.NotFoundError("Image not found");
    }
    res.status(StatusCodes.OK).json({ message: "Image deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

// Upload Image to Cloudinary
const uploadSetMediaImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      throw new CustomError.BadRequestError("No image file uploaded");
    }

    if (!fs.existsSync(req.files.image.tempFilePath)) {
      throw new CustomError.BadRequestError("Temporary file not found");
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_SET_MEDIA_FOLDER_NAME || "default_folder",
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    res.status(StatusCodes.CREATED).json({ mediaImgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addImage,
  deleteImage,
  uploadSetMediaImage,
};
