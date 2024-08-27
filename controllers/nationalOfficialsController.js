const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NationalOfficials = require("../model/nationalOfficialsModel");
const User = require("../model/userModel");
const addOfficial = async (req, res, next) => {
  try {
    const { userId, post } = req.body;
    if (!userId || !post) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }
    // check if is already a user
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      throw new CustomError.NotFoundError(`User is not found`);
    }
    await NationalOfficials.create({ user: userId, post });
    res
      .status(StatusCodes.CREATED)
      .json({ message: `The ${post} successfully added`, success: true });
  } catch (error) {
    next(error);
  }
};

const getAllOfficials = async (req, res, next) => {
  try {
    const nationalOfficials = await NationalOfficials.find({}).populate("user", "-password");

    res.status(StatusCodes.OK).json(nationalOfficials);
  } catch (error) {
    next(error);
  }
};

const getSingleOfficial = async (req, res, next) => {};
const updateOfficialPost = async (req, res, next) => {
  try {
    const { userId, post } = req.body;
    const official = await NationalOfficials.findOne({ post });
    if (!post) {
      throw new CustomError.NotFoundError("Post not found");
    }
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      throw new CustomError.NotFoundError("User not found");
    }
    official.user = userId;
    await official.save();
    res.status(StatusCodes.OK).json({ message: `The post of the ${post} successfully updated` });
  } catch (error) {
    next(error);
  }
};
const deleteOfficial = async (req, res, next) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      throw new CustomError.BadRequestError("Please provide user id");
    }
    await NationalOfficials.findOneAndDelete({ user: userId });
    res.status(StatusCodes.OK).json({ message: `Official successfully deleted` });
  } catch (error) {}
};
module.exports = {
  addOfficial,
  getSingleOfficial,
  updateOfficialPost,
  deleteOfficial,
  getAllOfficials,
};
