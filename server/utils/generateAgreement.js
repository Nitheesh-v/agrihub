const generateAgreement = (contract, farmer) => {
  // ✅ Get company & farmer details
  const companyName = contract.company?.name || "Company";
  const companyEmail = contract.company?.email || "N/A";

  const farmerName = farmer?.name || "Farmer";

  // ✅ Risk Sharing
  let riskText = "Not Enabled";
  if (contract.riskSharing?.enabled) {
    riskText = `Farmer ${contract.riskSharing.farmerPercentage}% | Company ${contract.riskSharing.companyPercentage}%`;
  }

  // ✅ Insurance
  let insuranceText = "No Insurance";
  if (contract.insurance?.provider) {
    insuranceText = `
Provider: ${contract.insurance.provider}
Coverage: ₹${contract.insurance.coverageAmount}
Status: ${contract.insurance.status}
    `;
  }

  return `
CONTRACT AGREEMENT

----------------------------------------

Crop: ${contract.cropName}
Quantity: ${contract.quantity}
Price: Rs. ${contract.price}
Location: ${contract.location || "N/A"}

----------------------------------------

Company: ${companyName}
Email: ${companyEmail}

Farmer: ${farmerName}

----------------------------------------

💰 Payment Details:

Total Amount: Rs. ${contract.payment?.totalAmount || 0}
Advance Paid: Rs. ${contract.payment?.advancePaid || 0}
Remaining Amount: Rs. ${contract.payment?.remainingAmount || 0}

----------------------------------------

📊 Risk Sharing:
${riskText}

----------------------------------------

🌧️ Crop Insurance:
${insuranceText}

----------------------------------------

📜 Terms & Conditions:

1. Farmer agrees to cultivate and deliver the crop.
2. Company agrees to purchase at agreed price.
3. Payment will be completed after harvest.
4. Risk sharing & insurance apply if enabled.

----------------------------------------

📅 Date: ${new Date().toLocaleDateString()}

----------------------------------------

✍️ Signatures:

Farmer Signed: ${contract.agreement?.farmerSigned ? "Yes" : "No"}
Company Signed: ${contract.agreement?.companySigned ? "Yes" : "No"}

----------------------------------------

Farmer Signature:
${contract.agreement?.farmerSigned ? farmerName : "____________________"}

Company Signature:
${contract.agreement?.companySigned ? companyName : "____________________"}

----------------------------------------

Final Status:
${
  contract.agreement?.farmerSigned &&
  contract.agreement?.companySigned
    ? "Agreement Completed ✅"
    : "Pending Signatures ⏳"
}

----------------------------------------
`;
};

module.exports = generateAgreement;