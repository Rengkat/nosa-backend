const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password");
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

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true, // Ensure validation is run on the updated fields
    });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Your credentials were successfully updated",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, getSingleUser, deleteUser, updateCurrentUser };
