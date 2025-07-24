const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
const app = express();

//Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/authRoutes"));

//Start
connectDB();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
