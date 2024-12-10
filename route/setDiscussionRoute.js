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

router.post("/message", authenticateUser, sendMessage);
router.patch("/message", authenticateUser, updateMessage);
router.post(
  "/message/moderate",
  authenticateUser,
  superAdminAndSetAdminAuthorizationPermission("superAdmin", "setAdmin"),
  adminModerateMessage
);
router.get("/:setId/messages", getAllSetMessage);
router.delete("/:setId/message/:messageId", authenticateUser, deleteMessage);

module.exports = router;
