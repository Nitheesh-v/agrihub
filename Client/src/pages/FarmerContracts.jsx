import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getContracts, applyContract, signAgreement } from "@/services/contractService";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
.fc{font-family:'DM Sans',sans-serif;}
.fc-header{margin-bottom:1.75rem;animation:fcUp .5s cubic-bezier(.22,1,.36,1) both;}
@keyframes fcUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fc-eyebrow{font-size:.7rem;font-weight:500;color:#16a34a;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.375rem;display:flex;align-items:center;gap:6px;}
.fc-eyebrow::before{content:'';width:20px;height:1.5px;background:#16a34a;border-radius:2px;}
.fc-title{font-family:'Playfair Display',serif;font-size:1.75rem;color:#14532d;margin:0 0 4px;}
.fc-sub{font-size:.85rem;color:#6b7280;margin:0;}
.fc-filter-bar{display:flex;gap:.5rem;margin-bottom:1.5rem;flex-wrap:wrap;animation:fcUp .5s cubic-bezier(.22,1,.36,1) .1s both;}
.fc-filter-btn{padding:.4rem .875rem;border-radius:20px;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:500;border:1.5px solid #e5e7eb;background:#fff;color:#6b7280;cursor:pointer;transition:all .2s;}
.fc-filter-btn:hover,.fc-filter-btn.active{background:#f0fdf4;border-color:#16a34a;color:#166534;}
.fc-empty{text-align:center;padding:4rem 2rem;}
.fc-empty-icon{width:72px;height:72px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:2rem;}
.fc-empty-title{font-family:'Playfair Display',serif;font-size:1.1rem;color:#14532d;margin-bottom:6px;}
.fc-empty-sub{font-size:.82rem;color:#9ca3af;}
.fc-list{display:flex;flex-direction:column;gap:1rem;}
.fc-card{background:#fff;border-radius:18px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.04);transition:all .25s cubic-bezier(.22,1,.36,1);animation:fcUp .5s cubic-bezier(.22,1,.36,1) both;}
.fc-card:hover{box-shadow:0 8px 32px rgba(22,163,74,.1);transform:translateY(-2px);border-color:#d1fae5;}
.fc-card-strip{height:3px;}
.fc-card-main{padding:1.25rem;}
.fc-card-top{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1rem;}
.fc-crop-icon{width:48px;height:48px;border-radius:14px;background:linear-gradient(135deg,#f0fdf4,#dcfce7);border:1px solid #bbf7d0;display:flex;align-items:center;justify-content:center;font-size:1.5rem;flex-shrink:0;}
.fc-crop-info{flex:1;min-width:0;}
.fc-crop-name{font-family:'Playfair Display',serif;font-size:1.05rem;color:#111827;margin:0 0 4px;}
.fc-crop-meta{font-size:.78rem;color:#9ca3af;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.fc-meta-dot{width:3px;height:3px;border-radius:50%;background:#d1d5db;}
.fc-apply-btn{padding:.55rem 1.1rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;border:none;cursor:pointer;white-space:nowrap;transition:all .2s;flex-shrink:0;}
.fc-apply-btn.default{background:linear-gradient(135deg,#14532d,#16a34a);color:#fff;box-shadow:0 4px 12px rgba(22,163,74,.3);}
.fc-apply-btn.default:hover{box-shadow:0 6px 20px rgba(22,163,74,.4);transform:translateY(-1px);}
.fc-apply-btn.pending{background:#fef3c7;color:#92400e;border:1px solid #fde68a;cursor:default;}
.fc-apply-btn.approved{background:#dcfce7;color:#166534;border:1px solid #86efac;cursor:default;}
.fc-card-divider{height:1px;background:#f9fafb;margin:0 -1.25rem 1rem;}
.fc-payment-row{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:1rem;}
.fc-payment-cell{background:#f9fafb;border-radius:10px;padding:.625rem;border:1px solid #f3f4f6;}
.fc-payment-label{font-size:.62rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.06em;margin-bottom:2px;}
.fc-payment-val{font-size:.875rem;font-weight:700;}
.fc-payment-val.total{color:#14532d;}
.fc-payment-val.advance{color:#16a34a;}
.fc-payment-val.remaining{color:#d97706;}
.fc-agreement{background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:1rem;}
.fc-agreement-title{font-size:.7rem;font-weight:600;color:#92400e;text-transform:uppercase;letter-spacing:.1em;margin-bottom:.625rem;}
.fc-agreement-text{font-size:.78rem;color:#4b5563;line-height:1.6;max-height:120px;overflow-y:auto;white-space:pre-wrap;margin-bottom:.75rem;font-family:monospace;}
.fc-signed-badge{display:inline-flex;align-items:center;gap:5px;font-size:.75rem;font-weight:600;color:#166534;background:#dcfce7;border:1px solid #86efac;border-radius:20px;padding:.3rem .75rem;}
.fc-sign-btn{padding:.5rem 1rem;border-radius:10px;border:none;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;font-family:'DM Sans',sans-serif;font-size:.8rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 12px rgba(124,58,237,.3);}
.fc-sign-btn:hover{box-shadow:0 6px 20px rgba(124,58,237,.4);transform:translateY(-1px);}
@media(max-width:480px){.fc-card-top{flex-wrap:wrap;}.fc-apply-btn{width:100%;text-align:center;}.fc-payment-row{grid-template-columns:repeat(3,1fr);}.fc-title{font-size:1.4rem;}}
`;

const CROP_EMOJI = { tomato:"🍅", wheat:"🌾", rice:"🍚", corn:"🌽", cotton:"🌿", onion:"🧅", potato:"🥔" };
const getCropEmoji = (name) => {
  const lower = (name||"").toLowerCase();
  return Object.entries(CROP_EMOJI).find(([k]) => lower.includes(k))?.[1] || "🌱";
};

export default function FarmerContracts() {
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState("all");
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => { if (token) fetchContracts(); }, [token]);
  const fetchContracts = async () => {
    try { const { data } = await getContracts(token); setContracts(data); }
    catch (e) { console.error(e); }
  };

  const handleApply = async (id) => {
    try { await applyContract(id, token); fetchContracts(); }
    catch (e) { alert(e.response?.data?.message || "Error applying"); }
  };

  const handleSign = async (id) => {
    if (!window.confirm("Do you agree to all terms of this contract?")) return;
    try { await signAgreement(id, token); fetchContracts(); }
    catch { alert("Error signing"); }
  };

  const filtered = contracts.filter((c) => {
    if (filter === "all") return true;
    const myApp = c.applicants?.find((a) => (a.farmer?._id || a.farmer) === user?._id);
    if (filter === "applied") return !!myApp;
    if (filter === "approved") return myApp?.status === "approved";
    return true;
  });

  return (
    <div className="fc">
      <style>{S}</style>

      <div className="fc-header">
        <div className="fc-eyebrow">Marketplace</div>
        <h1 className="fc-title">Available Contracts</h1>
        <p className="fc-sub">{contracts.length} contract{contracts.length !== 1 ? "s" : ""} open for application</p>
      </div>

      <div className="fc-filter-bar">
        {[["all","All contracts"],["applied","Applied"],["approved","Approved"]].map(([val,label])=>(
          <button key={val} className={`fc-filter-btn ${filter===val?"active":""}`} onClick={()=>setFilter(val)}>{label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="fc-empty">
          <div className="fc-empty-icon">🌾</div>
          <div className="fc-empty-title">No contracts available</div>
          <div className="fc-empty-sub">Check back soon for new opportunities</div>
        </div>
      ) : (
        <div className="fc-list">
          {filtered.map((c, i) => {
            const myApp = c.applicants?.find((a) => (a.farmer?._id || a.farmer) === user?._id);
            const alreadyApplied = !!myApp;
            const approved = myApp?.status === "approved";

            const stripBg = approved
              ? "linear-gradient(90deg,#14532d,#4ade80)"
              : alreadyApplied
              ? "linear-gradient(90deg,#d97706,#fbbf24)"
              : "linear-gradient(90deg,#16a34a,#4ade80,#bbf7d0)";

            return (
              <div key={c._id} className="fc-card" style={{ animationDelay: `${i * 0.07}s` }}>
                <div className="fc-card-strip" style={{ background: stripBg }} />
                <div className="fc-card-main">
                  <div className="fc-card-top">
                    <div className="fc-crop-icon">{getCropEmoji(c.cropName)}</div>
                    <div className="fc-crop-info">
                      <div className="fc-crop-name">{c.cropName}</div>
                      <div className="fc-crop-meta">
                        <span>{c.quantity} units</span>
                        <span className="fc-meta-dot"/>
                        <span>₹{c.price}/unit</span>
                        {c.location && <><span className="fc-meta-dot"/><span>📍 {c.location}</span></>}
                      </div>
                    </div>
                    <button
                      className={`fc-apply-btn ${approved?"approved":alreadyApplied?"pending":"default"}`}
                      disabled={alreadyApplied}
                      onClick={() => !alreadyApplied && handleApply(c._id)}
                    >
                      {approved ? "✓ Approved" : alreadyApplied ? "⏳ Pending" : "Apply now"}
                    </button>
                  </div>

                  {approved && (
                    <>
                      <div className="fc-card-divider" />
                      <div className="fc-payment-row">
                        <div className="fc-payment-cell">
                          <div className="fc-payment-label">Total</div>
                          <div className="fc-payment-val total">₹{c.payment?.totalAmount ?? 0}</div>
                        </div>
                        <div className="fc-payment-cell">
                          <div className="fc-payment-label">Advance</div>
                          <div className="fc-payment-val advance">₹{c.payment?.advancePaid ?? 0}</div>
                        </div>
                        <div className="fc-payment-cell">
                          <div className="fc-payment-label">Remaining</div>
                          <div className="fc-payment-val remaining">₹{c.payment?.remainingAmount ?? 0}</div>
                        </div>
                      </div>

                      {approved && c.company && (
  <div style={{ marginTop: "12px", padding: "10px", background: "#f9fafb", borderRadius: "10px" }}>
    <div style={{ fontWeight: "600", marginBottom: "5px" }}>
      🏢 Company Details
    </div>

    <div>{c.company.companyDetails?.companyName || c.company.name}</div>
    <div>📞 {c.company.companyDetails?.phone}</div>
    <div>
      📍 {c.company.companyDetails?.address}, {c.company.companyDetails?.city}
    </div>
    <div>
      {c.company.companyDetails?.state} - {c.company.companyDetails?.pincode}
    </div>
    <div>✉️ {c.company.email}</div>
  </div>
)}

                      {c.agreement?.text && (
                        <div className="fc-agreement">
                          <div className="fc-agreement-title">📜 Contract Agreement</div>
                          <div className="fc-agreement-text">{c.agreement.text}</div>
                          {c.agreement.isSigned ? (
                            <span className="fc-signed-badge">
                              <svg viewBox="0 0 24 24" style={{width:12,height:12,stroke:"currentColor",fill:"none",strokeWidth:2.5}}><path d="M20 6L9 17l-5-5"/></svg>
                              Signed
                            </span>
                          ) : (
                            <button className="fc-sign-btn" onClick={() => handleSign(c._id)}>✍️ Sign agreement</button>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}