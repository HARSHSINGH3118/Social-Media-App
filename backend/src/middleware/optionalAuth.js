const jwt = require("jsonwebtoken");

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return next(); // No token, proceed unauthenticated

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    // Invalid token, ignore and proceed unauthenticated
  }

  next();
}

module.exports = optionalAuth;
