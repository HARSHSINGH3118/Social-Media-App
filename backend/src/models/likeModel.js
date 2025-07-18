const db = require("../config/db");

// Toggle like/unlike on a post
async function toggleLike(post_id, user_id) {
  const existing = await db.query(
    "SELECT * FROM likes WHERE post_id = $1 AND user_id = $2",
    [post_id, user_id]
  );

  if (existing.rows.length > 0) {
    // Unlike
    await db.query("DELETE FROM likes WHERE post_id = $1 AND user_id = $2", [
      post_id,
      user_id,
    ]);
    return { liked: false };
  } else {
    // Like
    await db.query("INSERT INTO likes (post_id, user_id) VALUES ($1, $2)", [
      post_id,
      user_id,
    ]);
    return { liked: true };
  }
}

// Get total like count for a post
async function getLikeCount(post_id) {
  const result = await db.query(
    "SELECT COUNT(*) FROM likes WHERE post_id = $1",
    [post_id]
  );
  return parseInt(result.rows[0].count, 10);
}

module.exports = {
  toggleLike,
  getLikeCount,
};
