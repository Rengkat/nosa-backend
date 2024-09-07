const express = require("express");
const {
  addShowcase,
  updateShowcase,
  deleteShowcase,
  getAllShowcase,
  getSingleShowcase,
  uploadImage,
} = require("../controllers/showcaseController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addShowcase)
  .get(getAllShowcase);
router.post("/uploadImage", [authenticateUser, superAdminAuthorizationPermission], uploadImage);
router
  .route("/:id")
  .get(getSingleShowcase)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateShowcase)
  .delete([authenticateUser, superAdminAuthorizationPermission], deleteShowcase);
module.exports = router;
