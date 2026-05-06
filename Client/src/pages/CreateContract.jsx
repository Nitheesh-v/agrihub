import { useState } from "react";
import { createContract } from "@/services/contractService";
import { useSelector } from "react-redux";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

.crc { font-family: 'DM Sans', sans-serif; }

/* ── Page wrapper ── */
.crc-page {
  min-height: 100vh;
  background: linear-gradient(145deg, #f8faff 0%, #eff6ff 50%, #f0fdf4 100%);
  padding: 2rem 1rem;
  display: flex; justify-content: center;
}
.crc-wrap {
  width: 100%; max-width: 580px;
  animation: crcUp .5s cubic-bezier(.22,1,.36,1) both;
}
@keyframes crcUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }

/* ── Page header ── */
.crc-page-header { margin-bottom: 1.75rem; }
.crc-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: .7rem; font-weight: 600; color: #2563eb;
  text-transform: uppercase; letter-spacing: .12em; margin-bottom: .375rem;
}
.crc-eyebrow::before { content:''; width:16px; height:1.5px; background:#2563eb; border-radius:2px; }
.crc-page-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.75rem; color: #1e3a8a; margin: 0 0 4px;
}
.crc-page-sub { font-size: .85rem; color: #6b7280; }

/* ── Success banner ── */
.crc-success {
  display: flex; align-items: center; gap: 10px;
  background: #dcfce7; border: 1px solid #86efac;
  border-radius: 12px; padding: .875rem 1rem;
  font-size: .875rem; color: #166534; margin-bottom: 1.25rem;
  animation: crcUp .4s ease both;
}

/* ── Section cards ── */
.crc-section {
  background: #fff; border: 1px solid #e0eaff;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 2px 12px rgba(37,99,235,.06);
  margin-bottom: 1rem;
  animation: crcUp .5s cubic-bezier(.22,1,.36,1) both;
  transition: box-shadow .2s;
}
.crc-section:hover { box-shadow: 0 6px 24px rgba(37,99,235,.1); }

.crc-section-strip { height: 3px; }
.crc-section-strip.blue    { background: linear-gradient(90deg,#1e3a8a,#3b82f6,#93c5fd); }
.crc-section-strip.green   { background: linear-gradient(90deg,#14532d,#16a34a,#4ade80); }
.crc-section-strip.amber   { background: linear-gradient(90deg,#92400e,#d97706,#fbbf24); }
.crc-section-strip.purple  { background: linear-gradient(90deg,#4c1d95,#7c3aed,#a78bfa); }
.crc-section-strip.teal    { background: linear-gradient(90deg,#134e4a,#0d9488,#5eead4); }

.crc-section-header {
  display: flex; align-items: center; gap: 10px;
  padding: 1rem 1.25rem; border-bottom: 1px solid #f1f5f9;
  background: #fafcff;
}
.crc-section-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.crc-section-icon.blue   { background: #eff6ff; }
.crc-section-icon.green  { background: #f0fdf4; }
.crc-section-icon.amber  { background: #fffbeb; }
.crc-section-icon.purple { background: #f5f3ff; }
.crc-section-icon.teal   { background: #f0fdfa; }

.crc-section-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1rem; color: #1e293b; margin: 0;
  flex: 1;
}
.crc-section-body { padding: 1.25rem; display: flex; flex-direction: column; gap: .875rem; }

/* ── Grid helpers ── */
.crc-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.crc-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .75rem; }

/* ── Field ── */
.crc-field { display: flex; flex-direction: column; gap: .375rem; }
.crc-label {
  font-size: .72rem; font-weight: 600; color: #475569;
  text-transform: uppercase; letter-spacing: .08em;
}
.crc-input-wrap { position: relative; display: flex; align-items: center; }
.crc-prefix {
  position: absolute; left: 12px; font-size: .85rem;
  font-weight: 600; color: #94a3b8; pointer-events: none;
  user-select: none;
}
.crc-input {
  height: 44px; width: 100%;
  border: 1.5px solid #e2e8f0; border-radius: 11px;
  padding: 0 1rem; font-family: 'DM Sans', sans-serif;
  font-size: .875rem; color: #1e293b;
  outline: none; transition: border-color .2s, box-shadow .2s, background .2s;
  background: #fff; box-sizing: border-box;
}
.crc-input.has-prefix { padding-left: 2rem; }
.crc-input::placeholder { color: #cbd5e1; }
.crc-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.12);
  background: #fafcff;
}
.crc-input.filled { border-color: #bfdbfe; background: #f8faff; }

/* ── Stage funding cards ── */
.crc-stage-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: .75rem; }
.crc-stage-card {
  border: 1.5px solid #e2e8f0; border-radius: 12px;
  padding: .875rem; background: #fafcff;
  transition: border-color .2s, box-shadow .2s;
}
.crc-stage-card:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59,130,246,.1);
  background: #fff;
}
.crc-stage-label {
  display: flex; align-items: center; gap: 5px;
  font-size: .7rem; font-weight: 600; color: #64748b;
  text-transform: uppercase; letter-spacing: .08em; margin-bottom: .5rem;
}
.crc-stage-input {
  width: 100%; border: none; outline: none; background: transparent;
  font-family: 'DM Sans', sans-serif; font-size: 1rem; font-weight: 700;
  color: #1e3a8a; padding: 0; box-sizing: border-box;
}
.crc-stage-input::placeholder { color: #cbd5e1; font-weight: 400; font-size: .875rem; }
.crc-stage-sub { font-size: .68rem; color: #94a3b8; margin-top: 3px; }

/* Total preview bar */
.crc-total-bar {
  display: flex; align-items: center; justify-content: space-between;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border: 1px solid #bfdbfe; border-radius: 10px;
  padding: .75rem 1rem; margin-top: .25rem;
}
.crc-total-label { font-size: .78rem; font-weight: 500; color: #1e40af; }
.crc-total-val   { font-size: 1rem; font-weight: 700; color: #1e3a8a; }

/* ── Risk sharing toggle ── */
.crc-toggle-row { display: flex; align-items: center; justify-content: space-between; }
.crc-toggle-label { font-size: .875rem; color: #374151; font-weight: 500; }
.crc-toggle-sub   { font-size: .75rem; color: #94a3b8; margin-top: 1px; }

.crc-toggle {
  position: relative; width: 44px; height: 24px;
  border: none; background: none; cursor: pointer; padding: 0; flex-shrink: 0;
}
.crc-toggle-track {
  width: 44px; height: 24px; border-radius: 12px;
  background: #e2e8f0; transition: background .25s;
}
.crc-toggle-track.on { background: #2563eb; }
.crc-toggle-thumb {
  position: absolute; top: 3px; left: 3px;
  width: 18px; height: 18px; border-radius: 50%;
  background: #fff; transition: transform .25s;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
}
.crc-toggle-thumb.on { transform: translateX(20px); }

/* ── Submit button ── */
.crc-submit {
  width: 100%; height: 48px; border: none; border-radius: 13px;
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #fff; font-family: 'DM Sans', sans-serif;
  font-size: .9rem; font-weight: 600; cursor: pointer;
  transition: all .2s cubic-bezier(.22,1,.36,1);
  display: flex; align-items: center; justify-content: center; gap: 8px;
  box-shadow: 0 4px 16px rgba(37,99,235,.35);
  margin-top: .25rem;
}
.crc-submit:hover:not(:disabled) {
  background: linear-gradient(135deg, #1e40af, #1d4ed8);
  box-shadow: 0 6px 24px rgba(37,99,235,.45);
  transform: translateY(-1px);
}
.crc-submit:active { transform: scale(.98); }
.crc-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

.crc-spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(255,255,255,.35);
  border-top-color: #fff; border-radius: 50%;
  animation: spin .7s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Tips row ── */
.crc-tip { font-size: .75rem; color: #94a3b8; text-align: center; margin-top: .875rem; }

/* ── Responsive ── */
@media(max-width:560px) {
  .crc-page { padding: 1rem .75rem; }
  .crc-page-title { font-size: 1.45rem; }
  .crc-grid-2 { grid-template-columns: 1fr; }
  .crc-grid-3 { grid-template-columns: 1fr; }
  .crc-stage-grid { grid-template-columns: 1fr; }
  .crc-section-body { padding: 1rem; gap: .75rem; }
  .crc-section-header { padding: .875rem 1rem; }
}
@media(max-width:380px) {
  .crc-stage-grid { grid-template-columns: 1fr 1fr; }
  .crc-page-title { font-size: 1.3rem; }
}
`;

const STAGES = [
  { key: "sowingAmount",   label: "Sowing",   emoji: "🌱", sub: "Pre-planting funds" },
  { key: "growthAmount",   label: "Growth",   emoji: "🌿", sub: "Mid-season support" },
  { key: "harvestAmount",  label: "Harvest",  emoji: "🌾", sub: "Final stage funds" },
];

const SECTIONS = [
  { id: "crop",     strip: "blue",   icon: "blue",   emoji: "🌾", title: "Crop Details" },
  { id: "stage",    strip: "green",  icon: "green",  emoji: "📅", title: "Stage Funding" },
  { id: "risk",     strip: "amber",  icon: "amber",  emoji: "⚖️", title: "Risk Sharing" },
  { id: "insurance",strip: "teal",   icon: "teal",   emoji: "🛡️", title: "Insurance" },
];

function Field({ label, placeholder, value, onChange, type = "text", prefix }) {
  return (
    <div className="crc-field">
      <label className="crc-label">{label}</label>
      <div className="crc-input-wrap">
        {prefix && <span className="crc-prefix">{prefix}</span>}
        <input
          autoComplete="off"
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={false}
          className={`crc-input ${value ? "filled" : ""} ${prefix ? "has-prefix" : ""}`}
        />
      </div>
    </div>
  );
}

export default function CreateContract() {
  const [form, setForm] = useState({
    cropName: "", quantity: "", price: "", location: "",
    sowingAmount: "", growthAmount: "", harvestAmount: "",
  });
  const [riskEnabled, setRiskEnabled] = useState(false);
  const [farmerShare, setFarmerShare]       = useState("");
  const [companyShare, setCompanyShare]     = useState("");
  const [insuranceProvider, setInsuranceProvider] = useState("");
  const [coverageAmount, setCoverageAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useSelector(s => s.auth);

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const totalFunding =
    (Number(form.sowingAmount) || 0) +
    (Number(form.growthAmount) || 0) +
    (Number(form.harvestAmount) || 0);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await createContract({
        cropName: form.cropName,
        quantity: Number(form.quantity),
        price: Number(form.price),
        location: form.location,
        paymentSchedule: [
          { stage: "sowing",  amount: Number(form.sowingAmount) },
          { stage: "growth",  amount: Number(form.growthAmount) },
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
      }, token);
      setSuccess(true);
      setForm({ cropName:"", quantity:"", price:"", location:"", sowingAmount:"", growthAmount:"", harvestAmount:"" });
      setTimeout(() => setSuccess(false), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="crc">
      <style>{S}</style>
      <div className="crc-page">
        <div className="crc-wrap">

          {/* Page header */}
          <div className="crc-page-header">
            <div className="crc-eyebrow">Contract creation</div>
            <h1 className="crc-page-title">Create New Contract</h1>
            <p className="crc-page-sub">Define crop details, stage funding, and risk terms for your farmer partnership.</p>
          </div>

          {/* Success */}
          {success && (
            <div className="crc-success">
              <svg viewBox="0 0 24 24" style={{ width:16, height:16, stroke:"#166534", fill:"none", strokeWidth:2.5, flexShrink:0 }}>
                <path d="M20 6L9 17l-5-5"/>
              </svg>
              Contract created successfully! Farmers can now apply.
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:0 }}>

            {/* ── Crop Details ── */}
            <div className="crc-section" style={{ animationDelay:".05s" }}>
              <div className="crc-section-strip blue" />
              <div className="crc-section-header">
                <div className="crc-section-icon blue">🌾</div>
                <h2 className="crc-section-title">Crop Details</h2>
              </div>
              <div className="crc-section-body">
                <Field label="Crop name" placeholder="e.g. Wheat, Tomatoes, Rice" value={form.cropName} onChange={set("cropName")} />
                <div className="crc-grid-2">
                  <Field label="Quantity" placeholder="e.g. 500 kg" value={form.quantity} onChange={set("quantity")} />
                  <Field label="Price per unit" placeholder="e.g. 40" type="number" value={form.price} onChange={set("price")} prefix="₹" />
                </div>
                <Field label="Location" placeholder="e.g. Coimbatore, Tamil Nadu" value={form.location} onChange={set("location")} />
              </div>
            </div>

            {/* ── Stage Funding ── */}
            <div className="crc-section" style={{ animationDelay:".1s" }}>
              <div className="crc-section-strip green" />
              <div className="crc-section-header">
                <div className="crc-section-icon green">📅</div>
                <h2 className="crc-section-title">Stage Funding</h2>
              </div>
              <div className="crc-section-body">
                <p style={{ fontSize:".8rem", color:"#64748b", margin:0 }}>
                  Split the total investment across three crop growth stages. The farmer receives each tranche when they reach that stage.
                </p>
                <div className="crc-stage-grid">
                  {STAGES.map(({ key, label, emoji, sub }) => (
                    <div key={key} className="crc-stage-card">
                      <div className="crc-stage-label">
                        <span>{emoji}</span>{label}
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                        <span style={{ fontSize:".85rem", fontWeight:700, color:"#94a3b8" }}>₹</span>
                        <input
                          type="number"
                          className="crc-stage-input"
                          placeholder="0"
                          value={form[key]}
                          onChange={set(key)}
                        />
                      </div>
                      <div className="crc-stage-sub">{sub}</div>
                    </div>
                  ))}
                </div>

                {/* Live total */}
                <div className="crc-total-bar">
                  <span className="crc-total-label">💰 Total investment</span>
                  <span className="crc-total-val">₹{totalFunding.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* ── Risk Sharing ── */}
            <div className="crc-section" style={{ animationDelay:".15s" }}>
              <div className="crc-section-strip amber" />
              <div className="crc-section-header">
                <div className="crc-section-icon amber">⚖️</div>
                <h2 className="crc-section-title">Risk Sharing</h2>
                {/* Toggle in header */}
                <button type="button" className="crc-toggle" onClick={() => setRiskEnabled(v => !v)} title="Toggle risk sharing">
                  <div className={`crc-toggle-track ${riskEnabled?"on":""}`} />
                  <div className={`crc-toggle-thumb ${riskEnabled?"on":""}`} />
                </button>
              </div>
              <div className="crc-section-body">
                {riskEnabled ? (
                  <>
                    <p style={{ fontSize:".8rem", color:"#64748b", margin:0 }}>
                      Define how losses are shared between you and the farmer in case of crop failure.
                    </p>
                    <div className="crc-grid-2">
                      <Field label="Farmer share (%)" placeholder="e.g. 40" type="number" value={farmerShare} onChange={e => setFarmerShare(e.target.value)} />
                      <Field label="Company share (%)" placeholder="e.g. 60" type="number" value={companyShare} onChange={e => setCompanyShare(e.target.value)} />
                    </div>
                    {farmerShare && companyShare && (
                      <div style={{ display:"flex", alignItems:"center", gap:8, padding:".625rem .875rem", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:10, fontSize:".8rem", color:"#92400e" }}>
                        ⚖️ <span>Farmer <strong>{farmerShare}%</strong> · Company <strong>{companyShare}%</strong></span>
                        {Number(farmerShare) + Number(companyShare) !== 100 && (
                          <span style={{ marginLeft:"auto", color:"#dc2626", fontSize:".72rem" }}>⚠ Must total 100%</span>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ fontSize:".8rem", color:"#94a3b8", margin:0, fontStyle:"italic" }}>
                    Risk sharing is currently disabled. Toggle on to configure.
                  </p>
                )}
              </div>
            </div>

            {/* ── Insurance ── */}
            <div className="crc-section" style={{ animationDelay:".2s" }}>
              <div className="crc-section-strip teal" />
              <div className="crc-section-header">
                <div className="crc-section-icon teal">🛡️</div>
                <h2 className="crc-section-title">Insurance</h2>
                <span style={{ fontSize:".7rem", color:"#94a3b8", fontStyle:"italic" }}>Optional</span>
              </div>
              <div className="crc-section-body">
                <Field label="Insurance provider" placeholder="e.g. LIC, IFFCO-Tokio" value={insuranceProvider} onChange={e => setInsuranceProvider(e.target.value)} />
                <Field label="Coverage amount" placeholder="e.g. 50000" type="number" value={coverageAmount} onChange={e => setCoverageAmount(e.target.value)} prefix="₹" />
                {insuranceProvider && (
                  <div style={{ display:"flex", alignItems:"center", gap:6, padding:".5rem .875rem", background:"#f0fdfa", border:"1px solid #5eead4", borderRadius:9, fontSize:".78rem", color:"#134e4a" }}>
                    ✅ Insurance: <strong>{insuranceProvider}</strong>{coverageAmount && ` · ₹${Number(coverageAmount).toLocaleString()} coverage`}
                  </div>
                )}
              </div>
            </div>

            {/* ── Submit ── */}
            <button type="submit" disabled={loading} className="crc-submit">
              {loading ? (
                <><div className="crc-spinner"/> Creating contract...</>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" style={{ width:16, height:16, fill:"none", stroke:"#fff", strokeWidth:2 }}>
                    <path d="M12 5v14M5 12l7 7 7-7"/>
                  </svg>
                  Create Contract
                </>
              )}
            </button>

            <p className="crc-tip">📋 Once created, farmers can view and apply to this contract on the marketplace.</p>

          </form>
        </div>
      </div>
    </div>
  );
}