const express = require("express");
const {
  createPost,
  updatePost,
  getAllPost,
  getSinglePost,
  deletePost,
} = require("../controllers/setPostController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router.route("/").post(authenticateUser, createPost);
