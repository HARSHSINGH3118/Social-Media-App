const express = require("express");
const router = express.Router();
const { getPostsForTag } = require("../controllers/tagController");

// Public route to get posts by tag
router.get("/:tagName/posts", getPostsForTag);

module.exports = router;
