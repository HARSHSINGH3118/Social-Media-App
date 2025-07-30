const db = require("../config/db");
const {
  sendMessage,
  getMessagesBetweenUsers,
  getLastMessagesPerUser,
} = require("../models/messageModel");

// Send a message
async function createMessage(req, res) {
  const sender_id = req.user.id;
  const { receiver_id, content } = req.body;

  if (!receiver_id || !content) {
    return res
      .status(400)
      .json({ message: "Receiver and content are required" });
  }

  try {
    const message = await sendMessage(sender_id, receiver_id, content);
    res.status(201).json(message);
  } catch (err) {
    console.error("Send Message Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

// Get chat between two users
async function getMessagesBetweenUsersHandler(req, res) {
  const sender_id = req.user.id;
  const receiver_id = req.params.userId;

  try {
    const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
    res.json(messages);
  } catch (err) {
    console.error("Fetch Messages Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

// Get last messages for all chats (sidebar)
async function getLastMessagesByUserId(req, res) {
  const userId = req.user.id;
  try {
    const messages = await getLastMessagesPerUser(userId);
    res.json(messages);
  } catch (err) {
    console.error("Fetch Last Messages Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
}

// Delete a message
const deleteMessageHandler = async (req, res) => {
  const messageId = req.params.messageId;
  const userId = req.user.id;

  try {
    const result = await db.query(
      `DELETE FROM messages WHERE id = $1 AND sender_id = $2 RETURNING *`,
      [messageId, userId]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Message not found or unauthorized" });
    }

    res.json({ message: "Message deleted", data: result.rows[0] });
  } catch (err) {
    console.error("Delete Message Error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createMessage,
  getMessagesBetweenUsersHandler,
  getLastMessagesByUserId,
  deleteMessageHandler,
};
