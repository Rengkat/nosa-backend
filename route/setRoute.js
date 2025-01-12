const express = require("express");
const {
  createSet,
  getAllSets,
  getSetAdmins,
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

router
  .route("/setAdmins")
  .get(
    [authenticateUser, superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin")],
    getSetAdmins
  );
router
  .route("/:setId")
  .get(authenticateUser, getSingleSet)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateSet);
router.route("/:setId/verified-members").get(authenticateUser, getSetVerifiedMembers);
router.route("/:setId/unverified-members").get(authenticateUser, getSetUnVerifiedMembers);
router.post(
  "/:setId/upload-banner",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  uploadBannerImage
);
router.post(
  "/:setId/upload-cover-image",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  uploadCoverImage
);

module.exports = router;
