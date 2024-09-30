const User = require("../model/userModel");
const Token = require("../model/Token");
const CustomError = require("../errors");
const { model } = require("mongoose");
const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new CustomError.NotFoundError("User not found");
    }

    const isPasswordMatched = await user.comparedPassword(password);
    if (!isPasswordMatched) {
      throw new CustomError.BadRequestError("Please enter valid credentials");
    }

    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError("Please verify your email");
    }

    if (user.role !== "superAdmin" && user.role !== "setAdmin") {
      throw new CustomError.UnauthorizedError("Access denied. Admins only.");
    }

    let refreshToken = "";
    const userPayload = createUserPayload(user);
    const existingRefreshToken = await Token.findOne({ user: user._id });

    if (existingRefreshToken) {
      if (!existingRefreshToken.isValid) {
        throw new CustomError.UnauthenticatedError("Invalid credentials");
      }
      refreshToken = existingRefreshToken.refreshToken;
      const token = attachTokenToResponse({ res, userPayload, refreshToken });
      return res.status(StatusCodes.OK).json({
        message: "Admin login successful",
        user: userPayload,
        success: true,
        token,
      });
    }

    refreshToken = crypto.randomBytes(40).toString("hex");
    const ip = req.ip;
    const userAgent = req.headers["user-agent"];
    const refreshTokenPayload = { refreshToken, ip, userAgent, user: user._id };

    await Token.create(refreshTokenPayload);
    const token = attachTokenToResponse({ res, userPayload, refreshToken });

    res.status(StatusCodes.OK).json({
      message: "Admin login successful",
      user: userPayload,
      success: true,
      token,
    });
  } catch (error) {
    next(error);
  }
};
const logoutAdmin = async (req, res, next) => {
  try {
    await Token.findOneAndDelete({ user: req.user.id });
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
model.exports = { loginAdmin, logoutAdmin };
