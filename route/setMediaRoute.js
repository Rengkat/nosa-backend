const express = require("express");
const {
  addImage,
  deleteImage,
  getAllSetMedia,
  uploadSetMediaImage,
  getSingleDetailMedia,
} = require("../controllers/setMediaController");
const {
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    addImage
  )
  .get(authenticateUser, getAllSetMedia);
router
  .route("/upload-media-image")
  .post(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    uploadSetMediaImage
  );
router
  .route("/:id")
  .delete(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    deleteImage
  )
  .get(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    getSingleDetailMedia
  );
module.exports = router;
