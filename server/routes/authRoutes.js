const express = require("express");
const router = express.Router();

const {
  register,
  login,
  submitVerification,
  verifyUser,
  getAllUsers,
} = require("../controllers/authController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Public
router.post("/register", register);
router.post("/login", login);

// User verification
router.post("/verify", protect, submitVerification);

// Admin verify user
router.put("/verify-user", protect, authorizeRoles("admin"), verifyUser);

// Admin get users
router.get("/users", protect, authorizeRoles("admin"), getAllUsers);

module.exports = router;