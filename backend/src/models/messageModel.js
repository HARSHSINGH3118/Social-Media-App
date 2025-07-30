const db = require("../config/db");

// Save a new message
async function sendMessage(sender_id, receiver_id, content) {
  const result = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3) RETURNING *`,
    [sender_id, receiver_id, content]
  );
  return result.rows[0];
}

// Get all messages between two users
async function getMessagesBetweenUsers(user1, user2) {
  const result = await db.query(
    `SELECT * FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2) OR
           (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );
  return result.rows;
}

// Get latest message per user for sidebar
async function getLastMessagesPerUser(userId) {
  const result = await db.query(
    `SELECT DISTINCT ON (LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id))
      id, sender_id, receiver_id, content, created_at
    FROM messages
    WHERE sender_id = $1 OR receiver_id = $1
    ORDER BY LEAST(sender_id, receiver_id), GREATEST(sender_id, receiver_id), created_at DESC`,
    [userId]
  );

  const grouped = {};
  for (const msg of result.rows) {
    const otherUserId =
      msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
    grouped[otherUserId] = {
      content: msg.content,
      created_at: msg.created_at,
      unread: true, // optional enhancement
    };
  }

  return grouped;
}

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
  getLastMessagesPerUser,
};
