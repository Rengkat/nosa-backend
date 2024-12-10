const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  moderated: {
    text: {
      type: String,
      default: null,
    },
    moderator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const GroupDiscussionSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.ObjectId,
    ref: "Set",
    required: true,
  },
  messages: [MessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model("GroupDiscussion", GroupDiscussionSchema);

module.exports = Group;
