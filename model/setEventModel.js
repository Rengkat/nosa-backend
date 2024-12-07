const mongoose = require("mongoose");

// Schema for Related Events
const RelatedEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  icon: {
    type: String, // Icon representation (e.g., FontAwesome or a URL)
    default: "BsPinAngleFill", // Default icon for related events
  },
});

// Schema for Main Event
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
    required: true, // Time in format "10:00 AM - 5:00 PM"
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
    type: String, // URL of the banner image
    required: true,
  },
  isRsvp: {
    type: Boolean,
    default: false, // Tracks RSVP status for the main event
  },
  relatedEvents: [RelatedEventSchema], // Array of related events
});

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
