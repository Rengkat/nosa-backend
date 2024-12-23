const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");
const Token = require("../model/Token");
const NosaSet = require("../model/setModel");
const { attachTokenToResponse, createUserPayload, sendVerificationEmail } = require("../utils");
const crypto = require("crypto");
const register = async (req, res, next) => {
  const { firstName, surname, email, password, yearOfGraduation } = req.body;
  try {
    if (!firstName || !surname || !email || !password || !yearOfGraduation) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      throw new CustomError.BadRequestError("User already registered");
    }

    const userCount = await User.countDocuments();
    const assignedRole = userCount === 0 ? "superAdmin" : "member";

    const emailVerificationToken = crypto.randomBytes(40).toString("hex");
    const emailVerificationTokenExpirationDate = new Date(Date.now() + 1000 * 60 * 60);

    // Check for existing NOSA set
    const nosaSet = await NosaSet.findOne({ name: yearOfGraduation });
    if (!nosaSet) {
      throw new CustomError.NotFoundError("NOSA Set not found");
    }

    // Create the user
    const user = await User.create({
      firstName,
      surname,
      email,
      password,
      yearOfGraduation,
      role: assignedRole,
      emailVerificationToken,
      emailVerificationTokenExpirationDate,
      nosaSet: nosaSet._id,
    });

    // Add user to NOSA set members if not already included
    if (!nosaSet.members.includes(user._id)) {
      nosaSet.members.push(user._id);
      await nosaSet.save();
    }

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
      throw new CustomError.BadRequestError("Please enter valid credentials");
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
      // token: token.accessTokenJWT,cd
    });
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
    const userId = req.user.id;
    await Token.findOneAndDelete({ user: userId });
    res.cookie("accessToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie("refreshToken", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(StatusCodes.OK).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, verifyEmail, login, logout };
