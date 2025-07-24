const express = require("express");
const router = express.Router();
const { register, login, verifyOTP } = require("../controller/authController");
const loginLimiter = require("../middleware/loginLimiter");

router.post("/register", register);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginLimiter, login);

module.exports = router;
