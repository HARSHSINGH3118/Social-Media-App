const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createMessage,
  getMessagesBetweenUsersHandler,
  getLastMessagesByUserId,
  deleteMessageHandler, // ✅ Add this line
} = require("../controllers/messageController");

// Fetch latest message per chat partner (sidebar)
router.get("/last", protect, getLastMessagesByUserId);

// Send a message
router.post("/", protect, createMessage);

// Get chat between 2 users
router.get("/:userId", protect, getMessagesBetweenUsersHandler);

// Delete message by ID
router.delete("/:messageId", protect, deleteMessageHandler);

module.exports = router;
