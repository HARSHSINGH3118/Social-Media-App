const { createPost, getAllPosts } = require("../models/postModel");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const extractMentions = require("../utils/parseMentions");
const { getUserByUsername } = require("../models/userModel");
const { createNotification } = require("../models/notificationModel");

const extractHashtags = require("../utils/parseHashtags");
const { addTagsToPost } = require("../models/tagModel");

// @desc    Create a new post with optional image, hashtags, mentions
// @route   POST /api/posts
async function handleCreatePost(req, res) {
  const { content } = req.body;
  const user_id = req.user.id;

  if (!content) {
    return res.status(400).json({ message: "Content is required" });
  }

  let image_url = null;

  try {
    // 🌩️ Upload image if present
    if (req.file) {
      const streamUpload = () =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream((err, result) => {
            if (result) resolve(result);
            else reject(err);
          });
          streamifier.createReadStream(req.file.buffer).pipe(stream);
        });

      const result = await streamUpload();
      image_url = result.secure_url;
    }

    // 📝 Create the post
    const post = await createPost({ user_id, content, image_url });

    // 🏷️ Extract and store hashtags
    const hashtags = extractHashtags(content);
    if (hashtags.length > 0) {
      await addTagsToPost(post.id, hashtags);
    }

    // 🙋 Extract mentions and send notifications
    const mentions = extractMentions(content);
    for (const username of mentions) {
      const mentionedUser = await getUserByUsername(username);
      if (mentionedUser && mentionedUser.id !== user_id) {
        await createNotification({
          user_id: mentionedUser.id,
          sender_id: user_id,
          post_id: post.id,
          type: "mention",
        });
      }
    }

    res.status(201).json(post);
  } catch (err) {
    console.error("Create Post Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// @desc    Get all posts
// @route   GET /api/posts
async function handleGetAllPosts(req, res) {
  try {
    const posts = await getAllPosts();
    res.status(200).json(posts);
  } catch (err) {
    console.error("Get Posts Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  handleCreatePost,
  handleGetAllPosts,
};
