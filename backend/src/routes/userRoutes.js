const express = require("express");
const router = express.Router();
const multer = require("multer");
const { protect } = require("../middleware/authMiddleware");

// Memory storage for avatar uploads
const storage = multer.memoryStorage();
const avatarUpload = multer({ storage });

const {
  registerUser,
  loginUser,
  oauthLogin,
  getProfile,
  updateProfile,
  getPublicProfileById,
  getAllUsers,
} = require("../controllers/userController");
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
// 👥 Users List (for Messages)
// ==============================
router.get("/", protect, getAllUsers);

// ==============================
// 👤 Profile Routes
// ==============================
router.get("/profile", protect, getProfile);
router.put("/profile", protect, avatarUpload.single("avatar"), updateProfile);
router.put("/profile/bio", protect, updateProfile);
router.get("/profile/:id", getPublicProfileById);

// ==============================
// 👥 Follow System Routes
// ==============================
router.post("/:id/follow", protect, handleFollow);
router.delete("/:id/follow", protect, handleUnfollow);
router.get("/:id/followers", getFollowersList);
router.get("/:id/following", getFollowingList);

module.exports = router;
