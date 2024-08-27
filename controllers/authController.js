const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const { attachTokenToResponse, createUserPayload } = require("../utils");

const register = async (req, res, next) => {
  const { firstName, surname, email, password } = req.body;
  try {
    if (!firstName || !surname || !email || !password) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new CustomError.BadRequestError("User already registered");
    }

    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? "superAdmin" : "member";

    await User.create({ firstName, surname, email, password, role: assignedRole });

    res.status(StatusCodes.CREATED).json({ message: "Registration successful", success: true });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if ((!email, !password)) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFound("User not found");
    }
    const isPasswordMatched = await user.comparedPassword(password);
    if (!isPasswordMatched) {
      throw new CustomError.BadRequest("Please enter valid credentials");
    }
    const userPayload = createUserPayload(user);
    const token = attachTokenToResponse({ res, userPayload });
    res.status(StatusCodes.OK).json({
      message: "login successfully",
      user: userPayload,
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};
module.exports = { register, login, logout };
