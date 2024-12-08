const CustomError = require("../errors");
const SetEvent = require("../model/setEventModel");
const { StatusCodes } = require("http-status-codes");
const Set = require("../model/setModel");
const createSetEvent = async (req, res, next) => {
  try {
    const { title, date, time, location, description, bannerImage, isRsvp, isPined } = req.body;

    // Corrected: Removed duplicate `!date` check
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
const deleteSetEvent = async (req, res, next) => {};
module.exports = {
  createSetEvent,
  getAllSetEvent,
  getSingleSetEvent,
  updateSetEvent,
  deleteSetEvent,
};
