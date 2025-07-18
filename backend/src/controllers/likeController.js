const { toggleLike, getLikeCount } = require("../models/likeModel");
const { createNotification } = require("../models/notificationModel");
const db = require("../config/db");

// @desc    Like or unlike a post
// @route   POST /api/posts/:postId/like
async function handleToggleLike(req, res) {
  const post_id = req.params.postId;
  const user_id = req.user.id;

  try {
    const result = await toggleLike(post_id, user_id);

    // Only notify if post was liked (not unliked)
    if (result.liked) {
      const post = await db.query("SELECT user_id FROM posts WHERE id = $1", [
        post_id,
      ]);

      const receiver_id = post.rows[0]?.user_id;

      // Don't notify if liking own post
      if (receiver_id && receiver_id !== user_id) {
        await createNotification({
          user_id: receiver_id,
          sender_id: user_id,
          post_id,
          type: "like",
        });
      }
    }

    res.status(200).json({
      liked: result.liked,
      message: result.liked ? "Post liked" : "Post unliked",
    });
  } catch (err) {
    console.error("Toggle Like Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get like count for a post
// @route   GET /api/posts/:postId/likes
async function handleLikeCount(req, res) {
  const post_id = req.params.postId;

  try {
    const count = await getLikeCount(post_id);
    res.status(200).json({ post_id, likes: count });
  } catch (err) {
    console.error("Get Like Count Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  handleToggleLike,
  handleLikeCount,
};
