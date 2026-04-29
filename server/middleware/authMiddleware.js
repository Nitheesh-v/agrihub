const jwt = require("jsonwebtoken");
const User = require("../models/User");

// 🔐 AUTH + BLOCK UNVERIFIED (FINAL FIX)
exports.protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;

    // ✅ Allow admin ALWAYS
    if (user.role === "admin") {
      return next();
    }

    // ✅ Allow verify route
    if (req.originalUrl.includes("/api/auth/verify")) {
      return next();
    }

    // 🔥 Block unverified users
    if (!user.isVerified) {
      return res.status(403).json({
        message: "Account not verified. Please verify first.",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// 🔐 ROLE CHECK
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }

    next();
  };
};