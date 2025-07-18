const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");

const {
  fetchChat,
  createMessage,
  getMessagesBetweenUsersHandler,
} = require("../controllers/messageController");

// 📩 Send a new message
// POST /api/messages
router.post("/", protect, createMessage);

// 💬 Get chat history with a specific user
// GET /api/messages/:userId
router.get("/:userId", protect, getMessagesBetweenUsersHandler);

// (Optional) Alias if needed
// router.get("/chat/:userId", protect, fetchChat);

module.exports = router;
