const db = require("../config/db");

// Add a new comment to a post
// Add a new comment to a post
async function addComment({ post_id, user_id, content }) {
  const result = await db.query(
    `INSERT INTO comments (post_id, user_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, post_id, user_id, content, created_at`,
    [post_id, user_id, content]
  );

  const comment = result.rows[0];

  // Fetch username
  const userRes = await db.query("SELECT username FROM users WHERE id = $1", [
    user_id,
  ]);

  comment.username = userRes.rows[0]?.username || "unknown";
  return comment;
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

  // Format each comment to match frontend expectations
  return result.rows.map((row) => ({
    id: row.id,
    content: row.content,
    created_at: row.created_at,
    user: { username: row.username },
  }));
}

module.exports = {
  addComment,
  getCommentsByPostId,
};
