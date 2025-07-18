const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  handleCreatePost,
  handleGetAllPosts,
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

// Create a new post (with optional image)
router.post("/", protect, upload.single("image"), handleCreatePost);

// Get all posts (public)
router.get("/", handleGetAllPosts);

// 💬 Comment Routes

// Add comment to a specific post
router.post("/:postId/comments", protect, createComment);

// Get all comments for a specific post
router.get("/:postId/comments", getComments);

// ❤️ Like or Unlike a post
router.post("/:postId/like", protect, handleToggleLike);

// 🔢 Get total like count for a post
router.get("/:postId/likes", handleLikeCount);

module.exports = router;
