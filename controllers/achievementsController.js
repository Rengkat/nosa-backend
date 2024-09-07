const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Achievements = require("../model/achievementModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const { StatusCodes } = require("http-status-codes");
const Achievements = require("../models/Achievement");
const CustomError = require("../errors");

const createAchievementCategory = async (req, res, next) => {
  try {
    const { achievementName } = req.body;

    if (!achievementName) {
      throw new CustomError.BadRequestError("Please provide the achievement name");
    }

    let category = await Achievements.findOne({ name: achievementName });

    if (category) {
      throw new CustomError.BadRequestError("Achievement category already exists");
    }

    category = await Achievements.create({
      name: achievementName,
      achievements: [],
    });

    res.status(StatusCodes.CREATED).json({
      message: "Achievement category created successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const addAchievement = async (req, res, next) => {
  try {
    const { achievement, id } = req.body;

    if (!achievement || !id) {
      throw new CustomError.BadRequestError("Please provide the achievement and category ID");
    }

    const achievementCategory = await Achievements.findById(id);

    if (!achievementCategory) {
      throw new CustomError.NotFoundError("Achievement category not found");
    }

    achievementCategory.achievements.push(achievement);

    await achievementCategory.save();

    res.status(StatusCodes.OK).json({
      message: "Achievement added successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllAchievements = async (req, res, next) => {
  try {
    const achievements = await Achievements.find();

    res.status(StatusCodes.OK).json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    next(error);
  }
};

const updateAchievement = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { achievement, achievementId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new CustomError.BadRequestError("Invalid Achievement Category ID format");
    }

    const achievementCategory = await Achievements.findById(categoryId);

    if (!achievementCategory) {
      throw new CustomError.NotFoundError("Achievement category not found");
    }

    const achievementIndex = achievementCategory.achievements.findIndex(
      (item) => item._id.toString() === achievementId
    );

    if (achievementIndex === -1) {
      throw new CustomError.NotFoundError("Achievement not found");
    }

    achievementCategory.achievements[achievementIndex] = achievement;

    await achievementCategory.save();

    res.status(StatusCodes.OK).json({
      message: "Achievement updated successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const deleteAchievement = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const { achievementId } = req.body;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new CustomError.BadRequestError("Invalid Achievement Category ID format");
    }

    const achievementCategory = await Achievements.findById(categoryId);

    if (!achievementCategory) {
      throw new CustomError.NotFoundError("Achievement category not found");
    }

    const achievementIndex = achievementCategory.achievements.findIndex(
      (item) => item._id.toString() === achievementId
    );

    if (achievementIndex === -1) {
      throw new CustomError.NotFoundError("Achievement not found");
    }

    achievementCategory.achievements.splice(achievementIndex, 1);

    await achievementCategory.save();

    res.status(StatusCodes.OK).json({
      message: "Achievement deleted successfully",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { deleteAchievement };

module.exports = {
  createAchievementCategory,
  addAchievement,
  deleteAchievement,
  getAllAchievements,
  updateAchievement,
};
