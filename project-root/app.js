const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const path = require("path");
const fs = require('fs');
const https = require('https');


const app = express();

connectDB();


app.use(cors({ origin: "https://localhost:5175", credentials: true }));
app.use(express.json());


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/payment", require("./routes/paymentRoutes"));



const PORT = process.env.PORT || 3000;

const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, process.env.SSL_KEY_PATH || '../sslcert/server.key')),
  cert: fs.readFileSync(path.join(__dirname, process.env.SSL_CERT_PATH || '../sslcert/server.crt')),
};

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`🔒 HTTPS Server running at https://localhost:${PORT}`);
});
