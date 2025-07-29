const {
  getNotificationsByUser,
  markAllAsRead,
} = require("../models/notificationModel");

async function fetchNotifications(req, res) {
  try {
    const notifications = await getNotificationsByUser(req.user.id);
    res.json({ notifications });
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
}

async function markNotificationsAsRead(req, res) {
  try {
    await markAllAsRead(req.user.id);
    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error marking notifications" });
  }
}

module.exports = { fetchNotifications, markNotificationsAsRead };
