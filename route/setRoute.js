const express = require("express");
const {
  createSet,
  getAllSets,
  getSetVerifiedMembers,
  getSetUnVerifiedMembers,
  uploadBannerImage,
  uploadCoverImage,
  updateSet,
  getSingleSet,
} = require("../controllers/setController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .get(getAllSets)
  .post([authenticateUser, superAdminAuthorizationPermission], createSet);

router.post(
  "/upload-banner",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  uploadBannerImage
);
router.post(
  "/upload-cover-image",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  uploadCoverImage
);
router
  .route("/:setId")
  .get(authenticateUser, getSingleSet)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateSet);
router.route("/:setId/verified-members").get(authenticateUser, getSetVerifiedMembers);
router.route("/:setId/unverified-members").get(authenticateUser, getSetUnVerifiedMembers);

module.exports = router;
