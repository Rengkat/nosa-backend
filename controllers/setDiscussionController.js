const CustomError = require("../errors");
const SetDiscussion = require("../model/setDisscussionModel");
const NosaSet = require("../model/setModel");
const { StatusCodes } = require("http-status-codes");
const sendMessage = async (req, res, next) => {
  try {
    const { setId, text } = req.body;

    if (!setId || !text) {
      throw new CustomError.BadRequestError("Set ID and text are required");
    }

    const group = await SetDiscussion.findOne({ nosaSet: setId });

    if (!group) {
      throw new CustomError.NotFoundError("Group discussion not found for this set");
    }
    if (!req.user.isSetAdminVerify) {
      throw new CustomError.BadRequestError("You are not verified by your set admin");
    }
    if (req.user.status === "blocked") {
      throw new CustomError.BadRequestError("You are blocked");
    }

    const newMessage = {
      text,
      sender: req.user.id,
      isExplicitWord: false,
      timestamp: new Date(),
    };

    group.messages.push(newMessage);
    await group.save();

    // Emit the message to the room
    req.io.to(setId).emit("receiveMessage", newMessage);

    res.status(StatusCodes.CREATED).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    next(error);
  }
};
const getAllSetMessage = async (req, res, next) => {
  try {
    const { setId } = req.query;

    if (!setId) {
      throw new CustomError.BadRequestError("Set ID is required");
    }

    const group = await SetDiscussion.findOne({ nosaSet: setId }).populate(
      "messages.sender",
      "firstName surname"
    );
    if (!group) {
      throw new CustomError.NotFoundError("Group discussion not found for this set");
    }

    res.status(StatusCodes.OK).json({ success: true, messages: group.messages });
  } catch (error) {
    next(error);
  }
};

const updateMessage = async (req, res, next) => {
  try {
    const { setId, newText } = req.body;
    const { messageId } = req.params;

    if (!setId || !messageId || !newText) {
      throw new CustomError.BadRequestError("Set ID, message ID, and new text are required");
    }

    const group = await SetDiscussion.findOne({ nosaSet: setId });
    if (!group) {
      throw new CustomError.NotFoundError("Group discussion not found for this set");
    }

    const message = group.messages.id(messageId);
    if (!message) {
      throw new CustomError.NotFoundError("Message not found");
    }

    if (message.sender.toString() !== req.user.id) {
      throw new CustomError.UnauthorizedError("You are not authorized to edit this message");
    }

    message.text = newText;

    await group.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Message updated" });
  } catch (error) {
    next(error);
  }
};

const deleteMessage = async (req, res, next) => {
  try {
    const { messageId } = req.params;
    const { setId } = req.query;

    if (!setId || !messageId) {
      throw new CustomError.BadRequestError("Group ID and message ID are required");
    }

    const group = await SetDiscussion.findOne({ nosaSet: setId });
    if (!group) {
      throw new CustomError.NotFoundError("NOSA Set not found");
    }

    const message = group.messages.id(messageId);
    if (!message) {
      throw new CustomError.NotFoundError("Message not found");
    }

    if (message.sender.toString() !== req.user.id) {
      throw new CustomError.UnauthorizedError("You are not authorized to delete this message");
    }

    group.messages.pull(messageId);

    await group.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};
const adminModerateMessage = async (req, res, next) => {
  try {
    const { setId, messageId } = req.body;

    if (!setId || !messageId) {
      throw new CustomError.BadRequestError("Set ID, message ID, and moderation text are required");
    }

    // Find the discussion group by Set ID
    const group = await SetDiscussion.findOne({ nosaSet: setId });
    if (!group) {
      throw new CustomError.NotFoundError("Group discussion not found for this set");
    }

    const message = group.messages.id(messageId);
    if (!message) {
      throw new CustomError.NotFoundError("Message not found");
    }

    message.isExplicitWord = true;

    await group.save();

    res.status(StatusCodes.OK).json({ success: true, message: "Message moderated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getAllSetMessage,
  updateMessage,
  deleteMessage,
  adminModerateMessage,
};
