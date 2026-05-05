const express = require("express");
const router = express.Router();

const {
  createContract,
  getContracts,
  applyContract,
  getCompanyContracts,
  approveFarmer,
  getFarmerContracts,
  signAgreement,
  payAdvance,
  payInstallment,
  downloadAgreement,
  verifyPayment,
  createInstallmentOrder,
  verifyInstallmentPayment,updateCompanyDetails,
  createStagePaymentOrder,verifyStagePayment,completeContract,payStage,finalPayment,createFinalOrder,verifyFinalPayment,
  markReadyForSale,
} = require("../controllers/contractController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// Company create contract
router.post("/", protect, authorizeRoles("company"), createContract);

// Farmer view contracts
router.get("/", protect, authorizeRoles("farmer"), getContracts);

// Apply
router.post("/apply/:id", protect, authorizeRoles("farmer"), applyContract);

// Company contracts
router.get("/company", protect, authorizeRoles("company"), getCompanyContracts);

// Approve farmer
router.put("/approve", protect, authorizeRoles("company"), approveFarmer);

// Farmer contracts
router.get("/farmer", protect, authorizeRoles("farmer"), getFarmerContracts);
router.post("/complete", protect, authorizeRoles("company"), completeContract);
// Payments
router.post("/pay-advance", protect, authorizeRoles("company"), payAdvance);
router.post("/verify-payment", protect, authorizeRoles("company"), verifyPayment);

router.post("/pay-installment", protect, authorizeRoles("company"), payInstallment);
router.post("/installment-order", protect, createInstallmentOrder);
router.post("/verify-installment", protect, verifyInstallmentPayment);

// Agreement
router.post("/sign", protect, signAgreement);
router.get("/agreement/:id", protect, downloadAgreement);


router.post("/stage/create", protect, createStagePaymentOrder);
router.post("/stage/verify", protect, verifyStagePayment);

router.post("/stage/pay", protect, payStage);
router.post("/final/pay", protect, finalPayment);


router.post("/final/create", protect, createFinalOrder);
router.post("/final/verify", protect, verifyFinalPayment);

router.post("/ready", protect, markReadyForSale);


router.put("/company/details", protect, updateCompanyDetails);
module.exports = router;