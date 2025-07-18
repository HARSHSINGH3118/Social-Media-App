const db = require("../config/db");

// Create a new user (regular registration)
async function createUser({ username, email, password }) {
  const result = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

// Get user by email
async function getUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

// Get user by ID
async function getUserById(id) {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

// Get user by username (used for @mentions)
async function getUserByUsername(username) {
  const result = await db.query(
    "SELECT * FROM users WHERE LOWER(username) = $1",
    [username.toLowerCase()]
  );
  return result.rows[0];
}

// Update user profile
async function updateUserProfile(id, { username, bio, avatar }) {
  const result = await db.query(
    "UPDATE users SET username = $1, bio = $2, avatar = $3 WHERE id = $4 RETURNING *",
    [username, bio, avatar, id]
  );
  return result.rows[0];
}

// 🔐 OAuth support
async function findUserByEmail(email) {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function createOAuthUser({ email, username, avatar, provider }) {
  const result = await db.query(
    `INSERT INTO users (email, username, avatar, provider)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [email, username, avatar, provider]
  );
  return result.rows[0];
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUserProfile,
  findUserByEmail,
  createOAuthUser,
};
