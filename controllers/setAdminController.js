const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");
const makeSetAdmin = async (req, res, next) => {
  try {
    const { userId, setId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    const existingSetAdmin = await User.findOne({ role: "setAdmin", nosaSet: setId });

    if (existingSetAdmin) {
      if (existingSetAdmin._id.toString() === userId) {
        throw new CustomError.BadRequestError("User is already the setAdmin");
      }

      existingSetAdmin.role = "member";
      await existingSetAdmin.save();
    }

    user.role = "setAdmin";
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "New set admin assigned successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
const getAllSetAdmins = async (req, res, next) => {
  try {
    const setAdmins = await User.find({ role: "setAdmin" })
      .sort("-yearOfGraduation")
      .select("-password")
      .populate({
        path: "nosaSet",
        select: "name -_id",
      });
    res.status(StatusCodes.OK).json({ setAdmins });
  } catch (error) {
    next(error);
  }
};
const removeSetAdmin = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    if (user.role !== "setAdmin") {
      throw new CustomError.BadRequestError("User is not a setAdmin for this set");
    }

    user.role = "member";
    await user.save();

    res.status(StatusCodes.OK).json({
      message: "Set admin removed successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllSetAdmins, makeSetAdmin, removeSetAdmin };
