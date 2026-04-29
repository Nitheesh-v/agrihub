const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
} = require("../controllers/orderController");

// ✅ CREATE ORDER
router.post("/", protect, createOrder);

// ✅ GET USER ORDERS
router.get("/my", protect, getOrders);

module.exports = router;