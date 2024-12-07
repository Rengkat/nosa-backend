const CustomError = require("../errors");
const SetEvent = require("../model/setEventModel");
const { StatusCodes } = require("http-status-codes");
const Set = require("../model/setModel");
const fs = require("node:fs");
const cloudinary = require("cloudinary").v2;
const createSetEvent = async (req, res, next) => {
  try {
    const { title, date, time, location, description, bannerImage, isRsvp, isPined } = req.body;

    if (!title || !date || !time || !location || !description || !bannerImage) {
      throw new CustomError.BadRequestError("Provide all event details");
    }

    await SetEvent.create({
      title,
      date,
      time,
      location,
      description,
      bannerImage,
      isRsvp,
      isPined,
    });

    res.status(StatusCodes.CREATED).json({ message: "Event Added successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const getAllSetEvent = async (req, res, next) => {
  try {
    const { setId } = req.body;
    if (!setId) {
      throw new CustomError.BadRequestError("Please provide set Id");
    }
    const set = await Set.findById(setId);
    if (!set) {
      throw CustomError.NotFoundError("Set not found");
    }
    const events = await SetEvent.find({ set: setId });
    res.status(StatusCodes.OK).json({ events });
  } catch (error) {
    next(error);
  }
};
const getSingleSetEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide id");
    }
    const event = await SetEvent.findById(id);
    res.status(StatusCodes.OK).json({ event });
  } catch (error) {
    next(error);
  }
};
const updateSetEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide id");
    }
    const event = await SetEvent.findById(id);
    if (!event) {
      throw new CustomError.NotFoundError("Event not found");
    }
    event.set(req.body);
    await event.save();
    res.status(StatusCodes.OK).json({ message: "Event updated successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const deleteSetEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new CustomError.BadRequestError("Please provide id");
    }
    await SetEvent.findByIdAndDelete(id);

    res.status(StatusCodes.OK).json({ message: "Event deleted successfully", success: true });
  } catch (error) {
    next(error);
  }
};

const uploadSetEventImage = async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    if (!fs.existsSync(req.files.image.tempFilePath)) {
      // the file path
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "File not found", success: false });
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_SET_EVENT_FOLDER_NAME,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(StatusCodes.CREATED).json({ eventImgUrl: result.secure_url, success: true });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  createSetEvent,
  getAllSetEvent,
  getSingleSetEvent,
  updateSetEvent,
  deleteSetEvent,
  uploadSetEventImage,
};
