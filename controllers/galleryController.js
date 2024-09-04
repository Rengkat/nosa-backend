const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors");
const Gallery = require("../model/galleryModel");
const addToGallery = async (req, res, next) => {};
const getAllGalleryImages = async (req, res, next) => {};
const getSingleGalleryImage = async (req, res, next) => {};
const updateGallery = async (req, res, next) => {};
const removeFromGallery = async (req, res, next) => {};
module.exports = {
  addToGallery,
  updateGallery,
  removeFromGallery,
  getAllGalleryImages,
  getSingleGalleryImage,
};
