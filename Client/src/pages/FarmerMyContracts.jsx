import { useEffect, useState } from "react";
import { getFarmerContracts } from "@/services/contractService";
import { useSelector } from "react-redux";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
.fmc{font-family:'DM Sans',sans-serif;}
.fmc-header{margin-bottom:1.75rem;animation:fmcUp .5s cubic-bezier(.22,1,.36,1) both;}
@keyframes fmcUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.fmc-eyebrow{font-size:.7rem;font-weight:500;color:#16a34a;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.375rem;display:flex;align-items:center;gap:6px;}
.fmc-eyebrow::before{content:'';width:20px;height:1.5px;background:#16a34a;border-radius:2px;}
.fmc-title{font-family:'Playfair Display',serif;font-size:1.75rem;color:#14532d;margin:0 0 4px;}
.fmc-sub{font-size:.85rem;color:#6b7280;}
.fmc-summary{display:grid;grid-template-columns:repeat(3,1fr);gap:.875rem;margin-bottom:1.75rem;animation:fmcUp .5s cubic-bezier(.22,1,.36,1) .1s both;}
.fmc-sum-card{background:#fff;border-radius:14px;padding:1rem;border:1px solid #f3f4f6;text-align:center;box-shadow:0 1px 6px rgba(0,0,0,.04);}
.fmc-sum-num{font-size:1.5rem;font-weight:700;margin-bottom:2px;}
.fmc-sum-label{font-size:.7rem;color:#9ca3af;text-transform:uppercase;letter-spacing:.07em;}
.fmc-sum-card.approved .fmc-sum-num{color:#16a34a;}
.fmc-sum-card.pending .fmc-sum-num{color:#d97706;}
.fmc-sum-card.total .fmc-sum-num{color:#14532d;}
.fmc-empty{text-align:center;padding:4rem 2rem;background:#fff;border-radius:20px;border:2px dashed #dcfce7;}
.fmc-empty-icon{width:64px;height:64px;border-radius:50%;background:#f0fdf4;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.75rem;}
.fmc-empty-title{font-family:'Playfair Display',serif;font-size:1rem;color:#14532d;margin-bottom:4px;}
.fmc-empty-sub{font-size:.82rem;color:#9ca3af;}
.fmc-list{display:flex;flex-direction:column;gap:.875rem;}
.fmc-card{background:#fff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 2px 10px rgba(0,0,0,.04);transition:all .25s cubic-bezier(.22,1,.36,1);animation:fmcUp .5s cubic-bezier(.22,1,.36,1) both;}
.fmc-card:hover{box-shadow:0 6px 24px rgba(22,163,74,.09);transform:translateY(-2px);}
.fmc-strip{height:3px;}
.fmc-inner{display:flex;align-items:center;gap:1rem;padding:1.125rem 1.25rem;}
.fmc-icon{width:46px;height:46px;border-radius:13px;background:#f0fdf4;border:1px solid #dcfce7;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
.fmc-info{flex:1;min-width:0;}
.fmc-crop-name{font-family:'Playfair Display',serif;font-size:.95rem;color:#111827;margin:0 0 3px;}
.fmc-crop-meta{font-size:.75rem;color:#9ca3af;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.fmc-meta-sep{width:3px;height:3px;border-radius:50%;background:#e5e7eb;}
.fmc-badge{display:inline-flex;align-items:center;gap:5px;padding:.3rem .75rem;border-radius:20px;font-size:.72rem;font-weight:600;border:1px solid;flex-shrink:0;}
.fmc-badge::before{content:'';width:5px;height:5px;border-radius:50%;}
.fmc-badge.approved{background:#dcfce7;color:#166534;border-color:#86efac;}
.fmc-badge.approved::before{background:#16a34a;animation:fmcPulse 2s infinite;}
.fmc-badge.pending{background:#fef3c7;color:#92400e;border-color:#fde68a;}
.fmc-badge.pending::before{background:#d97706;}
.fmc-badge.rejected{background:#fee2e2;color:#991b1b;border-color:#fca5a5;}
.fmc-badge.rejected::before{background:#dc2626;}
@keyframes fmcPulse{0%,100%{opacity:1}50%{opacity:.4}}
.fmc-expand{padding:0 1.25rem 1.125rem;}
.fmc-expand-divider{height:1px;background:#f9fafb;margin-bottom:1rem;}
.fmc-payments{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;margin-bottom:.875rem;}
.fmc-payment-cell{background:#f9fafb;border-radius:10px;padding:.625rem .75rem;border:1px solid #f3f4f6;}
.fmc-payment-label{font-size:.62rem;color:#9ca3af;margin-bottom:2px;text-transform:uppercase;letter-spacing:.06em;}
.fmc-payment-val{font-size:.875rem;font-weight:700;}
.fmc-payment-val.total{color:#14532d;}
.fmc-payment-val.advance{color:#16a34a;}
.fmc-payment-val.remaining{color:#d97706;}
.fmc-company-row{display:flex;align-items:center;gap:8px;padding:.625rem .875rem;background:#f9fafb;border-radius:10px;font-size:.8rem;color:#6b7280;border:1px solid #f3f4f6;}
.fmc-company-label{font-weight:500;color:#374151;}
@media(max-width:480px){.fmc-summary{grid-template-columns:repeat(3,1fr);}.fmc-inner{flex-wrap:wrap;}.fmc-badge{margin-left:0;}.fmc-title{font-size:1.4rem;}}
`;

const CROP_EMOJI = { tomato:"🍅", wheat:"🌾", rice:"🍚", corn:"🌽", cotton:"🌿", onion:"🧅", potato:"🥔" };
const getCropEmoji = (name) => Object.entries(CROP_EMOJI).find(([k]) => (name||"").toLowerCase().includes(k))?.[1] || "🌱";

export default function FarmerMyContracts() {
  const [contracts, setContracts] = useState([]);
  const [expanded, setExpanded] = useState({});
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => { fetchContracts(); }, []);
  const fetchContracts = async () => {
    try { const { data } = await getFarmerContracts(token); setContracts(data); }
    catch (e) { console.error(e); }
  };

  const myContracts = contracts.map((c) => ({
    ...c,
    myApp: c.applicants?.find((a) => (a.farmer?._id || a.farmer) === user?._id),
  }));

  const approvedCount = myContracts.filter(c => c.myApp?.status === "approved").length;
  const pendingCount = myContracts.filter(c => c.myApp?.status === "pending").length;

  const statusGradient = { approved:"linear-gradient(90deg,#14532d,#4ade80)", pending:"linear-gradient(90deg,#d97706,#fbbf24)", rejected:"linear-gradient(90deg,#dc2626,#f87171)" };

  return (
    <div className="fmc">
      <style>{S}</style>

      <div className="fmc-header">
        <div className="fmc-eyebrow">My Applications</div>
        <h1 className="fmc-title">My Contracts</h1>
        <p className="fmc-sub">{myContracts.length} contract{myContracts.length !== 1 ? "s" : ""} applied</p>
      </div>

      <div className="fmc-summary">
        <div className="fmc-sum-card total">
          <div className="fmc-sum-num">{myContracts.length}</div>
          <div className="fmc-sum-label">Total applied</div>
        </div>
        <div className="fmc-sum-card approved">
          <div className="fmc-sum-num">{approvedCount}</div>
          <div className="fmc-sum-label">Approved</div>
        </div>
        <div className="fmc-sum-card pending">
          <div className="fmc-sum-num">{pendingCount}</div>
          <div className="fmc-sum-label">Pending</div>
        </div>
      </div>

      {myContracts.length === 0 ? (
        <div className="fmc-empty">
          <div className="fmc-empty-icon">📋</div>
          <div className="fmc-empty-title">No contracts applied yet</div>
          <div className="fmc-empty-sub">Browse available contracts and apply to get started</div>
        </div>
      ) : (
        <div className="fmc-list">
          {myContracts.map((c, i) => {
            const status = c.myApp?.status ?? "unknown";
            const isExpanded = expanded[c._id];
            const isApproved = status === "approved";

            return (
              <div key={c._id} className="fmc-card" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="fmc-strip" style={{ background: statusGradient[status] || "linear-gradient(90deg,#9ca3af,#d1d5db)" }} />
                <div
                  className="fmc-inner"
                  style={{ cursor: isApproved ? "pointer" : "default" }}
                  onClick={() => isApproved && setExpanded(p => ({ ...p, [c._id]: !p[c._id] }))}
                >
                  <div className="fmc-icon">{getCropEmoji(c.cropType || c.cropName)}</div>
                  <div className="fmc-info">
                    <div className="fmc-crop-name">{c.cropType || c.cropName}</div>
                    <div className="fmc-crop-meta">
                      <span>{c.company?.name || "Company"}</span>
                      <span className="fmc-meta-sep"/>
                      <span>Status: <strong style={{color:"#374151"}}>{c.status}</strong></span>
                      {c.quantity && <><span className="fmc-meta-sep"/><span>{c.quantity} units</span></>}
                    </div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <span className={`fmc-badge ${status}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                    {isApproved && (
                      <svg viewBox="0 0 24 24" style={{width:16,height:16,stroke:"#9ca3af",fill:"none",strokeWidth:2,transition:"transform .2s",transform:isExpanded?"rotate(180deg)":"none"}}>
                        <path d="M6 9l6 6 6-6"/>
                      </svg>
                    )}
                  </div>
                </div>

                {isExpanded && isApproved && (
                  <div className="fmc-expand">
                    <div className="fmc-expand-divider"/>
                    <div className="fmc-payments">
                      <div className="fmc-payment-cell">
                        <div className="fmc-payment-label">Total</div>
                        <div className="fmc-payment-val total">₹{c.payment?.totalAmount ?? 0}</div>
                      </div>
                      <div className="fmc-payment-cell">
                        <div className="fmc-payment-label">Advance</div>
                        <div className="fmc-payment-val advance">₹{c.payment?.advancePaid ?? 0}</div>
                      </div>
                     <div className="fmc-payments">
  <div className="fmc-payment-cell">
    <div className="fmc-payment-label">Total Value</div>
    <div className="fmc-payment-val total">
      ₹{c.payment?.totalAmount ?? 0}
    </div>
  </div>

  <div className="fmc-payment-cell">
    <div className="fmc-payment-label">Funding Given</div>
    <div className="fmc-payment-val advance">
      ₹{c.payment?.advancePaid ?? 0}
    </div>
  </div>

  <div className="fmc-payment-cell">
    <div className="fmc-payment-label">Final Payable</div>
    <div className="fmc-payment-val remaining">
      ₹{
        c.status === "completed"
          ? c.payment?.finalPayable ?? 0
          : (c.payment?.totalAmount ?? 0) - (c.payment?.advancePaid ?? 0)
      }
    </div>
  </div>
</div>
                    </div>
                    {c.company?.name && (
                      <div className="fmc-company-row">
                        🏢 <span className="fmc-company-label">Company:</span> {c.company.name}
                      </div>

                      
                    )}
                    {c.payment?.advancePaid > 0 && (
  <div className="mt-2 text-xs text-gray-500">
    ⚠ Advance will be deducted from final settlement
  </div>
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