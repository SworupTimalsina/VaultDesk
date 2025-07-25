const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, default: "user" },

  // 🔐 Security & Login
  loginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date, default: null },

  // ✅ Email Verification
  otp: { type: String },
  otpExpires: { type: Date },
  isVerified: { type: Boolean, default: false },

  // 🔁 Forgot Password Flow
  resetOTP: { type: String },
  resetOTPExpiry: { type: Date },
  isResetVerified: { type: Boolean, default: false },
});

// 🔒 Hash password before saving if modified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔐 Compare raw password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
