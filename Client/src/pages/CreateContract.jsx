import { useState } from "react";
import { createContract } from "@/services/contractService";
import { useSelector } from "react-redux";


const Field = ({ label, placeholder, value, onChange, type = "text" }) => {
  return (
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
};

export default function CreateContract() {
  const [form, setForm] = useState({ cropName: "", quantity: "", price: "", advancePaid: "", location: "" });
  const [riskEnabled, setRiskEnabled] = useState(false);
  const [farmerShare, setFarmerShare] = useState("");
  const [companyShare, setCompanyShare] = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useSelector((s) => s.auth);

  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await createContract({ ...form, quantity: Number(form.quantity), price: Number(form.price), advancePaid: Number(form.advancePaid), riskSharing: { enabled: riskEnabled, farmerPercentage: Number(farmerShare), companyPercentage: Number(companyShare) }, insurance: { provider: insuranceProvider, coverageAmount: Number(coverageAmount), status: insuranceProvider ? "Active" : "Not Active" } }, token);
      setSuccess(true); setTimeout(() => setSuccess(false), 3000);
    } finally { setLoading(false); }
  };

  // const Field = ({ label, placeholder, value, onChange, type = "text", half }) => (
  //   <div className={`flex flex-col gap-1.5 ${half ? "" : ""}`}>
  //     <label className="text-xs font-bold text-green-800 uppercase tracking-widest">{label}</label>
  //     <input type={type} placeholder={placeholder} value={value} onChange={onChange} required
  //       className="h-11 w-full border-2 border-green-100 rounded-xl px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition-all bg-white"
  //     />
  //   </div>
  // );

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg,#f0fdf4,#fefce8)" }}>
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 ani-fadeup">
          <div className="w-12 h-12 rounded-2xl shadow-md flex items-center justify-center" style={{ background: "linear-gradient(135deg,#166534,#3B6D11)" }}>
            <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-green-900">Create Contract</h1>
            <p className="text-sm text-green-600">Set up a new farming contract</p>
          </div>
        </div>

        {/* Success */}
        {success && (
          <div className="flex items-center gap-3 rounded-2xl px-5 py-4 mb-5 ani-slidein" style={{ background: "linear-gradient(135deg,#dcfce7,#bbf7d0)", border: "2px solid #86efac" }}>
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="white" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <p className="text-green-800 font-bold text-sm">Contract created successfully! Farmers can now apply.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Crop details */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 ani-fadeup stagger-1">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-green-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="#166534"><path d="M12 2C9 7 4 9 4 14a8 8 0 0016 0c0-5-5-7-8-12z"/></svg>
              </div>
              <p className="text-sm font-black text-green-900">Crop details</p>
            </div>
            <div className="space-y-4">
              <Field label="Crop name" placeholder="e.g. Tomatoes, Wheat, Rice" value={form.cropName} onChange={set("cropName")} />
              <div className="grid grid-cols-2 gap-3">
                <Field label="Quantity" placeholder="e.g. 500 kg" value={form.quantity} onChange={set("quantity")} />
                <Field label="Price / unit (₹)" placeholder="e.g. 40" value={form.price} onChange={set("price")} type="number" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Advance paid (₹)" placeholder="e.g. 5000" value={form.advancePaid} onChange={set("advancePaid")} type="number" />
                <Field label="Location" placeholder="e.g. Chennai, TN" value={form.location} onChange={set("location")} />
              </div>
            </div>
          </div>

          {/* Risk sharing */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 ani-fadeup stagger-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#d97706" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-black text-green-900">Risk sharing</p>
                  <p className="text-xs text-gray-400">Split financial risk between farmer & company</p>
                </div>
              </div>
              <button type="button" onClick={() => setRiskEnabled(!riskEnabled)}
                className="w-12 h-6 rounded-full transition-all relative"
                style={{ background: riskEnabled ? "linear-gradient(135deg,#166534,#3B6D11)" : "#e5e7eb" }}>
                <span className="absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all" style={{ left: riskEnabled ? "calc(100% - 20px)" : 4 }} />
              </button>
            </div>

            {riskEnabled && (
              <div className="mt-4 space-y-3 ani-fadein">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Farmer share (%)" placeholder="e.g. 40" value={farmerShare} onChange={(e) => setFarmerShare(e.target.value)} type="number" />
                  <Field label="Company share (%)" placeholder="e.g. 60" value={companyShare} onChange={(e) => setCompanyShare(e.target.value)} type="number" />
                </div>
                {farmerShare && companyShare && (
                  <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ background: "linear-gradient(135deg,#fef3c7,#fde68a)", color: "#92400e", border: "1px solid #fbbf24" }}>
                    Farmer {farmerShare}% · Company {companyShare}% of any crop loss
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Insurance */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-6 ani-fadeup stagger-3">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="#2563eb" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z"/></svg>
              </div>
              <div>
                <p className="text-sm font-black text-green-900">Crop insurance</p>
                <p className="text-xs text-gray-400">Optional — leave blank if not applicable</p>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="Insurance provider" placeholder="e.g. PMFBY, LIC Agri" value={insuranceProvider} onChange={(e) => setInsuranceProvider(e.target.value)} />
              <Field label="Coverage amount (₹)" placeholder="e.g. 100000" value={coverageAmount} onChange={(e) => setCoverageAmount(e.target.value)} type="number" />
              {insuranceProvider && (
                <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ani-fadein" style={{ background: "linear-gradient(135deg,#dbeafe,#bfdbfe)", color: "#1d4ed8", border: "1px solid #93c5fd" }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 01-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 011-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 011.52 0C14.51 3.81 17 5 19 5a1 1 0 011 1z"/></svg>
                  Insurance status will be set to <span className="ml-1 font-black">Active</span>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={loading}
            className="w-full h-14 rounded-2xl text-base font-black text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-60 disabled:scale-100 shadow-lg ani-fadeup stagger-4"
            style={{ background: loading ? "#9ca3af" : "linear-gradient(135deg,#166534,#3B6D11)" }}>
            {loading ? "Creating contract..." : "Create contract →"}
          </button>

          <p className="text-xs text-center text-green-500 ani-fadeup stagger-5">
            Farmers will be able to see and apply for this contract from the marketplace
          </p>
        </form>
      </div>
    </div>
  );
}