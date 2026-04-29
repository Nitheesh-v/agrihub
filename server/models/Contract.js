const mongoose = require("mongoose");

const contractSchema = new mongoose.Schema(
  {
    // 👤 Company who created contract
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // 🌾 Crop Details
    cropName: {
      type: String,
      required: true,
    },
    quantity: Number,
    price: Number,
    location: String,
location: {
  type: String,
  required: true,
},
    // 👨‍🌾 Farmers applied
    applicants: [
      {
        farmer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
      },
    ],

    // 📊 Contract Status
    status: {
      type: String,
      enum: [
        "open",
        "pending",
        "approved",
        "active",
        "completed",
        "failed",
      ],
      default: "open",
    },

    // 💰 Payment Details
  payment: {
  totalAmount: Number,
  advancePaid: { type: Number, default: 0 },
  remainingAmount: Number,
  isAdvancePaid: { type: Boolean, default: false },
},

    // 📅 Scheduled Payments
   paymentSchedule: [
  {
    stage: {
      type: String,
      enum: ["sowing", "growth", "harvest"],
    },
    amount: Number,
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    dueDate: Date,
  },
],

    paymentHistory: [
  {
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["advance", "installment", "final"],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
],

    // ⚖️ Risk Sharing
    riskSharing: {
      enabled: Boolean,
      farmerPercentage: Number,
      companyPercentage: Number,
    },

    // 🌧️ Insurance
    insurance: {
      provider: String,
      coverageAmount: Number,
      status: String,
    },

    // 📜 Agreement
   agreement: {
  text: String,
  isSigned: {
    type: Boolean,
    default: false,
  },
  farmerSigned: {
    type: Boolean,
    default: false,
  },
  companySigned: {
    type: Boolean,
    default: false,
  },
  signedAt: Date,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contract", contractSchema);