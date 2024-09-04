const express = require("express");
const {
  addToGallery,
  updateGallery,
  removeFromGallery,
  getAllGalleryImages,
  getSingleGalleryImage,
  uploadImage,
} = require("../controllers/galleryController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addToGallery)
  .get(getAllGalleryImages);
router.post("/uploadImage", [authenticateUser, superAdminAuthorizationPermission], uploadImage);
router
  .route("/:id")
  .get(getSingleGalleryImage)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateGallery)
  .delete([authenticateUser, superAdminAuthorizationPermission], removeFromGallery);
module.exports = router;
