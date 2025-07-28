const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
  forgotPassword,
  resetPassword,
} = require("../controllers/userController"); // ✅ FIXED path here

const router = express.Router();

// 🌐 Google OAuth Login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // Redirect to frontend with token in query param
    res.redirect(`http://localhost:3000/auth/callback?token=${token}`);
  }
);

// 🔐 Forgot Password – Send Reset Link
router.post("/forgot-password", forgotPassword);

// 🔐 Reset Password – Submit New Password
router.post("/reset-password", resetPassword);

module.exports = router;
