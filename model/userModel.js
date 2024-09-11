const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const SocialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ["twitter", "linkedin", "facebook", "email"],
    required: true,
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: validator.isURL,
      message: "Please provide a valid URL",
    },
  },
});

const EducationSchema = new mongoose.Schema({
  primaryEducation: {
    type: String,
    required: false,
  },
  secondaryEducation: {
    type: [String],
    required: false,
  },
  undergraduate: {
    type: [String],
    required: false,
  },
  postGraduate: {
    type: [String],
    required: false,
  },
  professionalTrainings: {
    type: [String],
    required: false,
  },
});

const UserSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
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
    yearOfGraduation: {
      type: String,
      required: false,
    },
    setOf: {
      type: mongoose.Types.ObjectId,
      ref: "Set",
      required: false,
    },
    position: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    educationalBackground: EducationSchema,
    socialMedia: [SocialMediaSchema],
    portfolio: {
      type: [String],
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
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.surname}`;
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
