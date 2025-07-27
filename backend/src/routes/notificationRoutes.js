const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  fetchNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");
const { getIO } = require("../socket");

// Routes
router.get("/", protect, fetchNotifications);
router.put("/read", protect, markNotificationsAsRead);

// ✅ TEST: Emit real-time notification manually
router.get("/test/:userId", (req, res) => {
  const { userId } = req.params;
  const io = getIO();

  console.log("🔔 Emitting test notification to room:", userId);
  io.to(userId.toString()).emit("notification", {
    message: "📢 Test notification from backend",
    read: false,
    type: "test",
  });

  res.status(200).json({ message: `Notification sent to ${userId}` });
});

module.exports = router;
