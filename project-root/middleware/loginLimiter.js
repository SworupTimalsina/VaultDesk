const loginAttempts = {};

const loginLimiter = (req, res, next) => {
  const ip = req.ip;

  if (!loginAttempts[ip]) {
    loginAttempts[ip] = { count: 1, lastAttempt: Date.now() };
  } else {
    const timePassed = Date.now() - loginAttempts[ip].lastAttempt;
    if (timePassed < 10 * 60 * 1000) {
      if (loginAttempts[ip].count >= 5) {
        return res.status(429).json({ message: "Too many login attempts. Try again later." });
      } else {
        loginAttempts[ip].count += 1;
      }
    } else {
      loginAttempts[ip] = { count: 1, lastAttempt: Date.now() };
    }
  }

  next();
};

module.exports = loginLimiter;
