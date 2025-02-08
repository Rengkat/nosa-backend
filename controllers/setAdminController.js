const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");

const getSetAllAdmins = async (req, res, next) => {
  try {
    const setAdmins = await User.find({ role: "setAdmin" })
      .sort("-yearOfGraduation")
      .select("-password");
    res.status(StatusCodes.OK).json({ setAdmins });
  } catch (error) {
    next(error);
  }
};
module.exports = { getAllSetAdmins };
