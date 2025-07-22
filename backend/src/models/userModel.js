const db = require("../config/db");

// ✅ Create a new user (registration)
async function createUser({ username, email, password }) {
  const result = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

// ✅ Get user by email (used in login and checks)
async function getUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

// ✅ Alias for OAuth login flow
async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

// ✅ Create new OAuth user
async function createOAuthUser({ email, username, avatar, provider }) {
  const result = await db.query(
    "INSERT INTO users (email, username, avatar, provider) VALUES ($1, $2, $3, $4) RETURNING *",
    [email, username, avatar, provider]
  );
  return result.rows[0];
}

// ✅ Get user by ID (for JWT-authenticated route)
async function getUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

// ✅ Get user by username (for mentions, etc.)
async function getUserByUsername(username) {
  const result = await db.query(
    "SELECT * FROM users WHERE LOWER(username) = $1",
    [username.toLowerCase()]
  );
  return result.rows[0];
}

// ✅ Update user profile (username, bio, avatar)
async function updateUserProfile(userId, { username, bio, avatar }) {
  const result = await db.query(
    `
    UPDATE users 
    SET 
      username = COALESCE($1, username), 
      bio = COALESCE($2, bio), 
      avatar = COALESCE($3, avatar)
    WHERE id = $4
    RETURNING id, username, email, avatar, bio;
    `,
    [username, bio, avatar, userId]
  );
  return result.rows[0];
}

// ✅ Get public profile by username + posts (include avatar/bio!)
async function getUserByUsernameWithPosts(username) {
  const userResult = await db.query(
    `SELECT id, username, email, avatar, bio, created_at 
     FROM users 
     WHERE LOWER(username) = $1`,
    [username.toLowerCase()]
  );

  const user = userResult.rows[0];
  if (!user) return null;

  const postsResult = await db.query(
    `SELECT id, content, image_url, created_at,
            (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS like_count
     FROM posts
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user.id]
  );

  return {
    user,
    posts: postsResult.rows,
  };
}

// ✅ Export all
module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUserProfile,
  findUserByEmail,
  createOAuthUser,
  getUserByUsernameWithPosts,
};
