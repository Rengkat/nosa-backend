const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
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
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email",
    },
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    validate: {
      validator: function (value) {
        return validator.isStrongPassword(value, {
          minLength: 6,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        });
      },
      message: "Enter a stronger password",
    },
  },
  sex: {
    type: String,
    enum: ["Male", "Female"],
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  currentAddress: {
    type: String,
    required: false,
  },
  employmentStatus: {
    type: String,
    enum: ["Employed", "Unemployed", "Self-Employed", "Student", "Retired"],
    required: false,
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
    required: false,
  },
  yearOfGraduation: {
    type: String,
    required: false,
  },
  maritalStatus: {
    type: String,
    enum: ["single", "married", "divorced", "complicated"],
    required: false,
  },
  role: {
    type: String,
    enum: ["superAdmin", "setAdmin", "member"],
    default: "member",
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
    required: false,
  },
  isWhomWeAreProudOf: {
    type: Boolean,
    default: false,
  },
  summaryOfProfile: {
    type: String,
    required: false,
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
UserSchema.virtual("nosaSet", {
  ref: "Set",
  localField: "yearOfGraduation",
  foreignField: "name", // Assuming 'name' in Set schema is the yearOfGraduation
  justOne: true,
});

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});
UserSchema.methods.comparedPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
module.exports = mongoose.model("User", UserSchema);
