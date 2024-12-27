const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    image: { type: String, required: [true, "Please provide image link"] },
    title: { type: String, required: [true, "Please provide the title"], maxLength: 100 },
    description: { type: String },
    content: { type: String, required: [true, "Please provide the content"] },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Event", EventSchema);
