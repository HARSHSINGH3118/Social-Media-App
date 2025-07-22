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
  getPublicProfileById, // ✅ new
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
// Get own profile
router.get("/profile", protect, getProfile);

// Update profile (avatar or bio)
router.put("/profile", protect, avatarUpload.single("avatar"), updateProfile);
router.put("/profile/bio", protect, updateProfile);

// Public profile by numeric ID
router.get("/profile/:id", getPublicProfileById);

// ==============================
// 👥 Follow System Routes
// ==============================
router.post("/:id/follow", protect, handleFollow);
router.delete("/:id/follow", protect, handleUnfollow);
router.get("/:id/followers", getFollowersList);
router.get("/:id/following", getFollowingList);

// 🔧 Test Route
router.get("/", (req, res) => {
  res.send("User route is working!");
});

module.exports = router;
