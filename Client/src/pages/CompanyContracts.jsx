import { useEffect, useState } from "react";
import { getCompanyContracts, approveFarmer, payAdvance, createInstallmentOrder, downloadAgreement, signAgreement } from "@/services/contractService";
import { useSelector } from "react-redux";
import API from "@/services/api";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

.cc { font-family: 'DM Sans', sans-serif; }

/* ── Header ── */
.cc-header { margin-bottom: 1.5rem; animation: ccUp .5s cubic-bezier(.22,1,.36,1) both; }
@keyframes ccUp { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
.cc-eyebrow {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: .7rem; font-weight: 600; color: #2563eb;
  text-transform: uppercase; letter-spacing: .12em; margin-bottom: .375rem;
}
.cc-eyebrow::before { content:''; width:20px; height:1.5px; background:#2563eb; border-radius:2px; }
.cc-title { font-family:'DM Serif Display',serif; font-size:1.6rem; color:#1e3a8a; margin:0 0 4px; }
.cc-sub { font-size:.82rem; color:#6b7280; }

/* ── Empty ── */
.cc-empty {
  text-align:center; padding:3.5rem 2rem;
  background:#fff; border-radius:20px; border:2px dashed #bfdbfe;
  animation: ccUp .5s cubic-bezier(.22,1,.36,1) both;
}
.cc-empty-icon { width:64px; height:64px; border-radius:50%; background:#eff6ff; display:flex; align-items:center; justify-content:center; margin:0 auto .875rem; font-size:1.75rem; }
.cc-empty-title { font-family:'DM Serif Display',serif; font-size:1rem; color:#1e3a8a; margin-bottom:4px; }
.cc-empty-sub { font-size:.8rem; color:#94a3b8; }

/* ── Card list ── */
.cc-list { display:flex; flex-direction:column; gap:1rem; }
.cc-card {
  background:#fff; border-radius:18px;
  border:1px solid #dbeafe; overflow:hidden;
  box-shadow:0 2px 12px rgba(37,99,235,.06);
  transition:box-shadow .25s, transform .25s;
  animation: ccUp .5s cubic-bezier(.22,1,.36,1) both;
}
.cc-card:hover { box-shadow:0 8px 32px rgba(37,99,235,.12); transform:translateY(-1px); }

/* gradient top strip */
.cc-strip { height:3px; background:linear-gradient(90deg,#1e3a8a,#3b82f6,#93c5fd); }

/* ── Card header (click to expand) ── */
.cc-card-head {
  display:flex; align-items:center; gap:.875rem;
  padding:1.125rem 1.25rem; cursor:pointer;
  transition:background .15s;
}
.cc-card-head:hover { background:#fafbff; }
.cc-head-icon {
  width:46px; height:46px; border-radius:13px;
  background:#eff6ff; border:1px solid #bfdbfe;
  display:flex; align-items:center; justify-content:center;
  font-size:1.4rem; flex-shrink:0;
  transition:transform .2s;
}
.cc-card:hover .cc-head-icon { transform:scale(1.06); }
.cc-head-info { flex:1; min-width:0; }
.cc-head-name { font-family:'DM Serif Display',serif; font-size:1rem; color:#1e3a8a; margin:0 0 3px; }
.cc-head-meta { font-size:.73rem; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cc-head-right { display:flex; align-items:center; gap:.625rem; flex-shrink:0; }

.cc-badge {
  display:inline-flex; align-items:center; gap:4px;
  padding:.22rem .6rem; border-radius:20px;
  font-size:.68rem; font-weight:600; border:1px solid;
  white-space:nowrap;
}
.cc-badge.approved  { background:#dcfce7; color:#166534; border-color:#86efac; }
.cc-badge.pending   { background:#fef3c7; color:#92400e; border-color:#fde68a; }
.cc-badge.active    { background:#dbeafe; color:#1e40af; border-color:#93c5fd; }
.cc-badge.completed { background:#f0fdf4; color:#15803d; border-color:#86efac; }
.cc-badge.paid      { background:#f0fdf4; color:#15803d; border-color:#86efac; }

.cc-chevron { width:16px; height:16px; stroke:#94a3b8; flex-shrink:0; transition:transform .25s; }

/* ── Payment summary row ── */
.cc-payments {
  display:grid; grid-template-columns:repeat(3,1fr);
  gap:.5rem; padding:0 1.25rem 1rem;
}
.cc-payment-cell {
  background:#f8faff; border-radius:10px;
  padding:.75rem .875rem; border:1px solid #e0eaff;
  transition:background .15s;
}
.cc-payment-cell:hover { background:#eff6ff; }
.cc-payment-label { font-size:.62rem; color:#94a3b8; text-transform:uppercase; letter-spacing:.08em; margin-bottom:4px; }
.cc-payment-val { font-size:.95rem; font-weight:700; }
.cc-payment-val.total     { color:#1e3a8a; }
.cc-payment-val.paid      { color:#059669; }
.cc-payment-val.remaining { color:#d97706; }

/* ── Action buttons ── */
.cc-actions { display:flex; gap:.5rem; flex-wrap:wrap; padding:0 1.25rem 1.125rem; }
.cc-action-btn {
  display:inline-flex; align-items:center; gap:5px;
  padding:.45rem .875rem; border-radius:9px;
  font-family:'DM Sans',sans-serif; font-size:.76rem; font-weight:600;
  border:1.5px solid; cursor:pointer;
  transition:all .2s cubic-bezier(.22,1,.36,1);
  white-space:nowrap;
}
.cc-action-btn:hover  { transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.1); }
.cc-action-btn:active { transform:scale(.97); }
.cc-action-btn.pay-advance  { background:#fef3c7; color:#92400e; border-color:#fde68a; }
.cc-action-btn.pay-advance:hover  { background:#fde68a; }
.cc-action-btn.installment  { background:#dcfce7; color:#166534; border-color:#86efac; }
.cc-action-btn.installment:hover  { background:#bbf7d0; }
.cc-action-btn.sign         { background:#ede9fe; color:#5b21b6; border-color:#c4b5fd; }
.cc-action-btn.sign:hover   { background:#ddd6fe; }
.cc-action-btn.download     { background:#f1f5f9; color:#475569; border-color:#e2e8f0; }
.cc-action-btn.download:hover { background:#e2e8f0; }
.cc-action-btn.final        { background:#fef3c7; color:#78350f; border-color:#fbbf24; }
.cc-action-btn.final:hover  { background:#fde68a; }

/* ── Expanded section ── */
.cc-expanded {
  padding:0 1.25rem 1.25rem;
  border-top:1px solid #f1f5f9;
  animation: expandIn .3s cubic-bezier(.22,1,.36,1) both;
}
@keyframes expandIn { from { opacity:0; transform:translateY(-8px) } to { opacity:1; transform:translateY(0) } }

.cc-section-label {
  font-size:.65rem; font-weight:700; color:#94a3b8;
  text-transform:uppercase; letter-spacing:.12em;
  margin:1.125rem 0 .625rem;
  display:flex; align-items:center; gap:6px;
}
.cc-section-label::after { content:''; flex:1; height:1px; background:#e0eaff; }

/* Financial breakdown grid */
.cc-breakdown { display:grid; grid-template-columns:repeat(3,1fr); gap:.5rem; margin-bottom:.5rem; }

/* Payment schedule */
.cc-stage-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:.75rem 1rem; margin-bottom:.5rem;
  background:#f8faff; border:1px solid #e0eaff;
  border-radius:11px; gap:.75rem;
  animation: ccUp .4s cubic-bezier(.22,1,.36,1) both;
}
.cc-stage-left { display:flex; flex-direction:column; gap:2px; }
.cc-stage-name { font-size:.85rem; font-weight:600; color:#1e3a8a; text-transform:capitalize; }
.cc-stage-amount { font-size:.78rem; color:#64748b; }
.cc-stage-right { display:flex; align-items:center; gap:.5rem; flex-shrink:0; }

/* Applicant rows */
.cc-applicant-row {
  display:flex; align-items:center; justify-content:space-between;
  padding:.7rem .875rem; background:#fafbff;
  border-radius:11px; border:1px solid #e0eaff;
  margin-bottom:.5rem; gap:.75rem;
  animation: ccUp .4s cubic-bezier(.22,1,.36,1) both;
}
.cc-applicant-row:last-child { margin-bottom:0; }
.cc-applicant-identity { display:flex; align-items:center; gap:.625rem; min-width:0; }
.cc-applicant-avatar {
  width:32px; height:32px; border-radius:50%;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  display:flex; align-items:center; justify-content:center;
  font-size:.7rem; font-weight:700; color:#fff; flex-shrink:0;
}
.cc-applicant-name  { font-size:.82rem; font-weight:500; color:#1e293b; margin:0 0 1px; }
.cc-applicant-email { font-size:.7rem; color:#94a3b8; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
.cc-approve-btn {
  padding:.35rem .7rem; border-radius:7px; border:none;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:#fff; font-family:'DM Sans',sans-serif;
  font-size:.72rem; font-weight:600; cursor:pointer;
  transition:all .2s; box-shadow:0 3px 8px rgba(37,99,235,.3);
  white-space:nowrap; flex-shrink:0;
}
.cc-approve-btn:hover { box-shadow:0 4px 14px rgba(37,99,235,.4); transform:translateY(-1px); }
.cc-approve-btn:active { transform:scale(.97); }
.cc-approve-btn:disabled { background:#dbeafe; color:#93c5fd; box-shadow:none; cursor:default; transform:none; }

/* Payment history */
.cc-history-row {
  display:flex; justify-content:space-between; align-items:center;
  padding:.5rem .875rem; background:#fffbeb;
  border-radius:9px; border:1px solid #fde68a; margin-bottom:.375rem;
}
.cc-history-type   { font-size:.78rem; font-weight:500; color:#92400e; text-transform:capitalize; }
.cc-history-amount { font-size:.85rem; font-weight:700; color:#78350f; }

/* Final payment banner */
.cc-final-banner {
  display:flex; align-items:center; justify-content:space-between;
  padding:.875rem 1rem; border-radius:12px; gap:.75rem;
  background:linear-gradient(135deg,#fef9c3,#fef3c7);
  border:1px solid #fbbf24; margin-bottom:.625rem;
  flex-wrap:wrap;
}
.cc-final-info { display:flex; flex-direction:column; gap:2px; }
.cc-final-label { font-size:.68rem; font-weight:600; color:#92400e; text-transform:uppercase; letter-spacing:.08em; }
.cc-final-amount { font-size:1rem; font-weight:700; color:#78350f; }

/* ── Responsive ── */
@media(max-width:640px) {
  .cc-title { font-size:1.35rem; }
  .cc-card-head { padding:.875rem 1rem; gap:.75rem; }
  .cc-head-icon { width:40px; height:40px; font-size:1.2rem; }
  .cc-head-right { flex-direction:column; align-items:flex-end; gap:.375rem; }
  .cc-payments { grid-template-columns:repeat(3,1fr); padding:0 1rem .875rem; gap:.375rem; }
  .cc-payment-cell { padding:.625rem .75rem; }
  .cc-payment-val { font-size:.85rem; }
  .cc-actions { flex-direction:column; padding:0 1rem .875rem; }
  .cc-action-btn { width:100%; justify-content:center; }
  .cc-expanded { padding:0 1rem 1rem; }
  .cc-breakdown { grid-template-columns:repeat(3,1fr); gap:.375rem; }
  .cc-stage-row { flex-direction:column; align-items:flex-start; }
  .cc-stage-right { width:100%; justify-content:flex-end; }
  .cc-applicant-row { flex-direction:column; align-items:flex-start; }
  .cc-approve-btn { width:100%; justify-content:center; text-align:center; }
  .cc-final-banner { flex-direction:column; align-items:flex-start; }
  .cc-action-btn.final { width:100%; justify-content:center; }
}

@media(max-width:380px) {
  .cc-payments { grid-template-columns:1fr 1fr 1fr; }
  .cc-payment-label { font-size:.55rem; }
  .cc-payment-val { font-size:.78rem; }
}
`;

const CROP_EMOJI = { tomato:"🍅", wheat:"🌾", rice:"🍚", corn:"🌽", cotton:"🌿", onion:"🧅", potato:"🥔" };
const getCropEmoji = name => Object.entries(CROP_EMOJI).find(([k]) => (name||"").toLowerCase().includes(k))?.[1] || "🌱";
const initials = name => (name||"?").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

export default function CompanyContracts() {
  const [contracts, setContracts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const { token } = useSelector(s => s.auth);

  useEffect(() => { fetchContracts(); }, []);

  const fetchContracts = async () => {
    try { const { data } = await getCompanyContracts(token); setContracts(data); }
    catch (err) { console.error(err); }
  };

  const handleApprove = async (contractId, farmerId) => {
    try { await approveFarmer(contractId, farmerId, token); fetchContracts(); }
    catch (err) { console.error(err); }
  };

  const handlePayAdvance = async (contract) => {
    try {
      const amount = Number(prompt("Enter advance amount (₹)"));
      if (!amount || amount <= 0) return;
      const { data: order } = await payAdvance({ contractId: contract._id, amount }, token);
      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount, currency: "INR", order_id: order.id,
        handler: async r => {
          await API.post("/api/contracts/verify-payment",
            { contractId: contract._id, amount, razorpay_payment_id: r.razorpay_payment_id, razorpay_order_id: r.razorpay_order_id, razorpay_signature: r.razorpay_signature },
            { headers: { Authorization: `Bearer ${token}` } });
          fetchContracts();
        },
      }).open();
    } catch { alert("Payment failed"); }
  };

  const handleInstallment = async (contract) => {
    try {
      const amount = Number(prompt("Enter installment amount"));
      if (!amount || amount <= 0) { alert("Invalid amount"); return; }
      if (amount > contract.payment.remainingAmount) { alert("Cannot pay more than remaining amount"); return; }
      const { data: order } = await createInstallmentOrder({ contractId: contract._id, amount }, token);
      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount, currency: "INR", order_id: order.id,
        handler: async response => {
          await API.post("/api/contracts/verify-installment",
            { contractId: contract._id, amount, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature },
            { headers: { Authorization: `Bearer ${token}` } });
          fetchContracts();
        },
      }).open();
    } catch (err) { alert("Payment failed ❌"); }
  };

  const handleFinalPay = async contract => {
    try {
      const { data } = await API.post("/api/contracts/final/create",
        { contractId: contract._id },
        { headers: { Authorization: `Bearer ${token}` } });
      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount, currency: "INR", order_id: data.order.id,
        handler: async response => {
          await API.post("/api/contracts/final/verify",
            { contractId: contract._id, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature },
            { headers: { Authorization: `Bearer ${token}` } });
          alert("Final payment successful ✅");
          fetchContracts();
        },
      }).open();
    } catch (err) { alert(err.response?.data?.message || "Final payment failed ❌"); }
  };

  const handleSign = async id => {
    try { await signAgreement(id, token); fetchContracts(); }
    catch { alert("Error signing"); }
  };

  const handleDownload = async id => {
    try {
      const res = await downloadAgreement(id, token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url; a.setAttribute("download", "agreement.pdf");
      document.body.appendChild(a); a.click();
    } catch { alert("Download failed"); }
  };

  const handleStagePayment = async (contractId, stage) => {
    try {
      if (!contractId || !stage) { alert("Invalid contract or stage"); return; }
      const cleanStage = stage.trim().toLowerCase();
      const { data } = await API.post("/api/contracts/stage/create",
        { contractId, stage: cleanStage },
        { headers: { Authorization: `Bearer ${token}` } });
      new window.Razorpay({
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: data.order.amount, currency: "INR", order_id: data.order.id,
        handler: async response => {
          try {
            await API.post("/api/contracts/stage/verify",
              { contractId, stage: cleanStage, razorpay_payment_id: response.razorpay_payment_id, razorpay_order_id: response.razorpay_order_id, razorpay_signature: response.razorpay_signature },
              { headers: { Authorization: `Bearer ${token}` } });
            alert(`✅ ${cleanStage} funded successfully`);
            fetchContracts();
          } catch (err) { alert(err.response?.data?.message || "Verification failed ❌"); }
        },
      }).open();
    } catch (err) { alert(err.response?.data?.message || "Payment failed ❌"); }
  };

  return (
    <div className="cc">
      <style>{S}</style>

      {/* Header */}
      <div className="cc-header">
        <div className="cc-eyebrow">Contract management</div>
        <h1 className="cc-title">My Contracts</h1>
        <p className="cc-sub">{contracts.length} active contract{contracts.length !== 1 ? "s" : ""}</p>
      </div>

      {contracts.length === 0 ? (
        <div className="cc-empty">
          <div className="cc-empty-icon">📋</div>
          <div className="cc-empty-title">No contracts yet</div>
          <div className="cc-empty-sub">Create your first contract to start connecting with farmers</div>
        </div>
      ) : (
        <div className="cc-list">
          {contracts.map((c, i) => {
            const isExpanded = expanded[c._id];
            const allStagesPaid = c.paymentSchedule?.length > 0 && c.paymentSchedule.every(s => s.status === "paid");
            const isFinalPaid = c.paymentHistory?.some(p => p.type === "final");

            return (
              <div key={c._id} className="cc-card" style={{ animationDelay:`${i*0.07}s` }}>
                <div className="cc-strip" />

                {/* ── Card Header ── */}
                <div className="cc-card-head" onClick={() => setExpanded(p => ({ ...p, [c._id]: !p[c._id] }))}>
                  <div className="cc-head-icon">{getCropEmoji(c.cropName)}</div>
                  <div className="cc-head-info">
                    <div className="cc-head-name">{c.cropName}</div>
                    <div className="cc-head-meta">
                      {[c.location, `${c.quantity} units`, `₹${c.price}/unit`, `${c.applicants?.length ?? 0} applicants`].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                  <div className="cc-head-right">
                    <span className={`cc-badge ${c.status}`}>
                      {c.status?.charAt(0).toUpperCase() + c.status?.slice(1)}
                    </span>
                    <svg className="cc-chevron" style={{ transform: isExpanded ? "rotate(180deg)" : "none" }} viewBox="0 0 24 24" fill="none" strokeWidth="2">
                      <path d="M6 9l6 6 6-6"/>
                    </svg>
                  </div>
                </div>

                {/* ── Payment Summary ── */}
                <div className="cc-payments">
                  {[
                    ["Total value", `₹${c.payment?.totalAmount ?? 0}`, "total"],
                    ["Funded", `₹${c.payment?.fundedAmount ?? 0}`, "paid"],
                    ["Final payable", `₹${Math.max(c.payment?.finalPayable ?? 0, 0)}`, "remaining"],
                  ].map(([label, val, cls]) => (
                    <div key={label} className="cc-payment-cell">
                      <div className="cc-payment-label">{label}</div>
                      <div className={`cc-payment-val ${cls}`}>{val}</div>
                    </div>
                  ))}
                </div>

                {/* ── Action Buttons ── */}
                <div className="cc-actions">
                  {!c.agreement?.companySigned && (
                    <button className="cc-action-btn sign" onClick={() => handleSign(c._id)}>
                      ✍️ Sign agreement
                    </button>
                  )}
                  <button className="cc-action-btn download" onClick={() => handleDownload(c._id)}>
                    📥 Download PDF
                  </button>
                </div>

                {/* ── Expanded Section ── */}
                {isExpanded && (
                  <div className="cc-expanded">

                    {/* Financial Breakdown */}
                    <div className="cc-section-label">Financial Breakdown</div>
                    <div className="cc-breakdown">
                      {[
                        ["Crop total", `₹${c.payment?.totalAmount ?? 0}`, "total"],
                        ["Invested", `₹${c.payment?.fundedAmount ?? 0}`, "paid"],
                        ["Final payable", `₹${Math.max(c.payment?.finalPayable ?? 0, 0)}`, "remaining"],
                      ].map(([label, val, cls]) => (
                        <div key={label} className="cc-payment-cell">
                          <div className="cc-payment-label">{label}</div>
                          <div className={`cc-payment-val ${cls}`}>{val}</div>
                        </div>
                      ))}
                    </div>

                    {/* Payment Schedule */}
                    {c.paymentSchedule?.length > 0 && (
                      <>
                        <div className="cc-section-label">Payment Schedule</div>
                        {c.paymentSchedule.map((stage, si) => (
                          <div key={stage.stage} className="cc-stage-row" style={{ animationDelay:`${si*0.05}s` }}>
                            <div className="cc-stage-left">
                              <div className="cc-stage-name">{stage.stage}</div>
                              <div className="cc-stage-amount">₹{stage.amount}</div>
                            </div>
                            <div className="cc-stage-right">
                              <span className={`cc-badge ${stage.status}`}>{stage.status}</span>
                              {stage.status === "pending" && (
                                <button className="cc-action-btn installment" style={{ padding:".35rem .7rem", fontSize:".72rem" }}
                                  onClick={() => handleStagePayment(c._id, stage.stage?.toLowerCase().trim())}>
                                  💰 Fund
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </>
                    )}

                    {/* Final Payment */}
                    {allStagesPaid && !isFinalPaid && (c.payment?.finalPayable ?? 0) > 0 && (
                      <>
                        <div className="cc-section-label">Final Settlement</div>
                        <div className="cc-final-banner">
                          <div className="cc-final-info">
                            <div className="cc-final-label">Remaining harvest payment</div>
                            <div className="cc-final-amount">₹{c.payment.finalPayable}</div>
                          </div>
                          <button className="cc-action-btn final" onClick={() => handleFinalPay(c)}>
                            💵 Pay Final Settlement
                          </button>
                        </div>
                      </>
                    )}
                    {isFinalPaid && (
                      <div style={{ display:"flex", alignItems:"center", gap:6, padding:".625rem .875rem", background:"#dcfce7", border:"1px solid #86efac", borderRadius:10, fontSize:".8rem", color:"#166534", fontWeight:500, marginTop:4 }}>
                        ✅ Final payment completed
                      </div>
                    )}

                    {/* Applicants */}
                    <div className="cc-section-label">Applicants ({c.applicants?.length ?? 0})</div>
                    {c.applicants?.length === 0 ? (
                      <p style={{ fontSize:".8rem", color:"#94a3b8", fontStyle:"italic" }}>No applicants yet</p>
                    ) : (
                      c.applicants.map((a, ai) => (
                        <div key={a._id} className="cc-applicant-row" style={{ animationDelay:`${ai*0.05}s` }}>
                          <div className="cc-applicant-identity">
                            <div className="cc-applicant-avatar">{initials(a.farmer?.name)}</div>
                            <div style={{ minWidth:0 }}>
                              <div className="cc-applicant-name">{a.farmer?.name}</div>
                              <div className="cc-applicant-email">{a.farmer?.email}</div>
                            </div>
                          </div>
                          <button className="cc-approve-btn" disabled={a.status === "approved"}
                            onClick={() => handleApprove(c._id, a.farmer._id)}>
                            {a.status === "approved" ? "Approved ✓" : "Approve"}
                          </button>
                        </div>
                      ))
                    )}

                    {/* Payment History */}
                    {c.paymentHistory?.length > 0 && (
                      <>
                        <div className="cc-section-label">Payment History</div>
                        {[...new Map(c.paymentHistory.map(p => [p.type, p])).values()].map((p, idx) => (
                          <div key={idx} className="cc-history-row">
                            <span className="cc-history-type">
                              {p.type === "final" ? "Final crop payment" : `Stage: ${p.type}`}
                            </span>
                            <span className="cc-history-amount">₹{p.amount}</span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}