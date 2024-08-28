const express = require("express");
const {
  addOfficial,
  getAllOfficials,
  getSingleOfficial,
  updateOfficialPost,
  deleteOfficial,
} = require("../controllers/nationalOfficialsController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addOfficial)
  .get([authenticateUser, superAdminAuthorizationPermission], getAllOfficials);

module.exports = router;
