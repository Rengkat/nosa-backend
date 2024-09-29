const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const Token = require("../model/Token");
const { attachTokenToResponse, createUserPayload, sendVerificationEmail } = require("../utils");
const crypto = require("crypto");
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
    //CREATE TOKEN
    const oneHour = 1000 * 60 * 60;
    const emailVerificationToken = crypto.randomBytes(40).toString("hex");
    const emailVerificationTokenExpirationDate = new Date(Date.now() + oneHour);
    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      role: assignedRole,
      emailVerificationToken,
      emailVerificationTokenExpirationDate,
    });

    //send verification code
    await sendVerificationEmail({
      firstName: user.firstName,
      email: user.email,
      verificationToken: user.emailVerificationToken,
      origin: process.env.ORIGIN,
    });
    res.status(StatusCodes.CREATED).json({
      message: "Registration successful. Please check your email and verify it",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, verificationToken } = req.body;

    if (!email || !verificationToken) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    // Check if verification token has expired
    const currentDate = new Date();
    if (currentDate > user.emailVerificationTokenExpirationDate) {
      throw new CustomError.BadRequestError("Verification failed. Please request a new token.");
    }

    // Timing-safe token comparison
    const isTokenValid = crypto.timingSafeEqual(
      Buffer.from(user.emailVerificationToken),
      Buffer.from(verificationToken)
    );

    if (!isTokenValid) {
      throw new CustomError.BadRequestError("Verification failed");
    }

    user.isVerified = true;
    user.emailVerificationToken = null;
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
    let refreshToken = "";
    const userPayload = createUserPayload(user);
    //check if the refreshToken is present
    const existingRefreshToken = await Token.findOne({ user: user._id });
    if (existingRefreshToken) {
      if (!existingRefreshToken.isValid) {
        throw new CustomError.UnauthenticatedError("Invalid credentials");
      }
      refreshToken = existingRefreshToken.refreshToken;
      const token = attachTokenToResponse({ res, userPayload, refreshToken });
      return res.status(StatusCodes.OK).json({
        message: "login successfully",
        user: userPayload,
        success: true,
        token,
      });
    }
    refreshToken = crypto.randomBytes(40).toString("hex");
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    //create token model and create a refresh token payload
    const refreshTokenPayload = { refreshToken, ip, userAgent, user: user._id };
    await Token.create(refreshTokenPayload);

    const token = attachTokenToResponse({ res, userPayload, refreshToken });
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
