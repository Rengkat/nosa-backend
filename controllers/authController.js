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
    //send verification code
    res.status(StatusCodes.CREATED).json({ message: "Registration successful", success: true });
  } catch (error) {
    next(error);
  }
};
//verify email
const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.body;
    if (!email || !verificationToken) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }
    // check if the verification expire
    const currentDate = new Date();
    if (currentDate > user?.emailVerificationTokenExpirationDate) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Verification fail. Please request a new token.",
      });
    }
    // then check is the verification token is same
    if (user?.emailVerificationToken !== verificationToken) {
      throw new CustomError.BadRequestError("Verification failed");
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.emailVerificationTokenExpirationDate = null;
    await user.save();
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Email successfully verified",
    });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
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
    //check if user is verified
    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError("Please verify your email");
    }
    //refresh token
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
  //remove Token
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
//forgot password
const forgotPassword = async (req, res) => {};
//reset password
const resetPassword = async (req, res) => {};
module.exports = { register, verifyEmail, login, logout, forgotPassword, resetPassword };
