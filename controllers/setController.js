const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");
const createSet = async (req, res, next) => {
  try {
    const { nosaSet } = req.body;
    if (!nosaSet) throw new CustomError.BadRequestError("Please provide set year");

    const existingSet = await NosaSet.findOne({ name: nosaSet });
    if (existingSet) throw new CustomError.BadRequestError("Set already exists");

    await NosaSet.create({ name: nosaSet });
    res.status(StatusCodes.CREATED).json({ message: "A set created successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const getAllSets = async (req, res, next) => {
  try {
    const sets = await NosaSet.find();
    res.status(StatusCodes.OK).json({ sets });
  } catch (error) {
    next(error);
  }
};

const getSetMembers = async (req, res, next) => {
  try {
    const { set } = req.params;
    const members = await User.find({ yearOfGraduation: set }).select("-password");
    res.status(StatusCodes.OK).json({ members });
  } catch (error) {
    next(error);
  }
};

const getSetAdmins = async (req, res, next) => {
  try {
    const setAdmin = await User.find({ role: "setAdmin" })
      .sort("-yearOfGraduation")
      .select("-password");
    res.status(StatusCodes.OK).json({ setAdmin });
  } catch (error) {}
};
module.exports = { createSet, getAllSets, getSetAdmins, getSetMembers };
