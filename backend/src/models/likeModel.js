// models/likeModel.js
const db = require("../config/db");

/**
 * Toggle a like/unlike on a post.
 * Returns { liked: boolean } indicating the new state.
 */
async function toggleLike(postId, userId) {
  // check existing
  const { rows } = await db.query(
    `SELECT 1
     FROM likes
     WHERE post_id = $1
       AND user_id = $2
     LIMIT 1`,
    [postId, userId]
  );

  const already = rows.length > 0;
  if (already) {
    // remove like
    await db.query(
      `DELETE FROM likes
       WHERE post_id = $1
         AND user_id = $2`,
      [postId, userId]
    );
    return { liked: false };
  } else {
    // add like
    await db.query(
      `INSERT INTO likes (post_id, user_id)
       VALUES ($1, $2)`,
      [postId, userId]
    );
    return { liked: true };
  }
}

/**
 * Return total number of likes for a post.
 */
async function getLikeCount(postId) {
  const { rows } = await db.query(
    `SELECT COUNT(*)::int AS count
     FROM likes
     WHERE post_id = $1`,
    [postId]
  );
  return rows[0]?.count || 0;
}

module.exports = { toggleLike, getLikeCount };
