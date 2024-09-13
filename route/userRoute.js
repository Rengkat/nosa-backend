const express = require("express");
const {
  getAllVerifiedUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
  updateUser,
  uploadUserImage,
  verifyUser,
  getAllUnverifiedUsers,
} = require("../controllers/userController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllVerifiedUsers);
router.get(
  "/unverified-users",
  authenticateUser,
  superAdminAuthorizationPermission,
  getAllUnverifiedUsers
);
router.route("/uploadUserImage").post(authenticateUser, uploadUserImage);
router.put("/updateCurrentUser", authenticateUser, updateCurrentUser);
router.patch(
  "/verify",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  verifyUser
);
router
  .route("/:userId")
  .get(getSingleUser)
  .delete([authenticateUser, superAdminAuthorizationPermission], deleteUser)
  .patch(
    [authenticateUser, superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin")],
    updateUser
  );
module.exports = router;
