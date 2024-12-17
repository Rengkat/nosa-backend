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
  isExplicitWord: {
    type: Boolean,
    default: false,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const GroupDiscussionSchema = new mongoose.Schema({
  nosaSet: {
    type: mongoose.Schema.ObjectId,
    ref: "NosaSet",
    required: true,
  },
  messages: [MessageSchema],
});

const Group = mongoose.model("GroupDiscussion", GroupDiscussionSchema);

module.exports = Group;
