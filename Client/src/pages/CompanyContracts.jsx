import { useEffect, useState } from "react";
import { getCompanyContracts, approveFarmer, payAdvance, createInstallmentOrder, downloadAgreement, signAgreement, finalPayment, payStage } from "@/services/contractService";
import { useSelector } from "react-redux";
import axios from "axios";
import API from "@/services/api";


const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
.cc{font-family:'DM Sans',sans-serif;}
.cc-header{margin-bottom:1.75rem;animation:ccUp .5s cubic-bezier(.22,1,.36,1) both;}
@keyframes ccUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.cc-eyebrow{font-size:.7rem;font-weight:500;color:#2563eb;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.375rem;display:flex;align-items:center;gap:6px;}
.cc-eyebrow::before{content:'';width:20px;height:1.5px;background:#2563eb;border-radius:2px;}
.cc-title{font-family:'DM Serif Display',serif;font-size:1.75rem;color:#1e3a8a;margin:0 0 4px;}
.cc-sub{font-size:.85rem;color:#6b7280;}
.cc-empty{text-align:center;padding:4rem 2rem;background:#fff;border-radius:20px;border:2px dashed #bfdbfe;}
.cc-empty-icon{width:72px;height:72px;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2rem;}
.cc-empty-title{font-family:'DM Serif Display',serif;font-size:1.1rem;color:#1e3a8a;margin-bottom:4px;}
.cc-empty-sub{font-size:.82rem;color:#94a3b8;}
.cc-list{display:flex;flex-direction:column;gap:1.25rem;}
.cc-card{background:#fff;border-radius:20px;border:1px solid #dbeafe;overflow:hidden;box-shadow:0 2px 12px rgba(37,99,235,.06);transition:box-shadow .25s;animation:ccUp .5s cubic-bezier(.22,1,.36,1) both;}
.cc-card:hover{box-shadow:0 8px 32px rgba(37,99,235,.1);}
.cc-strip{height:3px;background:linear-gradient(90deg,#1e3a8a,#3b82f6,#93c5fd);}
.cc-card-head{display:flex;align-items:center;gap:1rem;padding:1.25rem;cursor:pointer;}
.cc-card-head:hover{background:#fafbff;}
.cc-head-icon{width:48px;height:48px;border-radius:14px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;}
.cc-head-info{flex:1;}
.cc-head-name{font-family:'DM Serif Display',serif;font-size:1.05rem;color:#1e3a8a;margin:0 0 4px;}
.cc-head-meta{font-size:.775rem;color:#94a3b8;}
.cc-head-right{display:flex;align-items:center;gap:.75rem;}
.cc-badge{display:inline-flex;align-items:center;gap:4px;padding:.25rem .625rem;border-radius:20px;font-size:.7rem;font-weight:600;border:1px solid;}
.cc-badge.approved{background:#dcfce7;color:#166534;border-color:#86efac;}
.cc-badge.pending{background:#fef3c7;color:#92400e;border-color:#fde68a;}
.cc-badge.active{background:#dbeafe;color:#1e40af;border-color:#93c5fd;}
.cc-chevron{width:18px;height:18px;stroke:#94a3b8;transition:transform .25s;flex-shrink:0;}
.cc-payments{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;padding:0 1.25rem 1.25rem;}
.cc-payment-cell{background:#f8faff;border-radius:12px;padding:.875rem;border:1px solid #e0eaff;}
.cc-payment-label{font-size:.65rem;color:#94a3b8;text-transform:uppercase;letter-spacing:.08em;margin-bottom:4px;}
.cc-payment-val{font-size:1rem;font-weight:700;}
.cc-payment-val.total{color:#1e3a8a;}
.cc-payment-val.paid{color:#059669;}
.cc-payment-val.remaining{color:#d97706;}
.cc-actions{display:flex;gap:.5rem;flex-wrap:wrap;padding:0 1.25rem 1.25rem;}
.cc-action-btn{display:inline-flex;align-items:center;gap:6px;padding:.5rem .875rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;border:1.5px solid;cursor:pointer;transition:all .2s;white-space:nowrap;}
.cc-action-btn:hover{transform:translateY(-1px);}
.cc-action-btn:active{transform:scale(.97);}
.cc-action-btn.pay-advance{background:#fef3c7;color:#92400e;border-color:#fde68a;}
.cc-action-btn.pay-advance:hover{background:#fde68a;}
.cc-action-btn.installment{background:#dcfce7;color:#166534;border-color:#86efac;}
.cc-action-btn.installment:hover{background:#bbf7d0;}
.cc-action-btn.sign{background:#ede9fe;color:#5b21b6;border-color:#c4b5fd;}
.cc-action-btn.sign:hover{background:#ddd6fe;}
.cc-action-btn.download{background:#f1f5f9;color:#475569;border-color:#e2e8f0;}
.cc-action-btn.download:hover{background:#e2e8f0;}
.cc-expanded{padding:0 1.25rem 1.25rem;border-top:1px solid #f1f5f9;animation:ccFade .3s ease both;}
@keyframes ccFade{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.cc-section-label{font-size:.68rem;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:.12em;margin:1rem 0 .625rem;}
.cc-applicant-row{display:flex;align-items:center;justify-content:space-between;padding:.75rem .875rem;background:#fafbff;border-radius:12px;border:1px solid #e0eaff;margin-bottom:.5rem;}
.cc-applicant-row:last-child{margin-bottom:0;}
.cc-applicant-identity{display:flex;align-items:center;gap:.75rem;}
.cc-applicant-avatar{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:.72rem;font-weight:700;color:#fff;flex-shrink:0;}
.cc-applicant-name{font-size:.85rem;font-weight:500;color:#1e293b;margin:0 0 2px;}
.cc-applicant-email{font-size:.72rem;color:#94a3b8;}
.cc-approve-btn{padding:.375rem .75rem;border-radius:8px;border:none;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;font-family:'DM Sans',sans-serif;font-size:.75rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 3px 8px rgba(37,99,235,.3);}
.cc-approve-btn:hover{box-shadow:0 4px 14px rgba(37,99,235,.4);transform:translateY(-1px);}
.cc-approve-btn:disabled{background:#dbeafe;color:#93c5fd;box-shadow:none;cursor:default;transform:none;}
.cc-history-row{display:flex;justify-content:space-between;align-items:center;padding:.5rem .875rem;background:#fffbeb;border-radius:10px;border:1px solid #fde68a;margin-bottom:.375rem;}
.cc-history-type{font-size:.8rem;font-weight:500;color:#92400e;text-transform:capitalize;}
.cc-history-amount{font-size:.875rem;font-weight:700;color:#78350f;}
@media(max-width:640px){.cc-actions{flex-direction:column;}.cc-action-btn{width:100%;justify-content:center;}.cc-payments{grid-template-columns:repeat(3,1fr);}.cc-head-right{flex-direction:column;align-items:flex-end;}.cc-title{font-size:1.4rem;}}
`;

const CROP_EMOJI = { tomato: "🍅", wheat: "🌾", rice: "🍚", corn: "🌽", cotton: "🌿", onion: "🧅", potato: "🥔" };
const getCropEmoji = (name) => Object.entries(CROP_EMOJI).find(([k]) => (name || "").toLowerCase().includes(k))?.[1] || "🌱";

const initials = (name) => (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

export default function CompanyContracts() {
  const [contracts, setContracts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const { token } = useSelector((s) => s.auth);

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
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, amount: order.amount, currency: "INR", order_id: order.id,
        handler: async (r) => {
          await API.post("/api/contracts/verify-payment", { contractId: contract._id, amount, razorpay_payment_id: r.razorpay_payment_id, razorpay_order_id: r.razorpay_order_id, razorpay_signature: r.razorpay_signature }, { headers: { Authorization: `Bearer ${token}` } });
          fetchContracts();
        },
      };
      new window.Razorpay(options).open();
    } catch { alert("Payment failed"); }
  };

  const handleInstallment = async (contract) => {
    try {
      const amount = Number(prompt("Enter installment amount"));
      if (!amount || amount <= 0) { alert("Invalid amount"); return; }
      const { data: order } = await createInstallmentOrder({ contractId: contract._id, amount }, token);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY, amount: order.amount, currency: "INR", order_id: order.id,
        handler: async (response) => {
          await API.post(
            "/api/contracts/verify-installment",
            {
              contractId: contract._id,
              amount,

              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fetchContracts();
        },
      };
      if (amount > contract.payment.remainingAmount) {
        alert("Cannot pay more than remaining amount");
        return;
      }
      new window.Razorpay(options).open();
    } catch (error) { console.log(error.response?.data || error.message); alert("Payment failed ❌"); }
  };

const handleFinalPay = async (contract) => {
  try {
    const { data } = await API.post(
      "/api/contracts/final/create",
      { contractId: contract._id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,

      handler: async (response) => {
        await API.post(
          "/api/contracts/final/verify",
          {
            contractId: contract._id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        alert("Final payment successful ✅");
        fetchContracts();
      },
    };

    new window.Razorpay(options).open();

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert(err.response?.data?.message || "Final payment failed ❌");
  }
};
  const handleSign = async (id) => {
    try { await signAgreement(id, token); fetchContracts(); }
    catch { alert("Error signing"); }
  };

  const handleDownload = async (id) => {
    try {
      const res = await downloadAgreement(id, token);
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a"); a.href = url; a.setAttribute("download", "agreement.pdf");
      document.body.appendChild(a); a.click();
    } catch { alert("Download failed"); }
  };

const handleStagePayment = async (contractId, stage) => {
  try {
    if (!contractId || !stage) {
      alert("Invalid contract or stage");
      return;
    }

    const cleanStage = stage.trim().toLowerCase();

    console.log("🚀 Stage Sent:", cleanStage);

    // ✅ CREATE ORDER
    const { data } = await API.post(
      "/api/contracts/stage/create",
      { contractId, stage: cleanStage },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      amount: data.order.amount,
      currency: "INR",
      order_id: data.order.id,

      handler: async function (response) {
        try {
          console.log("✅ Payment Success:", response);

          // ✅ VERIFY
          await API.post(
            "/api/contracts/stage/verify",
            {
              contractId,
              stage: cleanStage,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          alert(`✅ ${cleanStage} funded successfully`);
          fetchContracts();

        } catch (err) {
          console.error("❌ VERIFY ERROR:", err.response?.data || err.message);
          alert(err.response?.data?.message || "Verification failed ❌");
        }
      },
    };

    new window.Razorpay(options).open();

  } catch (err) {
    console.error("❌ CREATE ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Payment failed ❌");
  }
};


return (
  <div className="cc">
    <style>{S}</style>

    <div className="cc-header">
      <div className="cc-eyebrow">Contract management</div>
      <h1 className="cc-title">My Contracts</h1>
      <p className="cc-sub">
        {contracts.length} active contract{contracts.length !== 1 ? "s" : ""}
      </p>
    </div>

    {contracts.length === 0 ? (
      <div className="cc-empty">
        <div className="cc-empty-icon">📋</div>
        <div className="cc-empty-title">No contracts yet</div>
        <div className="cc-empty-sub">
          Create your first contract to start connecting with farmers
        </div>
      </div>
    ) : (
      <div className="cc-list">
        {contracts.map((c, i) => {
          const isExpanded = expanded[c._id];

          const allStagesPaid =
            c.paymentSchedule?.length > 0 &&
            c.paymentSchedule.every((s) => s.status === "paid");

          // ✅ CHECK FINAL ALREADY PAID
          const isFinalPaid = c.paymentHistory?.some(
            (p) => p.type === "final"
          );

          return (
            <div
              key={c._id}
              className="cc-card"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="cc-strip" />

              {/* HEADER */}
              <div
                className="cc-card-head"
                onClick={() =>
                  setExpanded((p) => ({ ...p, [c._id]: !p[c._id] }))
                }
              >
                <div className="cc-head-icon">
                  {getCropEmoji(c.cropName)}
                </div>

                <div className="cc-head-info">
                  <div className="cc-head-name">{c.cropName}</div>
                  <div className="cc-head-meta">
                    {c.location} · {c.quantity} units · ₹{c.price}/unit ·{" "}
                    {c.applicants?.length ?? 0} applicants
                  </div>
                </div>

                <div className="cc-head-right">
                  <span className={`cc-badge ${c.status}`}>
                    {c.status?.charAt(0).toUpperCase() +
                      c.status?.slice(1)}
                  </span>
                </div>
              </div>

              {/* PAYMENT SUMMARY */}
              <div className="cc-payments">
                <div className="cc-payment-cell">
                  <div className="cc-payment-label">Total value</div>
                  <div className="cc-payment-val total">
                    ₹{c.payment?.totalAmount ?? 0}
                  </div>
                </div>

                <div className="cc-payment-cell">
                  <div className="cc-payment-label">Funded</div>
                  <div className="cc-payment-val paid">
                    ₹{c.payment?.fundedAmount ?? 0}
                  </div>
                </div>

                <div className="cc-payment-cell">
                  <div className="cc-payment-label">Final Payable</div>
                  <div className="cc-payment-val remaining">
                    ₹{Math.max(c.payment?.finalPayable ?? 0, 0)}
                  </div>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="cc-actions">
                {!c.agreement?.companySigned && (
                  <button
                    className="cc-action-btn sign"
                    onClick={() => handleSign(c._id)}
                  >
                    ✍️ Sign agreement
                  </button>
                )}

                <button
                  className="cc-action-btn download"
                  onClick={() => handleDownload(c._id)}
                >
                  📥 Download PDF
                </button>
              </div>

              {/* EXPANDED */}
              {isExpanded && (
                <div className="cc-expanded">

                  {/* FINANCIAL BREAKDOWN */}
                  <div className="cc-section-label">Financial Breakdown</div>

                  <div className="cc-payment-cell">
                    <div className="cc-payment-label">Crop Total Price</div>
                    <div className="cc-payment-val total">
                      ₹{c.payment?.totalAmount ?? 0}
                    </div>
                  </div>

                  <div className="cc-payment-cell">
                    <div className="cc-payment-label">Company Investment</div>
                    <div className="cc-payment-val paid">
                      ₹{c.payment?.fundedAmount ?? 0}
                    </div>
                  </div>

                  <div className="cc-payment-cell">
                    <div className="cc-payment-label">
                      Final Payable (After Investment)
                    </div>
                    <div className="cc-payment-val remaining">
                      ₹{Math.max(c.payment?.finalPayable ?? 0, 0)}
                    </div>
                  </div>

                  {/* PAYMENT SCHEDULE */}
                  <div className="cc-section-label">Payment Schedule</div>

                  {c.paymentSchedule?.map((stage) => (
                    <div
                      key={stage.stage}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "10px",
                        marginBottom: "8px",
                        background: "#f8faff",
                        border: "1px solid #e0eaff",
                        borderRadius: "10px",
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: "600" }}>
                          {stage.stage}

                          {stage.status === "pending" && (
                            <button
                              className="cc-action-btn installment"
                              onClick={() =>
                                handleStagePayment(
                                  c._id,
                                  stage.stage?.toLowerCase().trim()
                                )
                              }
                            >
                              💰 Fund Stage
                            </button>
                          )}
                        </div>

                        <div style={{ fontSize: "0.8rem" }}>
                          ₹{stage.amount}
                        </div>
                      </div>

                      <span className={`cc-badge ${stage.status}`}>
                        {stage.status}
                      </span>
                    </div>
                  ))}

                  {/* ✅ FINAL PAYMENT BUTTON FIX */}
                  {allStagesPaid &&
                    !isFinalPaid &&
                    c.payment?.finalPayable > 0 && (
                      <button
                        className="cc-action-btn pay-advance"
                        onClick={() => handleFinalPay(c)}
                      >
                        💵 Pay Final ₹{c.payment.finalPayable}
                      </button>
                  )}

                  {/* APPLICANTS */}
                  <div className="cc-section-label">
                    Applicants ({c.applicants?.length ?? 0})
                  </div>

                  {c.applicants?.length === 0 ? (
                    <p style={{ fontSize: ".82rem", color: "#94a3b8" }}>
                      No applicants yet
                    </p>
                  ) : (
                    c.applicants.map((a) => (
                      <div key={a._id} className="cc-applicant-row">
                        <div className="cc-applicant-identity">
                          <div className="cc-applicant-avatar">
                            {initials(a.farmer?.name)}
                          </div>
                          <div>
                            <div className="cc-applicant-name">
                              {a.farmer?.name}
                            </div>
                            <div className="cc-applicant-email">
                              {a.farmer?.email}
                            </div>
                          </div>
                        </div>

                        <button
                          className="cc-approve-btn"
                          disabled={a.status === "approved"}
                          onClick={() =>
                            handleApprove(c._id, a.farmer._id)
                          }
                        >
                          {a.status === "approved"
                            ? "Approved ✓"
                            : "Approve"}
                        </button>
                      </div>
                    ))
                  )}

                  {/* PAYMENT HISTORY (NO DUPLICATE FINAL) */}
                  {c.paymentHistory?.length > 0 && (
                    <>
                      <div className="cc-section-label">
                        Payment history
                      </div>

                      {[...new Map(
                        c.paymentHistory.map(p => [p.type, p])
                      ).values()].map((p, idx) => (
                        <div key={idx} className="cc-history-row">
                          <span>
                            {p.type === "final"
                              ? "Final Crop Payment"
                              : `Stage: ${p.type}`}
                          </span>
                          <span>₹{p.amount}</span>
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