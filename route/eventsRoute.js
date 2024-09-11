const express = require("express");
const { getAllEvents } = require("../controllers/newsAndBlogController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.get("/", getAllEvents);
module.exports = router;
