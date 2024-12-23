const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const NosaSet = require("../model/setModel");
const User = require("../model/userModel");
const createSet = async (req, res, next) => {
  try {
    const { nosaSet } = req.body;
    if (!nosaSet) throw new CustomError.BadRequestError("Please provide set year");

    const existingSet = await NosaSet.findOne({ name: nosaSet });
    if (existingSet) throw new CustomError.BadRequestError("Set already exists");

    await NosaSet.create({ name: nosaSet });
    res.status(StatusCodes.CREATED).json({ message: "A set created successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const updateSet = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const { name, banner, coverImage } = req.body;

    const updatedSet = await NosaSet.findByIdAndUpdate(
      setId,
      { name, banner, coverImage },
      { new: true }
    );
    if (!updatedSet) throw new CustomError.NotFoundError("Set not found");

    res.status(StatusCodes.OK).json({ message: "Set updated successfully", success: true });
  } catch (error) {
    next(error);
  }
};
const getAllSets = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalSets = await NosaSet.countDocuments();

    const sets = await NosaSet.find().skip(skip).limit(limit);
    const totalPages = Math.ceil(totalSets / limit);
    res
      .status(StatusCodes.OK)
      .json({ data: sets, totalSets, totalPages, currentPage: page, limit });
  } catch (error) {
    next(error);
  }
};

const getSetVerifiedMembers = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find the set and populate members
    const nosaSet = await NosaSet.findById(setId).populate({
      path: "members",
      match: { isSetAdminVerify: true },
      select: "-password",
    });

    if (!nosaSet) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "Set not found" });
    }

    // Paginate the members
    const totalSetMembers = nosaSet.members.length;
    const totalPages = Math.ceil(totalSetMembers / limit);
    const members = nosaSet.members.slice(skip, skip + limit);

    res.status(StatusCodes.OK).json({
      data: members,
      totalSetMembers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

const getSetUnVerifiedMembers = async (req, res, next) => {
  try {
    const { setId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Find the set and populate members
    const nosaSet = await NosaSet.findById(setId).populate({
      path: "members",
      match: { isSetAdminVerify: false },
      select: "-password",
    });

    if (!nosaSet) {
      throw new CustomError.NotFoundError("Set not found");
    }

    // Paginate the members
    const totalSetMembers = nosaSet.members.length;
    const totalPages = Math.ceil(totalSetMembers / limit);
    const members = nosaSet.members.slice(skip, skip + limit);

    res.status(StatusCodes.OK).json({
      data: members,
      totalSetMembers,
      totalPages,
      currentPage: page,
      limit,
    });
  } catch (error) {
    next(error);
  }
};

const getSetAdmins = async (req, res, next) => {
  try {
    const setAdmins = await User.find({ role: "setAdmin" })
      .sort("-yearOfGraduation")
      .select("-password");
    res.status(StatusCodes.OK).json({ setAdmins });
  } catch (error) {
    next(error);
  }
};

const uploadBannerImage = async (req, res, next) => {
  try {
    const { setId } = req.params;

    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_FOLDER_NAME_USER_IMAGES,
    });

    // Remove the temp file after upload
    fs.unlinkSync(req.files.image.tempFilePath);

    // Update the banner field for the specified set
    const updatedSet = await NosaSet.findByIdAndUpdate(
      setId,
      { banner: result.secure_url },
      { new: true, runValidators: true }
    );

    if (!updatedSet) {
      throw new CustomError.NotFoundError("Set not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Banner image updated successfully",
      success: true,
      imgUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};
const uploadCoverImage = async (req, res, next) => {
  try {
    const { setId } = req.params;

    if (!req.files || !req.files.image) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "No image file uploaded", success: false });
    }

    const result = await cloudinary.uploader.upload(req.files.image.tempFilePath, {
      use_filename: true,
      folder: process.env.CLOUDINARY_FOLDER_NAME_USER_IMAGES,
    });

    fs.unlinkSync(req.files.image.tempFilePath);

    const updatedSet = await NosaSet.findByIdAndUpdate(
      setId,
      { coverImage: result.secure_url },
      { new: true, runValidators: true }
    );

    if (!updatedSet) {
      throw new CustomError.NotFoundError("Set not found");
    }

    return res.status(StatusCodes.OK).json({
      message: "Cover image updated successfully",
      success: true,
      imgUrl: result.secure_url,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSet,
  getAllSets,
  getSetAdmins,
  getSetVerifiedMembers,
  getSetUnVerifiedMembers,
  uploadBannerImage,
  uploadCoverImage,
  updateSet,
};
