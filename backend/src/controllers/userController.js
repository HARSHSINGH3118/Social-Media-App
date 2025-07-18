const bcrypt = require("bcryptjs");
const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  findUserByEmail,
  createOAuthUser,
} = require("../models/userModel");
const generateToken = require("../utils/generateToken");

// @desc    Register new user
// @route   POST /api/users/register
async function registerUser(req, res) {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const existingUser = await getUserByEmail(email);
    if (existingUser)
      return res.status(409).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Login user
// @route   POST /api/users/login
async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const user = await getUserByEmail(email);
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    OAuth Login / Signup
// @route   POST /api/users/oauth
async function oauthLogin(req, res) {
  const { email, username, avatar, provider } = req.body;

  if (!email || !username || !provider)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    let user = await findUserByEmail(email);

    if (!user) {
      user = await createOAuthUser({
        email,
        username,
        avatar,
        provider,
      });
    }

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      provider: user.provider,
      token: generateToken(user.id),
    });
  } catch (err) {
    console.error("OAuth Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
async function updateProfile(req, res) {
  try {
    const { username, bio, avatar } = req.body;
    const updatedUser = await updateUserProfile(req.user.id, {
      username,
      bio,
      avatar,
    });
    res.json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerUser,
  loginUser,
  oauthLogin,
  getProfile,
  updateProfile,
};
