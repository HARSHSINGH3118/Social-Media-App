const {
  followUser,
  unfollowUser,
  isFollowing,
  getFollowers,
  getFollowing,
} = require("../models/followModel");

const { createNotification } = require("../models/notificationModel");

// @desc    Follow a user
// @route   POST /api/users/:id/follow
async function handleFollow(req, res) {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  if (follower_id === following_id)
    return res.status(400).json({ message: "You can't follow yourself" });

  try {
    await followUser(follower_id, following_id);

    // Notify the user being followed
    await createNotification({
      user_id: following_id,
      sender_id: follower_id,
      post_id: null,
      type: "follow",
    });

    res.status(200).json({ message: "User followed" });
  } catch (err) {
    console.error("Follow Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Unfollow a user
// @route   DELETE /api/users/:id/follow
async function handleUnfollow(req, res) {
  const follower_id = req.user.id;
  const following_id = req.params.id;

  try {
    await unfollowUser(follower_id, following_id);
    res.status(200).json({ message: "User unfollowed" });
  } catch (err) {
    console.error("Unfollow Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get list of followers
// @route   GET /api/users/:id/followers
async function getFollowersList(req, res) {
  try {
    const followers = await getFollowers(req.params.id);
    res.status(200).json(followers);
  } catch (err) {
    console.error("Get Followers Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get list of users the user is following
// @route   GET /api/users/:id/following
async function getFollowingList(req, res) {
  try {
    const following = await getFollowing(req.params.id);
    res.status(200).json(following);
  } catch (err) {
    console.error("Get Following Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  handleFollow,
  handleUnfollow,
  getFollowersList,
  getFollowingList,
};
