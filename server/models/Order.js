const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        crop: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Crop",
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    // 🔥 ADD THIS
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered"],
      default: "paid",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);