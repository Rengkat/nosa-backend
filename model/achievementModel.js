const mongoose = require("mongoose");
const AchievementSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  achievements: [
    {
      type: Sting,
      required: true,
    },
  ],
});
module.exports = mongoose.model("Achievements", AchievementSchema);
