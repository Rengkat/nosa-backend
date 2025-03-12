const express = require("express");
const {
  addEvent,
  updateEvent,
  removeEvent,
  uploadEventImage,
  getAllEvents,
  getSingleEvent,
} = require("../controllers/eventController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();
router
  .route("/")
  .get(getAllEvents)
  .post(authenticateUser, superAdminAuthorizationPermission, addEvent);
router.post(
  "/uploadImage",
  [authenticateUser, superAdminAuthorizationPermission],
  uploadEventImage
);
router
  .route("/:eventId")
  .get(getSingleEvent)
  .patch([authenticateUser, superAdminAuthorizationPermission], updateEvent)
  .delete([authenticateUser, superAdminAuthorizationPermission], removeEvent);
module.exports = router;
