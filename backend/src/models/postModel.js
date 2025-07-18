const db = require("../config/db");

// Create a new post
async function createPost({ user_id, content, image_url }) {
  const result = await db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
    [user_id, content, image_url]
  );
  return result.rows[0];
}

// Get all posts with like count and likedByUser
async function getAllPosts(user_id) {
  const result = await db.query(
    `
    SELECT 
      posts.*, 
      users.username,
      COUNT(likes.*) AS like_count,
      BOOL_OR(likes.user_id = $1) AS liked_by_user
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    GROUP BY posts.id, users.username
    ORDER BY posts.created_at DESC
    `,
    [user_id]
  );
  return result.rows;
}

module.exports = {
  createPost,
  getAllPosts,
};
