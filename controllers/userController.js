const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(StatusCodes.OK).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
