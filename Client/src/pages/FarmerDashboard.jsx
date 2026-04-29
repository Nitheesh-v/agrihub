import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getFarmerContracts } from "@/services/contractService";
import { Link } from "react-router-dom";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');
.fd{font-family:'DM Sans',sans-serif;}
.fd-banner{border-radius:24px;padding:2rem 2rem 1.75rem;margin-bottom:2rem;position:relative;overflow:hidden;background:linear-gradient(135deg,#052e16 0%,#14532d 50%,#166534 100%);animation:fdUp .5s cubic-bezier(.22,1,.36,1) both;}
.fd-banner::before{content:'';position:absolute;top:-60px;right:-60px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(74,222,128,.12) 0%,transparent 70%);}
.fd-banner::after{content:'🌾';position:absolute;right:1.5rem;bottom:.5rem;font-size:5rem;opacity:.08;line-height:1;}
@keyframes fdUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.fd-banner-eyebrow{font-size:.72rem;font-weight:500;color:#4ade80;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.375rem;}
.fd-banner-name{font-family:'Playfair Display',serif;font-size:2rem;color:#fff;margin:0 0 6px;line-height:1.2;}
.fd-banner-sub{font-size:.85rem;color:rgba(255,255,255,.55);margin-bottom:1.5rem;}
.fd-banner-btns{display:flex;gap:.75rem;flex-wrap:wrap;}
.fd-btn-primary{padding:.6rem 1.25rem;border-radius:10px;background:#fff;color:#166534;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:600;border:none;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all .2s;box-shadow:0 4px 12px rgba(0,0,0,.15);}
.fd-btn-primary:hover{background:#f0fdf4;transform:translateY(-1px);}
.fd-btn-outline{padding:.6rem 1.25rem;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;font-family:'DM Sans',sans-serif;font-size:.85rem;font-weight:500;border:1.5px solid rgba(255,255,255,.25);cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px;transition:all .2s;}
.fd-btn-outline:hover{background:rgba(255,255,255,.18);}
.fd-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-bottom:2rem;}
.fd-stat{border-radius:16px;padding:1.25rem;color:#fff;position:relative;overflow:hidden;animation:fdUp .5s cubic-bezier(.22,1,.36,1) both;cursor:default;transition:transform .2s;}
.fd-stat:hover{transform:translateY(-3px);}
.fd-stat::after{content:'';position:absolute;right:-16px;bottom:-16px;width:64px;height:64px;border-radius:50%;background:rgba(255,255,255,.07);}
.fd-stat-icon{width:32px;height:32px;border-radius:8px;background:rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center;margin-bottom:.875rem;}
.fd-stat-val{font-size:1.6rem;font-weight:700;margin-bottom:2px;line-height:1;}
.fd-stat-label{font-size:.75rem;opacity:.75;}
.fd-stat.green{background:linear-gradient(135deg,#16a34a,#15803d);}
.fd-stat.amber{background:linear-gradient(135deg,#d97706,#b45309);}
.fd-stat.blue{background:linear-gradient(135deg,#2563eb,#1d4ed8);}
.fd-stat.teal{background:linear-gradient(135deg,#0d9488,#0f766e);}
.fd-section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:1.25rem;}
.fd-section-title{font-family:'Playfair Display',serif;font-size:1.2rem;color:#14532d;}
.fd-view-all{font-size:.82rem;font-weight:500;color:#16a34a;text-decoration:none;transition:color .15s;}
.fd-view-all:hover{color:#14532d;}
.fd-empty{border-radius:20px;background:#fff;border:2px dashed #bbf7d0;padding:3rem 2rem;text-align:center;}
.fd-empty-icon{width:64px;height:64px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.75rem;}
.fd-empty-title{font-family:'Playfair Display',serif;font-size:1.1rem;color:#14532d;margin-bottom:6px;}
.fd-empty-sub{font-size:.82rem;color:#6b7280;margin-bottom:1.25rem;}
.fd-empty-btn{display:inline-flex;align-items:center;gap:6px;padding:.6rem 1.25rem;border-radius:10px;background:linear-gradient(135deg,#14532d,#16a34a);color:#fff;font-size:.85rem;font-weight:600;text-decoration:none;border:none;cursor:pointer;box-shadow:0 4px 12px rgba(22,163,74,.3);transition:all .2s;}
.fd-empty-btn:hover{box-shadow:0 6px 20px rgba(22,163,74,.4);transform:translateY(-1px);}
.fd-contracts{display:grid;grid-template-columns:repeat(2,1fr);gap:1rem;}
.fd-contract-card{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;box-shadow:0 2px 12px rgba(0,0,0,.04);transition:all .25s cubic-bezier(.22,1,.36,1);animation:fdUp .5s cubic-bezier(.22,1,.36,1) both;}
.fd-contract-card:hover{box-shadow:0 8px 32px rgba(22,163,74,.12);transform:translateY(-3px);border-color:#bbf7d0;}
.fd-contract-strip{height:3px;background:linear-gradient(90deg,#14532d,#4ade80,#fbbf24);}
.fd-contract-body{padding:1.125rem;}
.fd-contract-top{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;}
.fd-contract-icon{width:40px;height:40px;border-radius:12px;background:#f0fdf4;border:1px solid #dcfce7;display:flex;align-items:center;justify-content:center;font-size:1.25rem;flex-shrink:0;}
.fd-contract-name{font-family:'Playfair Display',serif;font-size:.95rem;color:#111827;margin:0 0 2px;}
.fd-contract-meta{font-size:.72rem;color:#9ca3af;}
.fd-contract-badge{display:inline-flex;align-items:center;gap:4px;padding:.2rem .6rem;border-radius:20px;font-size:.68rem;font-weight:600;background:#dcfce7;color:#166534;border:1px solid #86efac;margin-left:auto;white-space:nowrap;}
.fd-contract-badge::before{content:'';width:5px;height:5px;border-radius:50%;background:#16a34a;}
.fd-payments{display:grid;grid-template-columns:repeat(3,1fr);gap:.5rem;}
.fd-payment-cell{background:#f9fafb;border-radius:10px;padding:.625rem .75rem;border:1px solid #f3f4f6;}
.fd-payment-label{font-size:.62rem;color:#9ca3af;margin-bottom:2px;}
.fd-payment-val{font-size:.875rem;font-weight:700;}
.fd-payment-val.total{color:#14532d;}
.fd-payment-val.advance{color:#15803d;}
.fd-payment-val.remaining{color:#d97706;}
@media(max-width:900px){.fd-stats{grid-template-columns:repeat(2,1fr);}}
@media(max-width:640px){.fd-stats{grid-template-columns:repeat(2,1fr);}.fd-contracts{grid-template-columns:1fr;}.fd-banner-name{font-size:1.5rem;}.fd-stat-val{font-size:1.3rem;}}
`;

const STAT_DELAY = [".1s",".2s",".3s",".4s"];

export default function FarmerDashboard() {
  const [contracts, setContracts] = useState([]);
  const { token, user } = useSelector((s) => s.auth);

  useEffect(() => { if (token) fetchContracts(); }, [token]);
  const fetchContracts = async () => {
    try { const { data } = await getFarmerContracts(token); setContracts(data); }
    catch (e) { console.error(e); }
  };

  const approved = contracts.filter((c) =>
    c.applicants?.find((a) => (a.farmer?._id || a.farmer)?.toString() === user?._id?.toString() && a.status === "approved")
  );
  const totalAdvance = approved.reduce((a, c) => a + (c.payment?.advancePaid || 0), 0);

const totalRemaining = approved.reduce((a, c) => a + (c.payment?.remainingAmount || 0), 0);

const totalEarned = approved.reduce((a, c) => {
  const history = c.paymentHistory || [];
  return a + history.reduce((sum, p) => sum + (p.amount || 0), 0);
}, 0);
 const stats = [
  { label:"Active contracts", value: approved.length, cls:"green", icon:"📋" },
  { label:"Earned income", value:`₹${totalEarned.toLocaleString()}`, cls:"teal", icon:"💸" },
  { label:"Advance received", value:`₹${totalAdvance.toLocaleString()}`, cls:"amber", icon:"💰" },
  { label:"Remaining payment", value:`₹${totalRemaining.toLocaleString()}`, cls:"blue", icon:"⏳" },
];

  const getMyStagePayments = (contract) => {
  return contract.paymentSchedule?.map((s) => ({
    stage: s.stage,
    amount: s.amount,
    status: s.status,
  })) || [];
};
  return (
    <div className="fd">
      <style>{S}</style>

      {/* Welcome banner */}
      <div className="fd-banner">
        <div className="fd-banner-eyebrow">Welcome back</div>
        <div className="fd-banner-name">{user?.name || "Farmer"} 🌱</div>
        <div className="fd-banner-sub">Here's an overview of your farming activity today</div>
        <div className="fd-banner-btns">
          <Link to="/farmer/contracts" className="fd-btn-primary">
            <svg viewBox="0 0 24 24" style={{width:14,height:14,fill:"none",stroke:"currentColor",strokeWidth:2}}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2"/></svg>
            Browse contracts
          </Link>
          <Link to="/farmer/add-crop" className="fd-btn-outline">
            <svg viewBox="0 0 24 24" style={{width:14,height:14,fill:"none",stroke:"currentColor",strokeWidth:2}}><path d="M12 5v14M5 12l7-7 7 7"/></svg>
            Add crop
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="fd-stats">
        {stats.map(({ label, value, cls, icon }, i) => (
          <div key={label} className={`fd-stat ${cls}`} style={{ animationDelay: STAT_DELAY[i] }}>
            <div className="fd-stat-icon">{icon}</div>
            <div className="fd-stat-val">{value}</div>
            <div className="fd-stat-label">{label}</div>
          </div>
        ))}
      </div>

      {/* Contracts */}
      <div className="fd-section-header">
        <div className="fd-section-title">Approved contracts</div>
        <Link to="/farmer/contracts" className="fd-view-all">View all →</Link>
      </div>

      {approved.length === 0 ? (
        <div className="fd-empty">
          <div className="fd-empty-icon">🌾</div>
          <div className="fd-empty-title">No approved contracts yet</div>
          <div className="fd-empty-sub">Browse available contracts and apply to start earning</div>
          <Link to="/farmer/contracts" className="fd-empty-btn">Browse contracts →</Link>
        </div>
      ) : (
        <div className="fd-contracts">
          {approved.map((c, i) => (
            <div key={c._id} className="fd-contract-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="fd-contract-strip" />
              <div className="fd-contract-body">
                <div className="fd-contract-top">
                  <div className="fd-contract-icon">🌿</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="fd-contract-name">{c.cropName}</div>
                    <div className="fd-contract-meta">{c.quantity} units · ₹{c.price}/unit</div>
                  </div>
                  <div className="fd-contract-badge">Approved</div>
                </div>
                <div className="fd-payments">
                  <div className="fd-payment-cell">
                    <div className="fd-payment-label">Total</div>
                    <div className="fd-payment-val total">₹{c.payment?.totalAmount ?? 0}</div>
                  </div>
                  <div className="fd-payment-cell">
                    <div className="fd-payment-label">Advance</div>
                    <div className="fd-payment-val advance">₹{c.payment?.advancePaid ?? 0}</div>
                  </div>
                  <div className="fd-payment-cell">
                    <div className="fd-payment-label">Remaining</div>
                    <div className="fd-payment-val remaining">₹{c.payment?.remainingAmount ?? 0}</div>
                  </div>
                  {c.paymentSchedule?.length > 0 && (
  <div style={{ marginTop: "10px" }}>
    <div style={{ fontSize: ".7rem", color: "#9ca3af", marginBottom: "4px" }}>
      Payment Stages
    </div>

    {c.paymentSchedule.map((s, idx) => (
      <div key={idx} style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: ".75rem",
        padding: "4px 6px",
        background: "#f9fafb",
        borderRadius: "6px",
        marginBottom: "3px"
      }}>
        <span style={{ textTransform: "capitalize" }}>{s.stage}</span>
        <span>
          ₹{s.amount} — {s.status === "paid" ? "✅ Paid" : "⏳ Pending"}
        </span>
      </div>
    ))}
  </div>
)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}