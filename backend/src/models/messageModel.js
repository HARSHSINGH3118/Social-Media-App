const db = require("../config/db");

// @desc Save a new message
async function sendMessage(sender_id, receiver_id, content) {
  const result = await db.query(
    `INSERT INTO messages (sender_id, receiver_id, content)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [sender_id, receiver_id, content]
  );
  return result.rows[0];
}

// @desc Fetch chat history between two users
async function getMessagesBetweenUsers(user1, user2) {
  const result = await db.query(
    `SELECT * FROM messages
     WHERE (sender_id = $1 AND receiver_id = $2)
        OR (sender_id = $2 AND receiver_id = $1)
     ORDER BY created_at ASC`,
    [user1, user2]
  );
  return result.rows;
}

// Optional: raw chat history function (alias)
async function getChatHistory(user1, user2) {
  return await getMessagesBetweenUsers(user1, user2);
}

// Optional: alternate save method if needed elsewhere
async function saveMessage({ sender_id, receiver_id, content }) {
  return await sendMessage(sender_id, receiver_id, content);
}

module.exports = {
  sendMessage,
  getMessagesBetweenUsers,
  getChatHistory, // alias
  saveMessage, // alias
};
