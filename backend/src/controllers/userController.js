const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");
const {
  createUser,
  getUserByEmail,
  getUserById,
  updateUserProfile,
  findUserByEmail,
  createOAuthUser,
  getUserByUsernameWithPosts, // still available if you need it elsewhere
} = require("../models/userModel");
const { getPostsByUserId } = require("../models/postModel");
const generateToken = require("../utils/generateToken");

// =============================
// 🧾 Register New User
// =============================
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
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// =============================
// 🔐 Login
// =============================
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
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// =============================
// 🔑 OAuth Login or Register
// =============================
async function oauthLogin(req, res) {
  const { email, username, avatar, provider } = req.body;
  if (!email || !username || !provider)
    return res.status(400).json({ message: "Missing required fields" });

  try {
    let user = await findUserByEmail(email);
    if (!user) {
      user = await createOAuthUser({ email, username, avatar, provider });
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

// =============================
// 👤 Get Current Profile (with posts)
// =============================
async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await getPostsByUserId(user.id);
    res.json({ user, posts });
  } catch (err) {
    console.error("Get Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// =============================
// 📄 Public Profile by ID
// =============================
async function getPublicProfileById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await getUserById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await getPostsByUserId(id);
    res.json({ user, posts });
  } catch (err) {
    console.error("Get Public Profile by ID Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// =============================
// ✏️ Update Profile
// =============================
const updateProfile = async (req, res) => {
  try {
    const { username, bio } = req.body;

    let avatarUrl;
    if (req.file && req.file.buffer) {
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "avatars", resource_type: "image" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });
      const uploadResult = await streamUpload(req.file.buffer);
      avatarUrl = uploadResult.secure_url;
    }

    const updatedUser = await updateUserProfile(req.user.id, {
      username: username || null,
      bio: bio || null,
      avatar: avatarUrl || null,
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update Profile Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  oauthLogin,
  getProfile,
  updateProfile,
  getPublicProfileById,
};
