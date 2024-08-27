const express = require("express");
const {} = require("../controllers/nationalOfficialsController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");
const router = express.Router();
module.exports = router;
