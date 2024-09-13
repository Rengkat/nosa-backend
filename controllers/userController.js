const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const NosaSet = require("../model/setModel");
const path = require("node:path");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const { checkPermission } = require("../utils");
const getAllVerifiedUsers = async (req, res, next) => {
  try {
    const { name } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isVerified: true };

    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { surname: { $regex: name, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query).select("-password").skip(skip).limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(StatusCodes.OK).json({
      success: true,
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};
const getAllUnverifiedUsers = async (req, res, next) => {
  try {
    const { name } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { isVerified: false };

    if (name) {
      query.$or = [
        { firstName: { $regex: name, $options: "i" } },
        { surname: { $regex: name, $options: "i" } },
      ];
    }

    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query).select("-password").skip(skip).limit(limit);

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(StatusCodes.OK).json({
      success: true,
      users,
      totalUsers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleUser = async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("-password");
  if (!user) {
    const error = new CustomError.NotFoundError(`No user with id: ${userId}`);
    return next(error);
  }

  res.status(StatusCodes.OK).json({ success: true, user });
};
const deleteUser = async (req, res) => {
  const userId = req.params.userId;
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User not found" });
  }
  res.status(StatusCodes.OK).json({ success: true, message: "User successfully deleted" });
};
const updateCurrentUser = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { yearOfGraduation } = req.body;

    const user = await User.findById(id);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    if (!yearOfGraduation) {
      throw new CustomError.NotFoundError("Provide all details");
    }

    const nosaSet = await NosaSet.findOne({ name: yearOfGraduation });
    if (!nosaSet) {
      throw new CustomError.NotFoundError("NOSA Set not found");
    }

    user.set(req.body);

    // Set the user's nosaSet reference
    user.nosaSet = nosaSet._id;

    await user.save();

    // Add user to the NOSA Set's members array if not already added
    if (!nosaSet.members.includes(id)) {
      nosaSet.members.push(id);
      await nosaSet.save();
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Your credentials were successfully updated",
    });
  } catch (error) {
    next(error);
  }
};
const verifyUser = async (req, res, next) => {
  try {
    const userId = req.body.id || req.params.id;

    if (!userId) {
      throw new CustomError.BadRequestError("User ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    if (user.isVerified) {
      return res.status(StatusCodes.OK).json({
        success: true,
        message: "User is already verified",
      });
    }

    user.isVerified = true;
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User is now verified",
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const currentUser = await User.findById(req.user.id);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    checkPermission(currentUser, user);

    user.set(req.body);
    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "User credentials were successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

const uploadUserImage = async (req, res, next) => {
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
      folder: process.env.CLOUTINARY_FOLDER_NAME_USER_IMAGES,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ imgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllVerifiedUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
  updateUser,
  verifyUser,
  uploadUserImage,
  getAllUnverifiedUsers,
};
