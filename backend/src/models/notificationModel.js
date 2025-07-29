const db = require("../config/db");

async function createNotification({
  user_id,
  sender_id,
  post_id,
  type,
  message,
}) {
  const inserted = await db.query(
    `INSERT INTO notifications (user_id, sender_id, post_id, type, message)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [user_id, sender_id, post_id, type, message]
  );

  const id = inserted.rows[0].id;

  const enriched = await db.query(
    `SELECT n.*, u.username AS sender_name, u.avatar AS sender_avatar
     FROM notifications n
     JOIN users u ON n.sender_id = u.id
     WHERE n.id = $1`,
    [id]
  );

  return enriched.rows[0];
}

async function getNotificationsByUser(user_id) {
  const result = await db.query(
    `SELECT n.*, u.username AS sender_name, u.avatar AS sender_avatar
     FROM notifications n
     JOIN users u ON n.sender_id = u.id
     WHERE n.user_id = $1
     ORDER BY n.created_at DESC`,
    [user_id]
  );
  return result.rows;
}

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
