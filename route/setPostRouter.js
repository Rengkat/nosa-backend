const express = require("express");
const {
  createPost,
  updatePost,
  getAllPost,
  getSinglePost,
  deletePost,
} = require("../controllers/setPostController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();
router.route("/").post(authenticateUser, createPost).get(authenticateUser, getAllPost);
router
  .route("/:id")
  .get(authenticateUser, getSinglePost)
  .patch(authenticateUser, updatePost)
  .delete(authenticateUser, deletePost);
module.exports = router;
