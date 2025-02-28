const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const SocialMediaSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ["twitter", "linkedin", "facebook", "email"],
    // required: true,
  },
  url: {
    type: String,
    // required: true,
    // validate: {
    //   validator: validator.isURL,
    //   message: "Please provide a valid URL",
    // },
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
      required: [true, "Please provide surname"],
    },
    email: {
      type: String,
      required: [true, "Please provide email"],
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email",
      },
    },
    phone: {
      type: String,
      unique: true,
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
      default: "",
    },
    currentJob: {
      type: String,
      default: "",
    },
    employer: {
      type: String,
      default: "",
    },
    yearOfGraduation: {
      type: String,
      default: "",
    },
    nosaSet: {
      type: mongoose.Types.ObjectId,
      ref: "NosaSet",
    },
    position: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    banner: {
      type: String,
      default: "",
    },
    socialMedia: [SocialMediaSchema],
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "complicated"],
      default: "single",
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
    firstVisit: {
      type: Boolean,
      default: true,
    },
    isSetAdminVerify: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: { type: String },
    emailVerificationTokenExpirationDate: { type: Date },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.surname}`;
});

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
  }
  if (this.role === "superAdmin") {
    this.isSetAdminVerify = true;
  }
  next();
});

UserSchema.methods.comparedPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });

module.exports = mongoose.model("User", UserSchema);
