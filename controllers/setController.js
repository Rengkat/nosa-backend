const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");
const createSet = async (req, res, next) => {
  try {
    const { nosaSet, userId } = req.body;
    if (!nosaSet || !userId) {
      throw new CustomError.BadRequestError("Please provide all credentials");
    }
    const existSet = await NosaSet.findOne({ name: nosaSet });
    if (existSet) {
      throw new CustomError.BadRequestError("This set already exist");
    }
    await NosaSet.create({ members: userId, name: nosaSet });
    // res.status(StatusCodes.CREATED).json({message:})
  } catch (error) {
    next(error);
  }
};
const getAllSets = async (req, res, next) => {};
const updateSet = async (req, res, next) => {};
const getSetMembers = async (req, res, next) => {};
const getSetAdmins = async (req, res, next) => {};
module.exports = { createSet, getAllSets, updateSet, getSetAdmins, getSetMembers };
