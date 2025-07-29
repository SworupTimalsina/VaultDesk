const Post = require("../model/Post");
const asyncHandler = require("express-async-handler");

// ➕ Create a post with optional image
exports.createPost = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { text } = req.body;
  const image = req.file?.filename;

  if (!text || !text.trim()) {
    return res.status(400).json({ message: "Post text is required." });
  }

  const post = await Post.create({
    user: userId,
    text: text.trim(),
    image: image || null,
  });

  res.status(201).json({ message: "Post created", post });
});

// 📄 Get all posts by current user
exports.getMyPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user.userId }).sort({ createdAt: -1 });
  res.status(200).json(posts);
});

// 🆕 📢 Get all posts from all users (public feed)
exports.getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .populate("user", "name profileImage"); // optional: show user name + image

  res.status(200).json(posts);
});

// ❌ Delete post
exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id, user: req.user.userId });
  if (!post) return res.status(404).json({ message: "Post not found or unauthorized" });

  await post.deleteOne();
  res.status(200).json({ message: "Post deleted" });
});
