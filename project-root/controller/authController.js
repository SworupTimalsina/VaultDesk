const User = require("../model/User");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// Register
exports.register = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const user = await User.create({ email, password, phone });
  res.status(201).json({ message: "User registered successfully" });
});

// Login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  // Check if account is locked
  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    return res.status(403).json({ message: "Account temporarily locked. Try again later." });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    user.loginAttempts += 1;

    // Lock account after 5 failed attempts
    if (user.loginAttempts >= 5) {
      user.lockedUntil = Date.now() + 15 * 60 * 1000; // lock 15 min
      await user.save();
      return res.status(403).json({ message: "Account locked for 15 minutes." });
    }

    await user.save();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Reset failed attempts
  user.loginAttempts = 0;
  user.lockedUntil = null;
  await user.save();

  // Generate token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
});
