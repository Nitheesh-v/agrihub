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
  totalAmount: Number,     // crop value (fixed)
  fundedAmount: Number,    // stage investments
  finalPayable: Number,    // calculated ONLY at end
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
    type: { type: String }, // "advance", "installment", "stage"
    amount: Number,
    date: { type: Date, default: Date.now }
  }
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

    readyForSale: {
  type: Boolean,
  default: false,
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