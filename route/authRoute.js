const express = require("express");
const { register, login, logout, verifyEmail } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", authenticateUser, logout);
module.exports = router;
