const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
console.log("✅ EMAIL_USER:", process.env.EMAIL_USER);
console.log("✅ EMAIL_PASS:", process.env.EMAIL_PASS ? "✅ PRESENT" : "❌ MISSING");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const path = require("path");


const app = express();

// ✅ Connect MongoDB
connectDB();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5175", credentials: true }));
app.use(express.json());

// ✅ Serve profile images from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
