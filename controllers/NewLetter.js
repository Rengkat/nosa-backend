const NewLetter = require("../model/newsLetter");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");
const subscribeToNewsLetter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      throw new BadRequestError("Email is required");
    }

    const existingSubscriber = await NewLetter.findOne({ email });
    if (existingSubscriber) {
      throw new BadRequestError("Email is already subscribed");
    }

    const newSubscriber = await NewLetter.create({ email });

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Subscribed to newsletter successfully",
    });
  } catch (error) {
    next(error);
  }
};
const unsubscribeFromNewsLetter = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      throw new BadRequestError("Email is required");
    }

    const subscriber = await NewLetter.findOne({ email });
    if (!subscriber) {
      throw new NotFoundError("Email is not subscribed");
    }

    await NewLetter.deleteOne({ email });

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Unsubscribed from newsletter successfully",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  subscribeToNewsLetter,
  unsubscribeFromNewsLetter,
};
