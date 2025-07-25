const User = require("../model/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const { sendOTP } = require("../utils/mailer");

// ✅ Register and Send OTP
exports.register = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;

  if (!email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ message: "Email already registered" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password,
    phone,
    otp,
    otpExpires,
    isVerified: false,
  });

  await sendOTP(email, otp);

  res.status(201).json({ message: "OTP sent to your email" });
});

// ✅ Verify OTP
exports.verifyOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid email" });

  if (user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

// ✅ Login (only if verified)
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  console.log("Incoming login:", email, password);

  const user = await User.findOne({ email });
  if (!user) {
    console.log("User not found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  if (!user.isVerified) {
    console.log("Email not verified");
    return res.status(401).json({ message: "Please verify your email first." });
  }

  if (user.lockedUntil && user.lockedUntil > Date.now()) {
    console.log("Account is locked");
    return res.status(403).json({ message: "Account temporarily locked." });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    console.log("Wrong password");
    user.loginAttempts += 1;
    if (user.loginAttempts >= 5) {
      user.lockedUntil = Date.now() + 15 * 60 * 1000;
      await user.save();
      return res.status(403).json({ message: "Account locked for 15 minutes." });
    }
    await user.save();
    return res.status(401).json({ message: "Invalid credentials" });
  }

  console.log("Login successful");

  // Clear lock info
  user.loginAttempts = 0;
  user.lockedUntil = null;
  await user.save();

  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
});

// 🔁 Forgot Password - Step 1: Send OTP
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetOTP = otp;
  user.resetOTPExpiry = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOTP(email, otp, "Reset Your VaultDesk Password");
  res.status(200).json({ message: "Reset OTP sent to email" });
});

// 🔁 Step 2: Verify Reset OTP
exports.verifyResetOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.resetOTP !== otp ||
    user.resetOTPExpiry < Date.now()
  ) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.resetOTP = undefined;
  user.resetOTPExpiry = undefined;
  user.isResetVerified = true;
  await user.save();

  res.status(200).json({ message: "OTP verified. You may now reset password." });
});

// 🔁 Step 3: Reset Password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.isResetVerified) {
    return res.status(400).json({ message: "OTP verification required." });
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.isResetVerified = false;
  await user.save();

  res.status(200).json({ message: "Password reset successfully" });
});
