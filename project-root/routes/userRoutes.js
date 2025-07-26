const express = require("express");
const router = express.Router();

const { updateProfile, getUserById } = require("../controller/userController");
const { authenticateToken } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Update user profile (with image upload)
router.put("/update", authenticateToken, upload.single("profileImage"), updateProfile);

// Get user profile by ID
router.get("/:id", authenticateToken, getUserById);

module.exports = router;
