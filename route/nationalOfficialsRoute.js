const express = require("express");
const {
  addOfficial,
  getAllOfficials,
  getSingleOfficial,
  updateOfficialPost,
  deleteOfficial,
} = require("../controllers/nationalOfficialsController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");
const router = express.Router();

router
  .route("/")
  .post([authenticateUser, superAdminAuthorizationPermission], addOfficial)
  .get(getAllOfficials);
router.put(
  "/update-official",
  [authenticateUser, superAdminAuthorizationPermission],
  updateOfficialPost
);
router.delete(
  "/delete-official",
  [authenticateUser, superAdminAuthorizationPermission],
  deleteOfficial
);
router.get("/:officeId", getSingleOfficial);
module.exports = router;
