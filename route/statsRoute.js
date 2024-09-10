const express = require("express");
const { getStats } = require("../controllers/statsController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");
const router = express.Router();
router.get("/", authenticateUser, getStats);
module.exports = router;
