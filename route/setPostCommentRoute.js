const express = require("express");
const {
  addPostComment,
  deletePostComment,
  getAllPostComments,
} = require("../controllers/setPostCommentController");
const { authenticateUser } = require("../middleware/authentication");

const router = express.Router();
router.route("/").post(authenticateUser, addPostComment).get(authenticateUser, getAllPostComments);
router.route("/commentId").delete(authenticateUser, deletePostComment);
module.exports = router;
