const express = require("express");
const {
  createSet,
  getAllSets,
  updateSet,
  getSetAdmins,
  getSetMembers,
} = require("../controllers/setController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.route("/").get(getAllSets).post(createSet);
// router.route("/upload").post(authenticateUser, uploadUserImage);
router.put("/updateSet", authenticateUser, updateSet);
router.route("/:set").get(getSetMembers);

module.exports = router;
