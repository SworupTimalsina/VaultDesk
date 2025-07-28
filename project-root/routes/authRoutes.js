const express = require("express");
const router = express.Router();
const {
  register,
  login,
  verifyOTP,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} = require("../controller/authController");
const loginLimiter = require("../middleware/loginLimiter");
const upload = require("../middleware/uploadMiddleware"); // ✅ Multer config

// 🔐 AUTH ROUTES
router.post("/register", upload.single("profileImage"), register); // ✅ FIXED
router.post("/verify-otp", verifyOTP);
router.post("/login", loginLimiter, login);

// 🔁 FORGOT PASSWORD FLOW
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOTP);
router.post("/reset-password", resetPassword);

module.exports = router;
