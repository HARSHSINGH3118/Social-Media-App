const db = require("../config/db");

// Follow a user
async function followUser(follower_id, following_id) {
  await db.query(
    `INSERT INTO follows (follower_id, following_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [follower_id, following_id]
  );
}

// Unfollow a user
async function unfollowUser(follower_id, following_id) {
  await db.query(
    `DELETE FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [follower_id, following_id]
  );
}

// Check if following
async function isFollowing(follower_id, following_id) {
  const result = await db.query(
    `SELECT 1 FROM follows WHERE follower_id = $1 AND following_id = $2`,
    [follower_id, following_id]
  );
  return result.rows.length > 0;
}

// Get followers of a user
async function getFollowers(user_id) {
  const result = await db.query(
    `SELECT users.id, users.username
     FROM follows
     JOIN users ON follows.follower_id = users.id
     WHERE follows.following_id = $1`,
    [user_id]
  );
  return result.rows;
}

// Get users a user is following
async function getFollowing(user_id) {
  const result = await db.query(
    `SELECT users.id, users.username
     FROM follows
     JOIN users ON follows.following_id = users.id
     WHERE follows.follower_id = $1`,
    [user_id]
  );
  return result.rows;
}

module.exports = {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
};
