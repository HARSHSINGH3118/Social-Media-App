// controllers/likeController.js
const { toggleLike, getLikeCount } = require("../models/likeModel");
const { createNotification } = require("../models/notificationModel");
const db = require("../config/db");

// Toggle like/unlike on a post
// POST /api/posts/:postId/like
async function handleToggleLike(req, res) {
  const post_id = req.params.postId;
  const user_id = req.user.id;

  try {
    const result = await toggleLike(post_id, user_id);

    // notify on new like
    if (result.liked) {
      const ownerQ = await db.query("SELECT user_id FROM posts WHERE id = $1", [
        post_id,
      ]);
      const receiver_id = ownerQ.rows[0]?.user_id;
      if (receiver_id && receiver_id !== user_id) {
        await createNotification({
          user_id: receiver_id,
          sender_id: user_id,
          post_id,
          type: "like",
        });
      }
    }

    // new absolute count
    const count = await getLikeCount(post_id);

    return res.status(200).json({
      liked: result.liked,
      likesCount: count,
      message: result.liked ? "Post liked" : "Post unliked",
    });
  } catch (err) {
    console.error("🚨 handleToggleLike error:", err);
    return res.status(500).json({ message: "Server error toggling like" });
  }
}

// Get like count + whether current user has liked
// GET /api/posts/:postId/likes
async function handleLikeCount(req, res) {
  const post_id = req.params.postId;
  // req.user may be undefined (optionalAuth)
  const user_id = req.user?.id;

  try {
    const count = await getLikeCount(post_id);

    // determine if the current user already liked this post
    let likedByUser = false;
    if (user_id) {
      const { rows } = await db.query(
        `SELECT 1 FROM likes WHERE post_id = $1 AND user_id = $2 LIMIT 1`,
        [post_id, user_id]
      );
      likedByUser = rows.length > 0;
    }

    return res.status(200).json({ likesCount: count, likedByUser });
  } catch (err) {
    console.error("🚨 handleLikeCount error:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching like count" });
  }
}

module.exports = { handleToggleLike, handleLikeCount };
