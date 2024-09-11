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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalSets = await NosaSet.countDocuments();

    const sets = await NosaSet.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalSets / limit);
    res
      .status(StatusCodes.OK)
      .json({ data: sets, totalSets, totalPages, currentPage: page, limit });
  } catch (error) {
    next(error);
  }
};

const getSetVerifiedMembers = async (req, res, next) => {
  try {
    const { set } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalSetMembers = await User.countDocuments({ yearOfGraduation: set, isVerified: true });

    const members = await User.find({ yearOfGraduation: set, isVerified: true })
      .select("-password")
      .skip(skip)
      .limit(limit);
    const totalPages = Math.ceil(totalSetMembers / limit);

    res
      .status(StatusCodes.OK)
      .json({ data: members, totalSetMembers, totalPages, currentPage: page, limit });
  } catch (error) {
    next(error);
  }
};
const getSetUnVerifiedMembers = async (req, res, next) => {
  try {
    const totalSetMembers = await User.countDocuments({ yearOfGraduation: set, isVerified: false });

    const members = await User.find({ yearOfGraduation: set, isVerified: false }).select(
      "-password"
    );

    res.status(StatusCodes.OK).json({ data: members, totalUnverifiedSetMembers });
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
module.exports = {
  createSet,
  getAllSets,
  getSetAdmins,
  getSetVerifiedMembers,
  getSetUnVerifiedMembers,
};
