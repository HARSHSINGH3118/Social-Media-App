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
    // 1. Add the comment
    const comment = await addComment({ post_id, user_id, content });

    // 2. Notify the post owner if it's not the commenter
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

    // 3. Notify mentioned users
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

    // ✅ 4. Add the commenter's username to the response
    const user = await db.query("SELECT username FROM users WHERE id = $1", [
      user_id,
    ]);
    comment.username = user.rows[0]?.username || "unknown";

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
