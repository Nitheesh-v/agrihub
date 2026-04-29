const express = require("express");
const router = express.Router();

const { uploadVerification, verifyUser } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const upload = require("../middlewares/upload");

// 👤 User uploads document
router.post(
  "/verify",
  authMiddleware,
  upload.single("document"),
  uploadVerification
);

// 🛡️ Admin verifies user
router.put(
  "/verify-user",
  authMiddleware,
  verifyUser
);

module.exports = router;