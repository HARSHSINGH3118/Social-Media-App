// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");

// Use memory storage for Cloudinary uploads
const storage = multer.memoryStorage();
const avatarUpload = multer({ storage });

// 🔐 Auth & Profile Controllers
const {
  registerUser,
  loginUser,
  oauthLogin,
  getProfile,
  updateProfile,
  getPublicProfile,
} = require("../controllers/userController");

// 👥 Follow Controllers
const {
  handleFollow,
  handleUnfollow,
  getFollowersList,
  getFollowingList,
} = require("../controllers/followController");

// ==============================
// 🧾 Auth Routes
// ==============================
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/oauth", oauthLogin);

// ==============================
// 👤 Profile Routes
// ==============================

// ✅ Get own profile
router.get("/profile", protect, getProfile);

// ✅ Update profile (with optional avatar upload to Cloudinary)
router.put("/profile", protect, avatarUpload.single("avatar"), updateProfile);

// ✅ Get public profile by username
router.get("/profile/:username", getPublicProfile);
router.put("/profile", protect, avatarUpload.single("avatar"), updateProfile);

// ==============================
// 👥 Follow System Routes
// ==============================
router.post("/:id/follow", protect, handleFollow);
router.delete("/:id/follow", protect, handleUnfollow);
router.get("/:id/followers", getFollowersList);
router.get("/:id/following", getFollowingList);

// ==============================
// 🔧 Test Route
// ==============================
router.get("/", (req, res) => {
  res.send("User route is working!");
});

module.exports = router;
