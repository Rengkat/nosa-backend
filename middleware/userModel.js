const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
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
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isSetAdmin: {
    type: Boolean,
    default: false,
  },
  isSetExco: {
    type: Boolean,
    default: false,
  },
  isNationalExco: {
    type: Boolean,
    default: false,
  },
  nationalExcoOffice: {
    type: String,
    required: true,
  },
  setExcoOffice: {
    type: String,
    required: true,
  },
  isWhomWeAreProudOf: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
