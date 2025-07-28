const db = require("../config/db");

// ✅ Create a new post
async function createPost({ user_id, content, image_url }) {
  const result = await db.query(
    "INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *",
    [user_id, content, image_url]
  );
  return result.rows[0];
}

// ✅ Get all posts (with like count and tags, for feed)
async function getAllPosts(user_id) {
  const result = await db.query(
    `
    SELECT 
      posts.*, 
      users.username,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT tags.name), NULL) AS tags,
      COALESCE(COUNT(DISTINCT likes.user_id), 0) AS like_count,
      COALESCE(BOOL_OR(likes.user_id = $1), false) AS liked_by_user
    FROM posts
    JOIN users ON posts.user_id = users.id
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN post_tags ON posts.id = post_tags.post_id
    LEFT JOIN tags ON post_tags.tag_id = tags.id
    GROUP BY posts.id, users.username
    ORDER BY posts.created_at DESC
    `,
    [user_id]
  );
  return result.rows;
}

// ✅ Get posts by user ID (for profile page)
async function getPostsByUserId(userId) {
  const result = await db.query(
    `
    SELECT 
      posts.*,
      ARRAY_REMOVE(ARRAY_AGG(DISTINCT tags.name), NULL) AS tags,
      COALESCE(COUNT(DISTINCT likes.user_id), 0) AS like_count
    FROM posts
    LEFT JOIN likes ON posts.id = likes.post_id
    LEFT JOIN post_tags ON posts.id = post_tags.post_id
    LEFT JOIN tags ON post_tags.tag_id = tags.id
    WHERE posts.user_id = $1
    GROUP BY posts.id
    ORDER BY posts.created_at DESC
    `,
    [userId]
  );
  return result.rows;
}

// ✅ Get a single post by ID
async function getPostById(postId) {
  const result = await db.query("SELECT * FROM posts WHERE id = $1", [postId]);
  return result.rows[0];
}

// ✅ Update post content (for editing caption)
async function updatePostContent(postId, content) {
  const result = await db.query(
    "UPDATE posts SET content = $1 WHERE id = $2 RETURNING *",
    [content, postId]
  );
  return result.rows[0];
}

// ✅ Delete all tags associated with a post (before re-adding updated ones)
async function deleteTagsForPost(postId) {
  await db.query("DELETE FROM post_tags WHERE post_id = $1", [postId]);
}

module.exports = {
  createPost,
  getAllPosts,
  getPostsByUserId,
  getPostById,
  updatePostContent,
  deleteTagsForPost,
};
