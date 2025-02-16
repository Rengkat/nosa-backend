const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const createSet = async (req, res, next) => {
  try {
    const { nosaSet, description, banner, coverImage } = req.body;
    if (!nosaSet) throw new CustomError.BadRequestError("Please provide set year");

    const existingSet = await NosaSet.findOne({ name: nosaSet });
    if (existingSet) throw new CustomError.BadRequestError("Set already exists");

    await NosaSet.create({ name: nosaSet, description, banner, coverImage });
    res.status(StatusCodes.CREATED).json({ message: "A set created successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const updateSet = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const { name, banner, coverImage, description } = req.body;

    const updatedSet = await NosaSet.findByIdAndUpdate(
      setId,
      { name, banner, coverImage, description },
      { new: true }
    );
    if (!updatedSet) throw new CustomError.NotFoundError("Set not found");

    res.status(StatusCodes.OK).json({ message: "Set updated successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const getAllSets = async (req, res, next) => {
  try {
    const sets = await NosaSet.find().sort("name");

    res.status(StatusCodes.OK).json({ sets });
  } catch (error) {
    next(error);
  }
};

const getSetVerifiedMembers = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const nosaSet = await NosaSet.findById(setId).populate({
      path: "members",
      match: { isSetAdminVerify: true },
      select: "-password",
    });

    if (!nosaSet) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Set not found" });
    }

    // Paginate the members
    const totalSetMembers = nosaSet.members.length;
    const totalPages = Math.ceil(totalSetMembers / limit);
    const members = nosaSet.members.slice(skip, skip + limit);

    res.status(StatusCodes.OK).json({
      data: members,
      totalSetMembers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

const getSetUnVerifiedMembers = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find the set and populate members
    const nosaSet = await NosaSet.findById(setId).populate({
      path: "members",
      match: { isSetAdminVerify: false },
      select: "-password",
    });
    if (!nosaSet) {
      throw new CustomError.NotFoundError("Set not found");
    }
    //
    // Paginate the members
    const totalSetMembers = nosaSet.members.length;
    const totalPages = Math.ceil(totalSetMembers / limit);
    const members = nosaSet.members.slice(skip, skip + limit);

    res.status(StatusCodes.OK).json({
      data: members,
      totalSetMembers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

// const getSetAdmins = async (req, res, next) => {
//   try {
//     const setAdmins = await User.find({ role: "setAdmin" })
//       .sort("-yearOfGraduation")
//       .select("-password");
//     res.status(StatusCodes.OK).json({ setAdmins });
//   } catch (error) {
//     next(error);
//   }
// };
const getSingleSet = async (req, res, next) => {
  try {
    const { setId } = req.params;
    if (!setId) {
      throw new CustomError.BadRequestError("Please provide set ID");
    }
    const set = await NosaSet.findById(setId);
    if (!set) {
      throw new CustomError.NotFoundError("Set not found");
    }
    res.status(StatusCodes.OK).json({ set });
  } catch (error) {
    next(error);
  }
};
const uploadBannerImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_SET_BANNER_FOLDER_NAME,
    });

    // Remove the temp file after upload
    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.OK).json({
      message: "Banner image updated successfully",
      success: true,
      imgUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
const uploadCoverImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_SET_COVER_IMAGE_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.OK).json({
      message: "Cover image updated successfully",
      success: true,
      imgUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSet,
  getAllSets,
  getSetVerifiedMembers,
  getSetUnVerifiedMembers,
  uploadBannerImage,
  uploadCoverImage,
  updateSet,
  getSingleSet,
};
