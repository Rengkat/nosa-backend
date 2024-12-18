const express = require("express");
const router = express.Router();
const {
  sendMessage,
  getAllSetMessage,
  updateMessage,
  deleteMessage,
  adminModerateMessage,
} = require("../controllers/setDiscussionController");
const {
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission,
} = require("../middleware/authentication");

router.route("/").post(authenticateUser, sendMessage).get(authenticateUser, getAllSetMessage);
router.post(
  "/moderate",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  adminModerateMessage
);
router.patch(
  "/moderate-message",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  adminModerateMessage
);
router.patch("/:messageId", authenticateUser, updateMessage);
router.delete("/:messageId", authenticateUser, deleteMessage);

module.exports = router;
