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
    const existingOfficial = await NationalOfficials.findOne({ post });
    if (existingOfficial) {
      throw new CustomError.BadRequestError(`The post of ${post} is already occupied.`);
    }

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

const getSingleOfficial = async (req, res, next) => {
  try {
    const { officeId } = req.params;

    if (!officeId) {
      throw new CustomError.BadRequestError("user ID is required");
    }

    const office = await NationalOfficials.findById(officeId).populate("user");

    if (!office) {
      throw new CustomError.NotFoundError("User not found");
    }

    res.status(StatusCodes.OK).json({ data: office });
  } catch (error) {
    next(error);
  }
};

const updateOfficialPost = async (req, res, next) => {
  try {
    const { userId, post } = req.body;

    if (!post || !userId) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }

    const official = await NationalOfficials.findOne({ post });
    if (!official) {
      throw new CustomError.NotFoundError("Post not found");
    }

    const isValidUser = await User.findById(userId);
    if (!isValidUser) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Update the official post with the new user
    const previousUserId = official.user;
    official.user = userId;
    await official.save();

    // Set the previous user’s `isNationalExco` to false if they are replaced
    const previousUser = await User.findById(previousUserId);
    if (previousUser) {
      previousUser.isNationalExco = false;
      await previousUser.save();
    }

    // Set the new user's `isNationalExco` to true
    isValidUser.isNationalExco = true;
    await isValidUser.save();

    res.status(StatusCodes.OK).json({
      message: `The post of ${post} successfully updated`,
    });
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

    // Find the official by user ID
    const official = await NationalOfficials.findOne({ user: userId });
    if (!official) {
      throw new CustomError.NotFoundError("Official not found");
    }

    // Remove the official
    await NationalOfficials.findOneAndDelete({ user: userId });

    // Set the user's `isNationalExco` to false
    const user = await User.findById(userId);
    if (user) {
      user.isNationalExco = false;
      await user.save();
    }

    res.status(StatusCodes.OK).json({
      message: `Official successfully removed from post`,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  addOfficial,
  getSingleOfficial,
  updateOfficialPost,
  deleteOfficial,
  getAllOfficials,
};
