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

// 🔐 AUTH ROUTES
router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginLimiter, login);

// 🔁 FORGOT PASSWORD FLOW
router.post("/forgot-password", forgotPassword);        // Step 1: Send OTP to email
router.post("/verify-reset-otp", verifyResetOTP);       // Step 2: Verify the OTP
router.post("/reset-password", resetPassword);          // Step 3: Update password

module.exports = router;
