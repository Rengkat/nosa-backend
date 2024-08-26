const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const User = require("../model/userModel");

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
    const user = await User.create({ firstName, surname, email, password });
    res
      .status(StatusCodes.CREATED)
      .json({ user, message: "Registration successful", success: true });
  } catch (error) {
    next(error);
  }
};
const login = async (req, res, next) => {
  try {
    console.log("first");
  } catch (error) {
    next(error);
  }
};
const logout = async (req, res, next) => {
  try {
  } catch (error) {
    next(error);
  }
};
module.exports = { register, login, logout };
