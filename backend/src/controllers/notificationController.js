const {
  getNotificationsByUser,
  markAllAsRead,
} = require("../models/notificationModel");

// @desc    Get all notifications for the logged-in user
// @route   GET /api/notifications
async function fetchNotifications(req, res) {
  try {
    const notifications = await getNotificationsByUser(req.user.id);
    res.status(200).json(notifications);
  } catch (err) {
    console.error("Fetch Notifications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read
async function markNotificationsAsRead(req, res) {
  try {
    await markAllAsRead(req.user.id);
    res.status(200).json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("Mark Notifications Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  fetchNotifications,
  markNotificationsAsRead,
};
