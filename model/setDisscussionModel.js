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
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

// Schema for group discussions
const GroupSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.ObjectId,
    ref: "Set",
    required: true,
  },

  messages: [MessageSchema], // Array of messages in the group
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;
