const express = require("express");
const router = express.Router();

const {
  fetchNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

// @route   GET /api/notifications
// @desc    Get all notifications for the logged-in user
router.get("/", protect, fetchNotifications);

// @route   PUT /api/notifications/read
// @desc    Mark all notifications as read
router.put("/read", protect, markNotificationsAsRead);

module.exports = router;
