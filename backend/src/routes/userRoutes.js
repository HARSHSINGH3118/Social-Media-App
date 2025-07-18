const express = require("express");
const router = express.Router();
const { oauthLogin } = require("../controllers/userController");
router.post("/oauth", oauthLogin);

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const {
  handleFollow,
  handleUnfollow,
  getFollowersList,
  getFollowingList,
} = require("../controllers/followController");

const { protect } = require("../middleware/authMiddleware");

// 🧾 Auth
router.post("/register", registerUser);
router.post("/login", loginUser);

// 👤 Profile
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);

// 👥 Follow System
router.post("/:id/follow", protect, handleFollow);
router.delete("/:id/follow", protect, handleUnfollow);
router.get("/:id/followers", getFollowersList);
router.get("/:id/following", getFollowingList);

// 🔧 Test
router.get("/", (req, res) => {
  res.send("User route is working!");
});

module.exports = router;
