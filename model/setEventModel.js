const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bannerImage: {
    type: String,
    required: true,
  },
  isRsvp: {
    type: Boolean,
    default: false,
  },
  isPined: {
    type: Boolean,
    default: false,
  },
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
