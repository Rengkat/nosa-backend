const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Please provide name"],
  },
  surname: {
    type: String,
    required: [true, "Please provide name"],
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
  },
  phone: {
    type: String,
    required: [true, "Please provide phone"],
  },
  sex: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  currentAddress: {
    type: String,
    required: true,
  },
  employmentStatus: {
    type: String,
    enum: ["Employed", "Unemployed", "Self-Employed", "Student", "Retired"],
    required: true,
  },
  currentJob: {
    type: String,
    required: false,
  },
  employer: {
    type: String,
    required: false,
  },
  stateOfResidence: {
    type: String,
    required: true,
  },
  yearOfGraduation: {
    type: Number,
    required: [true, "Please provide your year of graduation"],
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "complicated"],
    required: true,
  },
  role: {
    type: String,
    enum: ["superAdmin", "setAdmin", "user"],
    default: "user",
    required: true,
  },

  isSetExco: {
    type: Boolean,
    default: false,
  },
  isNationalExco: {
    type: Boolean,
    default: false,
  },

  setExcoOffice: {
    type: String,
    required: true,
  },
  isWhomWeAreProudOf: {
    type: Boolean,
    default: false,
  },
  summaryOfProfile: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["active", "blocked"],
    default: "active",
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
