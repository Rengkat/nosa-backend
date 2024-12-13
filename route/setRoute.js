const express = require("express");
const {
  createSet,
  getAllSets,
  getSetAdmins,
  getSetVerifiedMembers,
  getSetUnVerifiedMembers,
  uploadBannerImage,
  uploadCoverImage,
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

router
  .route("/setAdmins")
  .get(
    [authenticateUser, superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin")],
    getSetAdmins
  );
router.post("/upload-banner", uploadBannerImage);
router.post("/upload-cover-image", uploadCoverImage);
router.route("/:set/members").get(authenticateUser, getSetVerifiedMembers);
router.route("/:set/unverified-members").get(authenticateUser, getSetUnVerifiedMembers);

module.exports = router;
