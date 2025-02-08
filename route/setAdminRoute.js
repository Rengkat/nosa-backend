const express = require("express");
const {
  getAllSetAdmins,
  makeSetAdmin,
  removeSetAdmin,
} = require("../controllers/setAdminController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], makeSetAdmin)
  .get([authenticateUser, superAdminAuthorizationPermission], getAllSetAdmins)
  .delete([authenticateUser, superAdminAuthorizationPermission], removeSetAdmin);
module.exports = router;
