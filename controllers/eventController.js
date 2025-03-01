const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Event = require("../model/eventsModel");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;
const fs = require("node:fs");

const addEvent = async (req, res, next) => {
  try {
    const { isPopular, image, title, content, description, dateOfEvent, venue } = req.body;

    // Check if required fields are provided
    if (
      !image ||
      !title ||
      !content ||
      !dateOfEvent ||
      !venue ||
      !venue.name ||
      !venue.address ||
      !venue.city ||
      !venue.state ||
      !venue.country ||
      !venue.zipCode
    ) {
      throw new CustomError.BadRequestError("Please provide all required details");
    }

    await Event.create({
      image,
      title,
      content,
      description,
      dateOfEvent,
      venue,
      isPopular,
    });

    res.status(StatusCodes.CREATED).json({
      message: `Event has been published successfully`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getAllEvents = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page)) || 1;
    const limit = Math.max(1, parseInt(req.query.limit)) || 10;
    const skip = (page - 1) * limit;

    const totalEvents = await Event.countDocuments({});

    const events = await Event.find({}).sort({ createdAt: -1 }).skip(skip).limit(limit);

    const totalPages = Math.ceil(totalEvents / limit);

    res.status(StatusCodes.OK).json({
      data: events,
      totalEvents,
      currentPage: page,
      limit,
      totalPages,
    });
  } catch (error) {
    next(error);
  }
};

const getSingleEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }
    const event = await Event.findById(id).populate("user", "-password");
    console.log(event);
    if (!event) {
      throw new CustomError.NotFoundError("Event not found");
    }
    res.status(StatusCodes.OK).json(event);
  } catch (error) {
    next(error);
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { image, title, content, description, dateOfEvent, venue } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError.BadRequestError("Invalid ID format");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      { image, title, content, description, dateOfEvent, venue },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      throw new CustomError.NotFoundError("Event not found");
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
      throw new CustomError.NotFoundError("Event not found");
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
