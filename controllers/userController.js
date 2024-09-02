const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const path = require("node:path");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");
const { checkPermission } = require("../utils");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
const getAllSameSetUsers = async (req, res, next) => {
  try {
    const { set } = req.params;
    // console.log(set);
    if (!set) {
      throw new CustomError.BadRequestError("Please provide set");
    }
    const users = await User.find({ yearOfGraduation: set }).select("-password");
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
const getAllSetAdmins = async (req, res, next) => {
  try {
    const users = await User.find({ role: "setAdmin" }).sort("yearOfGraduation");
    res.status(StatusCodes.OK).json({ success: true, users });
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
    const user = await User.findById(id);

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Update user fields
    user.set(req.body);

    await user.save();

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Your credentials were successfully updated",
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
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUTINARY_FOLDER_NAME,
    });
    fs.unlinkSync(req.files.image.tempFilePath);
    return res.status(StatusCodes.CREATED).json({ imgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
  updateUser,
  uploadUserImage,
  getAllSameSetUsers,
};
