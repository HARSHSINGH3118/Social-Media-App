const { getPostsByTag } = require("../models/tagModel");

// @desc    Get posts by hashtag
// @route   GET /api/tags/:tagName/posts
async function getPostsForTag(req, res) {
  const tag = req.params.tagName;
  try {
    const posts = await getPostsByTag(tag);
    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Posts by Tag Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  getPostsForTag,
};
