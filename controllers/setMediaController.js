const CustomError = require("../errors");
const SetMedia = require("../model/setMediaModel");
const { StatusCodes } = require("http-status-codes");

const addImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      throw new CustomError.BadRequestError("Please provide image url");
    }
    await SetMedia.create({ imageUrl });
    res.status(StatusCodes.CREATED).json({ message: "Media added successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const deleteImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide media Id");
    }
    const image = await SetMedia.findByIdAndDelete(id);
    if (!image) {
      throw new CustomError.NotFoundError("Image not found");
    }
    res.status(StatusCodes.OK).json({ message: "Image deleted successfully", success: true });
  } catch (error) {
    next(error);
    // 08146957156
  }
};
const uploadSetMediaImage = async (req, res, next) => {
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
      folder: process.env.CLOUDINARY_SET_MEDIA_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ mediaImgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addImage,
  deleteImage,
  uploadSetMediaImage,
};
