const express = require("express");
const {
  createSet,
  getAllSets,
  getSetAdmins,
  getSetMembers,
} = require("../controllers/setController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
// Route to create a new NOSA set and get all existing sets
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

// Route to get all members of a specific NOSA set
router.route("/:set/members").get(authenticateUser, getSetMembers);

module.exports = router;
