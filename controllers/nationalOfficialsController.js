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

    // Check if the user exists
    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      throw new CustomError.NotFoundError("User not found");
    }

    await NationalOfficials.create({ user: userId, post });

    isValidUser.isNationalExco = true;
    await isValidUser.save();

    res.status(StatusCodes.CREATED).json({
      message: `The ${post} successfully added`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllOfficials = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalOfficials = await NationalOfficials.countDocuments();

    const nationalOfficials = await NationalOfficials.find({})
      .populate("user", "-password")
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalOfficials / limit);

    res
      .status(StatusCodes.OK)
      .json({ data: nationalOfficials, totalOfficials, currentPage: page, limit, totalPages });
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
