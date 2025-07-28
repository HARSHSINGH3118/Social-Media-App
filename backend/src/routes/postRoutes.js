const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/uploadMiddleware");

const {
  handleCreatePost,
  handleGetAllPosts,
  handleUpdatePost, // ✅ Edit Post
} = require("../controllers/postController");

const {
  createComment,
  getComments,
} = require("../controllers/commentController");

const {
  handleToggleLike,
  handleLikeCount,
} = require("../controllers/likeController");

// 📝 Post Routes
router.post("/", protect, upload.single("image"), handleCreatePost); // Create new post
router.get("/", optionalAuth, handleGetAllPosts); // Get all posts
router.put("/:id", protect, handleUpdatePost); // ✅ Update post

// 💬 Comment Routes
router.post("/:postId/comments", protect, createComment); // Add comment
router.get("/:postId/comments", getComments); // Get comments

// ❤️ Like Routes
router.post("/:postId/like", protect, handleToggleLike); // Toggle like
router.get("/:postId/likes", handleLikeCount); // Get like count

module.exports = router;
