const { addComment, getCommentsByPostId } = require("../models/commentModel");
const { createNotification } = require("../models/notificationModel");
const { getUserByUsername } = require("../models/userModel");
const extractMentions = require("../utils/parseMentions");
const db = require("../config/db");

// @desc    Add a comment to a post
// @route   POST /api/posts/:postId/comments
async function createComment(req, res) {
  const { content } = req.body;
  const post_id = req.params.postId;
  const user_id = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  try {
    const comment = await addComment({ post_id, user_id, content });

    // 🔔 Notify post owner (if not the commenter)
    const post = await db.query("SELECT user_id FROM posts WHERE id = $1", [
      post_id,
    ]);
    const receiver_id = post.rows[0]?.user_id;

    if (receiver_id && receiver_id !== user_id) {
      await createNotification({
        user_id: receiver_id,
        sender_id: user_id,
        post_id,
        type: "comment",
      });
    }

    // 🔔 Notify mentioned users
    const mentions = extractMentions(content);
    for (const username of mentions) {
      const mentionedUser = await getUserByUsername(username);
      if (mentionedUser && mentionedUser.id !== user_id) {
        await createNotification({
          user_id: mentionedUser.id,
          sender_id: user_id,
          post_id,
          type: "mention",
        });
      }
    }

    res.status(201).json(comment);
  } catch (err) {
    console.error("Create Comment Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get all comments for a post
// @route   GET /api/posts/:postId/comments
async function getComments(req, res) {
  const post_id = req.params.postId;

  try {
    const comments = await getCommentsByPostId(post_id);
    res.status(200).json(comments);
  } catch (err) {
    console.error("Get Comments Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  createComment,
  getComments,
};
