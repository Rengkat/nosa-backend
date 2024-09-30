const express = require("express");
const { register, login, logout, verifyEmail } = require("../controllers/authController");
const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.post("/logout", logout);
module.exports = router;
