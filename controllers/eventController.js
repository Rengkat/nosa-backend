const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Event = require("../model/eventsModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const addEvent = async (req, res, next) => {
  try {
    const { image, title, content, description } = req.body;

    // Check if required fields are provided
    if (!image || !content || !title) {
      throw new CustomError.BadRequestError("Please provide all details");
    }

    await Event.create({
      image,
      title,
      content,
      description,
    });

    res.status(StatusCodes.CREATED).json({
      message: `An event has been published`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find({});
    res.status(StatusCodes.OK).json(events);
  } catch (error) {
    next(error);
  }
};

const getSingleEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const event = await Event.findById(id).populate("user", "-password");
    if (!event) {
      throw new CustomError.NotFoundError("Article not found");
    }
    res.status(StatusCodes.OK).json(event);
  } catch (error) {
    next(error);
  }
};
const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, title, content, description } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { image, title, content, description },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      throw new CustomError.NotFoundError("Resources not found");
    }

    res.status(StatusCodes.OK).json({
      message: `Event updated successfully`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const removeEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const event = await Event.findByIdAndDelete(id);
    if (!event) {
      throw new CustomError.NotFoundError("Result not found");
    }
    res.status(StatusCodes.OK).json({ message: `Event deleted successfully`, success: true });
  } catch (error) {
    next(error);
  }
};

const uploadEventImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      throw new CustomError.BadRequestError("No image file uploaded");
    }

    if (!fs.existsSync(req.files.image.tempFilePath)) {
      // the file path
      throw new CustomError.BadRequestError("File not found");
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_EVENTS_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ imgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addEvent,
  updateEvent,
  removeEvent,
  uploadEventImage,
  getAllEvents,
  getSingleEvent,
};
