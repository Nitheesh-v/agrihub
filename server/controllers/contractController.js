const Contract = require("../models/Contract");

const generateAgreement = require("../utils/generateAgreement");

const PDFDocument = require("pdfkit");

const Razorpay = require("razorpay");
const crypto = require("crypto");


// 🏢 Company creates contract
exports.createContract = async (req, res) => {
  try {
    const {
      cropName,
      quantity,
      price,
      advancePaid,
      location,
      riskSharing,
      insurance,
    } = req.body;

    // ✅ Calculate total
    const totalAmount = price * quantity;

    // 🎯 CREATE SCHEDULE HERE (OUTSIDE)
    const schedule = [
      {
        stage: "sowing",
        amount: Math.round(totalAmount * 0.2),
        status: "pending",
        dueDate: new Date(),
      },
      {
        stage: "growth",
        amount: Math.round(totalAmount * 0.3),
        status: "pending",
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
      {
        stage: "harvest",
        amount: Math.round(totalAmount * 0.5),
        status: "pending",
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];

    const contract = await Contract.create({
      company: req.user._id,
      cropName,
      quantity,
      price,
      location,

      riskSharing: {
        enabled: riskSharing?.enabled || false,
        farmerPercentage: riskSharing?.farmerPercentage || 0,
        companyPercentage: riskSharing?.companyPercentage || 0,
      },

      insurance: {
        provider: insurance?.provider || "",
        coverageAmount: insurance?.coverageAmount || 0,
        status: insurance?.status || "Not Active",
      },

    payment: {
  totalAmount,
  advancePaid: advancePaid || 0, // funding
  finalPayable: totalAmount, // will deduct later
  isAdvancePaid: (advancePaid || 0) > 0,
},

      // ✅ NOW WORKS
      paymentSchedule: schedule,

      applicants: [],
    });

    if (req.user.verification?.status !== "verified") {
      return res.status(403).json({
        message: "Please verify your account first",
      });
    }

    res.status(201).json(contract);
  } catch (error) {
    console.error("Create Contract Error:", error);
    res.status(500).json({ message: error.message });
  }
};
// 👨‍🌾 Farmer views contracts
exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ status: "open" })
      .populate("company", "name email companyDetails") // ✅ ADD THIS
      .populate("applicants.farmer", "name"); // optional but useful

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👨‍🌾 Farmer applies (FINAL CORRECT VERSION)
exports.applyContract = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // ✅ Check already applied
    const alreadyApplied = contract.applicants.find(
      (a) => a.farmer.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this contract",
      });
    }

    // ✅ Add new applicant
    contract.applicants.push({
      farmer: req.user._id,
      status: "pending",
    });

    // ✅ Update contract status
   

    await contract.save();
if (req.user.verification?.status !== "verified") {
  return res.status(403).json({
    message: "Please verify your account first",
  });
}
    res.json({ message: "Applied successfully" });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 🏢 Company view own contracts
exports.getCompanyContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({
      company: req.user.id,
    })
      .populate("company", "name email companyDetails") // ✅ ADD THIS
      .populate("applicants.farmer", "name email");

    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// 🏢 Company approves farmer


exports.approveFarmer = async (req, res) => {
  try {
    const { contractId, farmerId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const applicant = contract.applicants.find(
      (a) => a.farmer.toString() === farmerId
    );

    if (!applicant) {
      return res.status(404).json({ message: "Farmer not applied" });
    }

    // ✅ Approve selected farmer
    applicant.status = "approved";

    // ❌ Reject others
    contract.applicants.forEach((a) => {
      if (a.farmer.toString() !== farmerId) {
        a.status = "rejected";
      }
    });

    // ✅ Update contract
    contract.status = "approved";

    // 🔥 FIXED AGREEMENT
    contract.agreement = {
      text: generateAgreement(contract, applicant.farmer),
      isSigned: false,
      createdAt: new Date(),
    };

    await contract.save();

    res.json({ message: "Farmer approved" });
  } catch (error) {
    console.error("Approve Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// 👨‍🌾 Farmer → My contracts
// exports.getContracts = async (req, res) => {
//   try {
//     const contracts = await Contract.find()
//       .populate("company", "name")
//       .populate("applicants.farmer", "name");

//     res.json(contracts);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getFarmerContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({
      "applicants.farmer": req.user._id,
    })
      .populate("company", "name email companyDetails") // ✅ UPDATED
      .populate("applicants.farmer", "name");

    res.json(contracts);
  } catch (error) {
    console.error("Farmer Contracts Error:", error);
    res.status(500).json({ message: error.message });
  }
};


exports.signAgreement = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId)
      .populate("company", "name email")
      .populate("applicants.farmer", "name");

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const userId = req.user._id.toString();

    // ✅ Check if company
    if (contract.company._id.toString() === userId) {
      contract.agreement.companySigned = true;
    }

    // ✅ Check if farmer
    const approvedFarmer = contract.applicants.find(
      (a) =>
        a.farmer &&
        a.farmer._id.toString() === userId &&
        a.status === "approved"
    );

    if (approvedFarmer) {
      contract.agreement.farmerSigned = true;
    }

    // ✅ Final Agreement Status
    if (
      contract.agreement.farmerSigned &&
      contract.agreement.companySigned
    ) {
      contract.agreement.isSigned = true;
      contract.status = "active";
    }

    await contract.save();

    res.json({ message: "Agreement signed successfully" });
  } catch (error) {
    console.error("Sign Error:", error);
    res.status(500).json({ message: error.message });
  }
};


// exports.payAdvance = async (req, res) => {
//   try {
//     const { contractId, amount } = req.body;

//     const contract = await Contract.findById(contractId);

//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     // ✅ Update payment
//    contract.payment.advancePaid += Number(amount);
// contract.payment.remainingAmount -= Number(amount);

// contract.paymentHistory.push({
//   amount: Number(amount),
//   type: "advance",
// });
//     if (contract.payment.advancePaid > 0) {
//       contract.payment.isAdvancePaid = true;
//     }

//     await contract.save();

//     res.json({ message: "Advance paid successfully", contract });
//   } catch (error) {
//     console.error("Advance Payment Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

exports.payInstallment = async (req, res) => {
  try {
    const { contractId, amount } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const payAmount = Number(amount);

    if (payAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (payAmount > contract.payment.remainingAmount) {
      return res.status(400).json({ message: "Amount exceeds remaining" });
    }

    contract.payment.remainingAmount -= payAmount;

    contract.paymentHistory.push({
      amount: payAmount,
      type: "installment",
    });

    // ✅ AUTO COMPLETE
    if (contract.payment.remainingAmount <= 0) {
      contract.payment.remainingAmount = 0;
      contract.status = "completed"; // 🔥 IMPORTANT
    }

    await contract.save();

    res.json({ message: "Installment paid", contract });
  } catch (error) {
    console.error("Installment Error:", error);
    res.status(500).json({ message: error.message });
  }
};




exports.downloadAgreement = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate("company", "name email")
      .populate("applicants.farmer", "name email");

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // ✅ Get approved farmers
    const approvedFarmers = contract.applicants.filter(
      (a) => a.status === "approved"
    );

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=agreement.pdf"
    );

    doc.pipe(res);

    // ===== PDF CONTENT =====
    doc.fontSize(18).text("Contract Agreement", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).text(`Crop: ${contract.cropName}`);
    doc.text(`Quantity: ${contract.quantity}`);
doc.text(`Price: Rs. ${contract.price}`);
    doc.text(`Location: ${contract.location}`);
    doc.moveDown();

    doc.text(`Company: ${contract.company?.name}`);
    doc.text(`Email: ${contract.company?.email}`);
    doc.moveDown();

    doc.text("Approved Farmers:");
    if (approvedFarmers.length === 0) {
      doc.text("No farmers approved yet");
    } else {
      approvedFarmers.forEach((a, index) => {
        doc.text(`${index + 1}. ${a.farmer?.name}`);
      });
    }

    doc.moveDown();

    doc.text(`Advance Paid: Rs. ${contract.payment?.advancePaid || 0}`);
    

    doc.moveDown();
    doc.text(`Status: Signed Agreement`);
    doc.text(`Date: ${new Date().toLocaleDateString()}`);


    doc.moveDown();
doc.moveDown();
doc.text("Crop Insurance:");

if (contract.insurance?.provider) {
  console.log(contract.insurance?.provider)
  doc.text(`Provider: ${contract.insurance.provider}`);
  doc.text(`Coverage: Rs. ${contract.insurance.coverageAmount}`);
  doc.text(`Status: ${contract.insurance.status}`);
} else {
  doc.text("No Insurance");
}



doc.text("Risk Sharing:");

if (contract.riskSharing?.enabled) {
  doc.text(`Farmer: ${contract.riskSharing.farmerPercentage}%`);
  doc.text(`Company: ${contract.riskSharing.companyPercentage}%`);
} else {
  doc.text("Not Enabled");
}
doc.moveDown();
doc.text("Signatures:");

// 👨‍🌾 Farmer Name
const farmerName =
  contract.applicants?.[0]?.farmer?.name || "N/A";

// 🏢 Company Name
const companyName = contract.company?.name || "N/A";

doc.text(`Farmer Signed: ${contract.agreement?.farmerSigned ? "Yes" : "No"}`);
doc.text(`Company Signed: ${contract.agreement?.companySigned ? "Yes" : "No"}`);

doc.moveDown();

// ✅ Replace dashed lines with names
doc.text(`Farmer: ${farmerName}`);
doc.text(`Company: ${companyName}`);

doc.moveDown();
doc.text(
  `Final Agreement: ${
    contract.agreement?.isSigned ? "Completed" : "Pending"
  }`
);
doc.text(`Farmer Signature: ${farmerName}`);
doc.text(`Company Signature: ${companyName}`);
doc.end()

}catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ message: error.message });
  }
}




const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

exports.payAdvance = async (req, res) => {
  try {
    const { contractId, amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });
console.log("KEY:", process.env.RAZORPAY_KEY_ID);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};






exports.verifyPayment = async (req, res) => {
  try {
    const {
      contractId,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    console.log("VERIFY HIT:", req.body);

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");
if (contract.payment.remainingAmount <= 0) {
  return res.status(400).json({ message: "Already fully paid" });
}
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const payAmount = Number(amount);

    // ❌ Prevent overpayment
    if (payAmount > contract.payment.remainingAmount) {
      return res.status(400).json({ message: "Amount exceeds remaining" });
    }

    // ✅ UPDATE PAYMENT
    contract.payment.advancePaid += payAmount;
  // ✅ UPDATE FUNDING ONLY
contract.payment.advancePaid += payAmount;

contract.paymentHistory.push({
  amount: payAmount,
  type: "advance",
});

contract.payment.isAdvancePaid = true;

    // ✅ HISTORY
    contract.paymentHistory.push({
      amount: payAmount,
      type: "advance",
    });

    contract.payment.isAdvancePaid = true;

    // ✅ AUTO COMPLETE
    if (contract.payment.remainingAmount <= 0) {
      contract.payment.remainingAmount = 0;
      contract.status = "completed"; // 🔥 IMPORTANT
    }

    await contract.save();

    res.json({ message: "Payment successful", contract });
  } catch (err) {
    console.error("VERIFY ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};



exports.createInstallmentOrder = async (req, res) => {
  try {
    const { contractId, amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.completeContract = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // ✅ FINAL CALCULATION
    const total = contract.payment.totalAmount;
    const advance = contract.payment.advancePaid || 0;

    const finalPayable = total - advance;

    contract.payment.finalPayable = finalPayable;

    contract.paymentHistory.push({
      amount: finalPayable,
      type: "final",
    });

    contract.status = "completed";

    await contract.save();

    res.json({
      message: "Contract completed successfully",
      finalSettlement: {
        totalAmount: total,
        advancePaid: advance,
        finalPaidToFarmer: finalPayable,
      },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.verifyInstallmentPayment = async (req, res) => {
  try {
    const {
      contractId,
      amount,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const payAmount = Number(amount);

    // ❌ Prevent invalid
    if (payAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // ❌ Prevent overpayment
    if (payAmount > contract.payment.remainingAmount) {
      return res.status(400).json({ message: "Amount exceeds remaining" });
    }

    // ✅ UPDATE ONLY REMAINING
    contract.payment.remainingAmount -= payAmount;

    // ✅ HISTORY
    contract.paymentHistory.push({
      amount: payAmount,
      type: "installment",
    });

    // ✅ AUTO COMPLETE
    if (contract.payment.remainingAmount <= 0) {
      contract.payment.remainingAmount = 0;
      contract.status = "completed";
    }

    await contract.save();

    res.json({ message: "Installment paid ✅", contract });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createStagePaymentOrder = async (req, res) => {
  try {
    const { contractId, stage } = req.body;

    const contract = await Contract.findById(contractId);

    const stageData = contract.paymentSchedule.find(
      (s) => s.stage === stage
    );

    if (!stageData) {
      return res.status(404).json({ message: "Stage not found" });
    }

    if (stageData.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    const order = await razorpay.orders.create({
      amount: stageData.amount * 100,
      currency: "INR",
    });

    res.json({ order, stage });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.verifyStagePayment = async (req, res) => {
  try {
    const {
      contractId,
      stage,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment" });
    }

    const contract = await Contract.findById(contractId);

    const stageData = contract.paymentSchedule.find(
      (s) => s.stage === stage
    );

    stageData.status = "paid";

    contract.paymentHistory.push({
      amount: stageData.amount,
      type: "installment",
    });

    contract.payment.remainingAmount -= stageData.amount;

    // ✅ AUTO COMPLETE CONTRACT
    const allPaid = contract.paymentSchedule.every(
      (s) => s.status === "paid"
    );

    if (allPaid) {
      contract.status = "completed";
    }

    await contract.save();

    res.json({ message: "Stage payment successful ✅" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCompanyDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user.role !== "company") {
      return res.status(403).json({ message: "Only company allowed" });
    }

    user.companyDetails = req.body;

    await user.save();

    res.json({ message: "Company details updated", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};