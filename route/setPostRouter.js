const express = require("express");
const {
  createPost,
  updatePost,
  getAllPost,
  getSinglePost,
  deletePost,
  uploadImage,
} = require("../controllers/setPostController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();
router.route("/").post(authenticateUser, createPost).get(authenticateUser, getAllPost);
router.route("/upload-image").post(authenticateUser, uploadImage);
router
  .route("/:id")
  .get(authenticateUser, getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);
module.exports = router;
