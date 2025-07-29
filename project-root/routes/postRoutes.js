const express = require("express");
const router = express.Router();
const {
  createPost,
  getMyPosts,
  getAllPosts,
  deletePost,
} = require("../controller/postController");
const { authenticateToken } = require("../middleware/authMiddleware");
const uploadPostImage = require("../middleware/uploadMiddleware");

// 👤 User-specific posts
router.get("/", authenticateToken, getMyPosts);

// 🌐 Public feed: all posts from all users
router.get("/all", getAllPosts); // ✅ No auth required (optional)

// ➕ Create post
router.post("/", authenticateToken, uploadPostImage.single("image"), createPost);

// ❌ Delete post
router.delete("/:id", authenticateToken, deletePost);

module.exports = router;
