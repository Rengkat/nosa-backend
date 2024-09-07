const express = require("express");
const {
  createAchievementCategory,
  addAchievement,
  deleteAchievement,
  getAllAchievements,
  updateAchievement,
} = require("../controllers/achievementsController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addAchievement)
  .get(getAllAchievements);
router.post(
  "/create-achievement-category",
  [authenticateUser, superAdminAuthorizationPermission],
  createAchievementCategory
);
router
  .route("/:id")
  .patch([authenticateUser, superAdminAuthorizationPermission], updateAchievement)
  .delete([authenticateUser, superAdminAuthorizationPermission], deleteAchievement);
module.exports = router;
