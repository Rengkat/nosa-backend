const express = require("express");
const { loginAdmin, logoutAdmin } = require("../controllers/adminAuthController");
const {
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.post("/login", loginAdmin);
router.post(
  "/logout",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  logoutAdmin
);
