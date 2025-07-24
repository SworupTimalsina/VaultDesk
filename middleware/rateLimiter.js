const rateLimit = require("express-rate-limit");

//user have 10 mintues time to verify and maximum 5 attempts
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 5,
  message: "Too many login attempts. Try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = loginLimiter;
