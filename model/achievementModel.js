const mongoose = require("mongoose");
const AchievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  achievements: [
    {
      type: String,
      required: true,
    },
  ],
});
module.exports = mongoose.model("Achievements", AchievementSchema);
