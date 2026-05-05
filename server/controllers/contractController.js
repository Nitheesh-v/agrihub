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
      location,
      paymentSchedule,
    } = req.body;

    if (!paymentSchedule || !Array.isArray(paymentSchedule)) {
      return res.status(400).json({ message: "Invalid payment schedule" });
    }

    const cropValue = Number(price) * Number(quantity);

    const contract = await Contract.create({
      company: req.user._id,
      cropName,
      quantity,
      price,
      location,

      payment: {
        totalAmount: cropValue,

        fundedAmount: 0,

        // ✅ FIXED
        finalPayable: cropValue,
        remainingAmount: cropValue,
      },

      paymentSchedule: paymentSchedule.map((s) => ({
        stage: s.stage.toLowerCase(),
        amount: Number(s.amount),
        status: "pending",
      })),

      paymentHistory: [],
      applicants: [],
      status: "open",
    });

    res.status(201).json(contract);

  } catch (err) {
    console.error("🔥 CREATE CONTRACT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};
// 👨‍🌾 Farmer views contracts
exports.getContracts = async (req, res) => {
  try {
    const contracts = await Contract.find({ status: "open" })
      .populate("company", "name email companyDetails") // ✅ ADD THIS
      .populate("applicants.farmer", "name"); // optional but useful

    res.json(contracts);
    console.log("Contracts found:", contracts.length);
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

    // ✅ check verification FIRST
    if (req.user.verification?.status !== "verified") {
      return res.status(403).json({
        message: "Please verify your account first",
      });
    }

    // ✅ already applied check
    const alreadyApplied = contract.applicants.find(
      (a) => a.farmer.toString() === req.user._id.toString()
    );

    if (alreadyApplied) {
      return res.status(400).json({
        message: "You already applied for this contract",
      });
    }

    // ✅ push
    contract.applicants.push({
      farmer: req.user._id,
      status: "pending",
    });

    await contract.save();

    res.json({ message: "Applied successfully" });
  } catch (error) {
    console.error("Apply Error:", error);
    res.status(500).json({ message: error.message });
  }
};

exports.payStage = async (req, res) => {
  try {
    const { contractId, stageName } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const stage = contract.paymentSchedule.find((s) => s.stage === stageName);

    if (!stage) {
      return res.status(404).json({ message: "Stage not found" });
    }

    if (stage.status === "paid") {
      return res.status(400).json({ message: "Stage already paid" });
    }

    // ✅ Mark stage as paid
    stage.status = "paid";

    // ✅ Add funded amount
    contract.payment.fundedAmount += stage.amount;

    // 🔥 Deduction logic
    contract.payment.finalPayable =
      contract.payment.totalAmount - contract.payment.fundedAmount;

    contract.payment.remainingAmount = contract.payment.finalPayable;

    // ✅ Save history
    contract.paymentHistory.push({
      type: stageName,
      amount: stage.amount,
      date: new Date(),
    });

    await contract.save();

    res.json({
      message: `${stageName} funding successful`,
      fundedAmount: contract.payment.fundedAmount,
      finalPayable: contract.payment.finalPayable,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// exports.finalPayment = async (req, res) => {
//   try {
//     const { contractId } = req.body;

//     const contract = await Contract.findById(contractId);

//     if (!contract) {
//       return res.status(404).json({ message: "Contract not found" });
//     }

//     const amountToPay = contract.payment.finalPayable;

//     if (amountToPay <= 0) {
//       return res.status(400).json({
//         message: "Nothing left to pay",
//       });
//     }

//     // ✅ Mark contract completed
//     contract.payment.remainingAmount = 0;
//     contract.status = "completed";

//     contract.paymentHistory.push({
//       type: "final",
//       amount: amountToPay,
//       date: new Date(),
//     });

//     await contract.save();

//     res.json({
//       message: "Final payment completed",
//       paid: amountToPay,
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

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
      (a) => a.farmer.toString() === farmerId,
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
        a.status === "approved",
    );

    if (approvedFarmer) {
      contract.agreement.farmerSigned = true;
    }

    // ✅ Final Agreement Status
    if (contract.agreement.farmerSigned && contract.agreement.companySigned) {
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
      (a) => a.status === "approved",
    );

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=agreement.pdf");

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
      console.log(contract.insurance?.provider);
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
    const farmerName = contract.applicants?.[0]?.farmer?.name || "N/A";

    // 🏢 Company Name
    const companyName = contract.company?.name || "N/A";

    doc.text(
      `Farmer Signed: ${contract.agreement?.farmerSigned ? "Yes" : "No"}`,
    );
    doc.text(
      `Company Signed: ${contract.agreement?.companySigned ? "Yes" : "No"}`,
    );

    doc.moveDown();

    // ✅ Replace dashed lines with names
    doc.text(`Farmer: ${farmerName}`);
    doc.text(`Company: ${companyName}`);

    doc.moveDown();
    doc.text(
      `Final Agreement: ${
        contract.agreement?.isSigned ? "Completed" : "Pending"
      }`,
    );
    doc.text(`Farmer Signature: ${farmerName}`);
    doc.text(`Company Signature: ${companyName}`);
    doc.end();
  } catch (error) {
    console.error("PDF ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

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

    const contract = await Contract.findById(contractId);
    if (contract.payment.remainingAmount <= 0) {
      return res.status(400).json({ message: "Already fully paid" });
    }
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

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

    if (!contractId || !stage) {
      return res.status(400).json({
        message: "contractId and stage are required",
      });
    }

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const stageData = contract.paymentSchedule.find(
      (s) =>
        s.stage &&
        stage &&
        s.stage.toLowerCase() === stage.toLowerCase()
    );

    if (!stageData) {
      return res.status(404).json({
        message: "Stage not found",
        available: contract.paymentSchedule.map((s) => s.stage),
      });
    }

    if (stageData.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    const order = await razorpay.orders.create({
      amount: stageData.amount * 100,
      currency: "INR",
    });

    res.json({ order, stage: stageData.stage });

  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.verifyStagePayment = async (req, res) => {
  try {
    const {
      contractId,
      stage,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!contractId || !stage) {
      return res.status(400).json({ message: "Missing data" });
    }

    const contract = await Contract.findById(contractId);
    if (!contract) return res.status(404).json({ message: "Not found" });

    // 🔐 verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // ✅ find stage
    const stageData = contract.paymentSchedule.find(
      (s) => s.stage.toLowerCase() === stage.toLowerCase()
    );

    if (!stageData) {
      return res.status(400).json({ message: "Stage not found" });
    }

    if (stageData.status === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    // ✅ mark paid
    stageData.status = "paid";

    const funded = Number(contract.payment.fundedAmount || 0);
    const stageAmount = Number(stageData.amount || 0);

    // ✅ update ONLY investment
    contract.payment.fundedAmount = funded + stageAmount;

    // ✅ check if all stages completed
    const allStagesPaid = contract.paymentSchedule.every(
      (s) => s.status === "paid"
    );

    if (allStagesPaid) {
      const total = Number(contract.payment.totalAmount || 0);
      const newFunded = Number(contract.payment.fundedAmount || 0);

      const finalPayable = Math.max(total - newFunded, 0);

      contract.payment.finalPayable = finalPayable;
      contract.payment.remainingAmount = finalPayable;
    }

    // ✅ history
    contract.paymentHistory.push({
      type: stage.toLowerCase(),
      amount: stageAmount,
      paymentId: razorpay_payment_id,
      date: new Date(),
    });

    await contract.save();

    res.json({
      message: "Stage payment success",
      fundedAmount: contract.payment.fundedAmount,
      finalPayable: contract.payment.finalPayable,
    });

  } catch (err) {
    console.error(err);
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
exports.finalPayment = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const finalAmount = Number(contract.payment.finalPayable || 0);

    // ❌ nothing to pay
    if (finalAmount <= 0) {
      return res.status(400).json({
        message: "No final payment required",
      });
    }

    // ✅ add to funded (total money paid by company)
    contract.payment.fundedAmount += finalAmount;

    // ✅ mark as fully paid
    contract.payment.finalPayable = 0;
    contract.payment.remainingAmount = 0;

    // ✅ history
    contract.paymentHistory.push({
      type: "final",
      amount: finalAmount,
      date: new Date(),
    });

    // ✅ contract completed
    contract.status = "completed";

    await contract.save();

    res.json({
      message: "Final payment completed ✅",
      finalAmount,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};




exports.createFinalOrder = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    const total = Number(contract.payment.totalAmount || 0);
    const invested = Number(contract.payment.fundedAmount || 0);

    const finalAmount = total - invested;

    console.log("TOTAL:", total);
    console.log("INVESTED:", invested);
    console.log("FINAL ₹:", finalAmount);

    if (finalAmount <= 0) {
      return res.status(400).json({
        message: "No final payment required",
      });
    }

    // ✅ Razorpay limit protection (VERY IMPORTANT)
    if (finalAmount > 500000) {
      return res.status(400).json({
        message: "Amount exceeds Razorpay limit (₹5,00,000). Split payment required.",
      });
    }

    const amountInPaise = Math.round(finalAmount * 100);

    console.log("FINAL PAISE:", amountInPaise);

    // ✅ CREATE ORDER
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `final_${contractId}`,
    });

    res.json({ order });

  } catch (err) {
    console.error("🔥 FINAL ORDER ERROR:", err);
    res.status(500).json({
      message: err.error?.description || err.message,
    });
  }
};

exports.verifyFinalPayment = async (req, res) => {
  try {
    const {
      contractId,
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const contract = await Contract.findById(contractId);

    const crypto = require("crypto");

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    const total = contract.payment.totalAmount;
    const invested = contract.payment.fundedAmount;
    const finalAmount = total - invested;

    // ✅ SAVE FINAL PAYMENT
    contract.paymentHistory.push({
      type: "final",
      amount: finalAmount,
      paymentId: razorpay_payment_id,
      date: new Date(),
    });
contract.payment.finalPayable = 0; // ✅ reset after payment
contract.payment.fundedAmount = contract.payment.totalAmount; // optional (full paid)
    contract.status = "completed";

    await contract.save();

    res.json({ message: "Final payment success ✅" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.markReadyForSale = async (req, res) => {
  try {
    const { contractId } = req.body;

    const contract = await Contract.findById(contractId);

    if (!contract) {
      return res.status(404).json({ message: "Contract not found" });
    }

    // ✅ Only farmer should do this (optional check)
    // if (contract.farmer.toString() !== req.user._id.toString()) {
    //   return res.status(403).json({ message: "Not allowed" });
    // }

    contract.readyForSale = true;

    await contract.save();

    res.json({
      message: "Farming marked as completed ✅",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};