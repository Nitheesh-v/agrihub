import { useState } from "react";
import { createContract } from "@/services/contractService";
import { useSelector } from "react-redux";

const Field = ({ label, placeholder, value, onChange, type = "text" }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-bold text-green-800 uppercase tracking-widest">
      {label}
    </label>

    <input
      autoComplete="off"
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="h-11 w-full border-2 border-green-100 rounded-xl px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all bg-white"
    />
  </div>
);

export default function CreateContract() {
  const [form, setForm] = useState({
    cropName: "",
    quantity: "",
    price: "",
    location: "",
    sowingAmount: "",
    growthAmount: "",
    harvestAmount: "",
  });

  const [riskEnabled, setRiskEnabled] = useState(false);
  const [farmerShare, setFarmerShare] = useState("");
  const [companyShare, setCompanyShare] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { token } = useSelector((s) => s.auth);

  const set = (k) => (e) =>
    setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await createContract(
        {
          cropName: form.cropName,
          quantity: Number(form.quantity),
          price: Number(form.price),
          location: form.location,

          // ✅ NEW PAYMENT STRUCTURE
          paymentSchedule: [
            { stage: "sowing", amount: Number(form.sowingAmount) },
            { stage: "growth", amount: Number(form.growthAmount) },
            { stage: "harvest", amount: Number(form.harvestAmount) },
          ],

          riskSharing: {
            enabled: riskEnabled,
            farmerPercentage: Number(farmerShare),
            companyPercentage: Number(companyShare),
          },

          insurance: {
            provider: insuranceProvider,
            coverageAmount: Number(coverageAmount),
            status: insuranceProvider ? "Active" : "Not Active",
          },
        },
        token
      );
console.log("cretaed successfully");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-green-50 to-yellow-50">
      <div className="max-w-xl mx-auto">

        <h1 className="text-2xl font-bold text-green-900 mb-6">
          Create Contract
        </h1>

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-300 rounded-lg text-green-800">
            Contract created successfully ✅
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Crop Details */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-bold mb-3 text-green-800">Crop Details</h2>

            <Field label="Crop name" value={form.cropName} onChange={set("cropName")} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <Field label="Quantity" value={form.quantity} onChange={set("quantity")} />
              <Field label="Price per unit" type="number" value={form.price} onChange={set("price")} />
            </div>

            <Field label="Location" value={form.location} onChange={set("location")} />
          </div>

          {/* Stage Funding */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-bold mb-3 text-green-800">Stage Funding</h2>

            <Field label="Sowing Amount (₹)" type="number" value={form.sowingAmount} onChange={set("sowingAmount")} />
            <Field label="Growth Amount (₹)" type="number" value={form.growthAmount} onChange={set("growthAmount")} />
            <Field label="Harvest Amount (₹)" type="number" value={form.harvestAmount} onChange={set("harvestAmount")} />
          </div>

          {/* Risk Sharing */}
          <div className="bg-white p-5 rounded-xl border">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-bold text-green-800">Risk Sharing</h2>
              <button type="button" onClick={() => setRiskEnabled(!riskEnabled)}>
                {riskEnabled ? "ON" : "OFF"}
              </button>
            </div>

            {riskEnabled && (
              <div className="grid grid-cols-2 gap-3">
                <Field label="Farmer %" type="number" value={farmerShare} onChange={(e) => setFarmerShare(e.target.value)} />
                <Field label="Company %" type="number" value={companyShare} onChange={(e) => setCompanyShare(e.target.value)} />
              </div>
            )}
          </div>

          {/* Insurance */}
          <div className="bg-white p-5 rounded-xl border">
            <h2 className="font-bold mb-3 text-green-800">Insurance</h2>

            <Field label="Provider" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} />
            <Field label="Coverage Amount" type="number" value={coverageAmount} onChange={(e) => setCoverageAmount(e.target.value)} />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-green-700 text-white rounded-xl font-bold"
          >
            {loading ? "Creating..." : "Create Contract"}
          </button>
        </form>
      </div>
    </div>
  );
}