const {
  sendMessage,
  getMessagesBetweenUsers,
  getChatHistory,
} = require("../models/messageModel");

// @desc    Send a new message
// @route   POST /api/messages
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
    console.error("Send Message Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get chat history between two users
// @route   GET /api/messages/:userId
async function getMessagesBetweenUsersHandler(req, res) {
  const sender_id = req.user.id;
  const receiver_id = req.params.userId;

  try {
    const messages = await getMessagesBetweenUsers(sender_id, receiver_id);
    res.json(messages);
  } catch (err) {
    console.error("Fetch Messages Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Optional helper function (not required in routes right now)
async function fetchChat(req, res) {
  const user1 = req.user.id;
  const user2 = parseInt(req.params.userId);
  if (!user2) return res.status(400).json({ message: "User ID required" });

  try {
    const messages = await getChatHistory(user1, user2);
    res.json(messages);
  } catch (err) {
    console.error("Fetch Chat Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createMessage,
  getMessagesBetweenUsersHandler,
  fetchChat, // optional
};
