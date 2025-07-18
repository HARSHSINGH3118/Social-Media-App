const db = require("../config/db");

// Create a new post
async function createPost({ user_id, content, image_url }) {
  const result = await db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
    [user_id, content, image_url]
  );
  return result.rows[0];
}

// Get all posts (most recent first)
async function getAllPosts() {
  const result = await db.query(
    "SELECT posts.*, users.username FROM posts JOIN users ON posts.user_id = users.id ORDER BY created_at DESC"
  );
  return result.rows;
}

module.exports = {
  createPost,
  getAllPosts,
};
