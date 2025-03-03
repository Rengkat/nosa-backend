const express = require("express");
const {
  addNewsAndBlog,
  updateNewsOrBlog,
  removeNewsOrBlog,
  getAllNewsAndBlogs,
  getSingleNewsOrBlog,
  uploadNewsOrBlogImage,
  getAllBlogs,
  getAllNews,
} = require("../controllers/newsAndBlogController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addNewsAndBlog)
  .get(getAllNewsAndBlogs);
router.get("/news", getAllNews);
router.get("/blogs", getAllBlogs);
router.post(
  "/uploadImage",
  [authenticateUser, superAdminAuthorizationPermission],
  uploadNewsOrBlogImage
);
router
  .route("/:id")
  .get(getSingleNewsOrBlog)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateNewsOrBlog)
  .delete([authenticateUser, superAdminAuthorizationPermission], removeNewsOrBlog);
module.exports = router;
