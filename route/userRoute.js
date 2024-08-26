const express = require("express");
const {
  getAllUsers,
  getSingleUser,
  deleteUser,
  updateCurrentUser,
} = require("../controllers/userController");
const { authenticateUser, authorizationPermission } = require("../middleware/authentication");
// const { authenticateUser, authorizationPermission } = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllUsers);
router.put("/updateCurrentUser", authenticateUser, updateCurrentUser);
router
  .route("/:userId")
  .get(getSingleUser)
  .delete([authenticateUser, authorizationPermission("superAdmin")], deleteUser);

module.exports = router;
