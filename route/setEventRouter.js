const express = require("express");
const {
  createSetEvent,
  getAllSetEvent,
  getSingleSetEvent,
  updateSetEvent,
  deleteSetEvent,
} = require("../controllers/setEventController");
const {
  authenticateUser,
  superAdminAuthorizationPermission,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

const router = express.Router();

router
  .route("/")
  .post(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    createSetEvent
  )
  .get(authenticateUser, getAllSetEvent);
router
  .route("/:id")
  .get(authenticateUser, getSingleSetEvent)
  .patch(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    updateSetEvent
  )
  .delete(
    authenticateUser,
    superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
    deleteSetEvent
  );

module.exports = router;
