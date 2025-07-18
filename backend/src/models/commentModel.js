const db = require("../config/db");

// Add a new comment to a post
async function addComment({ post_id, user_id, content }) {
  const result = await db.query(
    "INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3) RETURNING *",
    [post_id, user_id, content]
  );
  return result.rows[0];
}

// Get all comments for a post
async function getCommentsByPostId(post_id) {
  const result = await db.query(
    `SELECT comments.*, users.username 
     FROM comments 
     JOIN users ON comments.user_id = users.id 
     WHERE post_id = $1 
     ORDER BY created_at ASC`,
    [post_id]
  );
  return result.rows;
}

module.exports = {
  addComment,
  getCommentsByPostId,
};
