const mongoose = require("mongoose");

const cropSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
    price: Number,
    quantity: Number,
    location: String,
    image: String,

    // 🚨 IMPORTANT
    isContractCrop: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Crop", cropSchema);