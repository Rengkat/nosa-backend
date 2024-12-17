const CustomError = require("../errors");
const SetMedia = require("../model/setMediaModel");
const { StatusCodes } = require("http-status-codes");
const addImage = async (req, res, next) => {
  try {
    const { imageUrl, caption, nosaSet, uploadedBy } = req.body;
    if (!imageUrl) {
      throw new CustomError.BadRequestError("Please provide image URL");
    }
    if (!nosaSet) {
      throw new CustomError.BadRequestError("Please provide nosa set");
    }
    await SetMedia.create({ imageUrl, caption, nosaSet, uploadedBy });
    res.status(StatusCodes.CREATED).json({ message: "Media added successfully", success: true });
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
  addImage,
  deleteImage,
  uploadSetMediaImage,
  getAllSetMedia,
};
