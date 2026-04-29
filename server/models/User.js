const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["farmer", "buyer", "company", "admin"],
      default: "farmer",
    },

    // 🔥 SIMPLE FLAG (IMPORTANT)
    isVerified: {
      type: Boolean,
      default: false,
    },

    // 📄 Verification details
    verification: {
      status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
      },
      documentUrl: String,
    },
    companyDetails: {
  companyName: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
}
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);