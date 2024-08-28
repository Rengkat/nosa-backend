const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
  updateUser,
  uploadUserImage,
} = require("../controllers/userController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllUsers);
router.route("/upload").post(uploadUserImage);
router.put("/updateCurrentUser", authenticateUser, updateCurrentUser);
router
  .route("/:userId")
  .get(getSingleUser)
  .delete([authenticateUser, superAdminAuthorizationPermission], deleteUser)
  .patch(
    [authenticateUser, superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin")],
    updateUser
  );

module.exports = router;
