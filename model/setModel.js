const mongoose = require("mongoose");
const SetDiscussion = require("../model/setDisscussionModel");

const NosaSetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide set name!"],
    unique: true,
  },
  members: [
    {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  ],
  banner: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  description: {
    type: String,
  },
});
// For discussion group
NosaSetSchema.post("save", async function (doc) {
  try {
    const existingGroup = await SetDiscussion.findOne({ nosaSet: doc._id });
    if (!existingGroup) {
      await SetDiscussion.create({
        nosaSet: doc._id,
        messages: [],
      });
      console.log(`Group chat created for NOSA Set: ${doc.name}`);
    }
  } catch (error) {
    console.error("Error creating group discussion:", error.message);
  }
});

module.exports = mongoose.model("NosaSet", NosaSetSchema);
