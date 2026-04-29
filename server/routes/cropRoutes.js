const express = require("express");
const router = express.Router();

const {
  createCrop,
  getCrops,
  getMyCrops,
} = require("../controllers/cropController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// 👨‍🌾 Add crop
router.post("/", protect, authorizeRoles("farmer"), createCrop);

// 🌍 Public marketplace
router.get("/", getCrops);

// 👨‍🌾 My crops
router.get("/my", protect, authorizeRoles("farmer"), getMyCrops);

module.exports = router;