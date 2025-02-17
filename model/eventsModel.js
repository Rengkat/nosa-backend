const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    image: { type: String, required: [true, "Please provide image link"] },
    title: { type: String, required: [true, "Please provide the title"], maxLength: 100 },
    description: { type: String },
    dateOfEvent: {
      type: Date,
      required: [true, "Please provide the date of the event"],
    },
    venue: {
      name: { type: String, required: [true, "Please provide the venue name"] },
      address: { type: String, required: [true, "Please provide the venue address"] },
      city: { type: String, required: [true, "Please provide the city"] },
      state: { type: String, required: [true, "Please provide the state"] },
      country: { type: String, required: [true, "Please provide the country"] },
      zipCode: { type: String, required: [true, "Please provide the zip code"] },
    },
    content: { type: String, required: [true, "Please provide the content"] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
