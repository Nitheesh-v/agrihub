const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

router.get(
  "/buyer",
  protect,
  authorizeRoles("buyer"),
  (req, res) => {
    res.json({ message: "Buyer route accessed" });
  }
);

module.exports = router;