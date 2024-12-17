const express = require("express");
const {
  addImage,
  deleteImage,
  getAllSetMedia,
  uploadSetMediaImage,
  getSingleDetailMedia,
} = require("../controllers/setMediaController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();
router.route("/").post(authenticateUser, addImage).get(authenticateUser, getAllSetMedia);
router.route("/upload-media-image").post(authenticateUser, uploadSetMediaImage);
router
  .route("/:id")
  .delete(authenticateUser, deleteImage)
  .get(authenticateUser, getSingleDetailMedia);
module.exports = router;
