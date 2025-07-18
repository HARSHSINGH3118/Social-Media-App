const db = require("../config/db");
const { getIO } = require("../socket");

// ✅ Create a new notification and emit via Socket.IO
async function createNotification({ user_id, sender_id, post_id, type }) {
  const result = await db.query(
    `INSERT INTO notifications (user_id, sender_id, post_id, type)
     VALUES ($1, $2, $3, $4) RETURNING *`,
    [user_id, sender_id, post_id, type]
  );

  const notification = result.rows[0];

  // ✅ Emit notification to the user's socket room
  const io = getIO();
  io.to(user_id.toString()).emit("notification", notification);

  return notification;
}

// 📥 Get all notifications for a user
async function getNotificationsByUser(user_id) {
  const result = await db.query(
    `SELECT notifications.*, users.username AS sender_name, posts.content AS post_content
     FROM notifications
     JOIN users ON notifications.sender_id = users.id
     JOIN posts ON notifications.post_id = posts.id
     WHERE notifications.user_id = $1
     ORDER BY notifications.created_at DESC`,
    [user_id]
  );
  return result.rows;
}

// ✅ Mark all notifications as read
async function markAllAsRead(user_id) {
  await db.query(
    "UPDATE notifications SET is_read = TRUE WHERE user_id = $1 AND is_read = FALSE",
    [user_id]
  );
}

module.exports = {
  createNotification,
  getNotificationsByUser,
  markAllAsRead,
};
