const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  fetchNotifications,
  markNotificationsAsRead,
} = require("../controllers/notificationController");

router.get("/", protect, fetchNotifications);
router.put("/read", protect, markNotificationsAsRead);

module.exports = router;
