const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
  updateUser,
} = require("../controllers/userController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllUsers);
router.put("/updateCurrentUser", authenticateUser, updateCurrentUser);
router
  .route("/:userId")
  .get(getSingleUser)
  .delete([authenticateUser, superAdminAuthorizationPermission("superAdmin")], deleteUser)
  .patch(
    [authenticateUser, superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin")],
    updateUser
  );

module.exports = router;
