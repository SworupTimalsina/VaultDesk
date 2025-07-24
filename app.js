require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/authRoutes"));

// DB + Server
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
