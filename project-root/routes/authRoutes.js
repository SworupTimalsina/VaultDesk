const express = require("express");
const router = express.Router();
const { register, login } = require("../controller/authController");
const loginLimiter = require("../middleware/rateLimiter");

router.post("/register", register);
router.post("/login", loginLimiter, login);

module.exports = router;
