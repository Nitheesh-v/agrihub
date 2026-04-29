import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API from "@/services/api";

const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');
.cd{font-family:'DM Sans',sans-serif;}
.cd-header{margin-bottom:1.75rem;animation:cdUp .5s cubic-bezier(.22,1,.36,1) both;}
@keyframes cdUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
.cd-eyebrow{font-size:.7rem;font-weight:500;color:#2563eb;text-transform:uppercase;letter-spacing:.12em;margin-bottom:.375rem;display:flex;align-items:center;gap:6px;}
.cd-eyebrow::before{content:'';width:20px;height:1.5px;background:#2563eb;border-radius:2px;}
.cd-title{font-family:'DM Serif Display',serif;font-size:1.75rem;color:#1e3a8a;margin:0 0 4px;}
.cd-sub{font-size:.85rem;color:#6b7280;}
.cd-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;margin-bottom:2rem;}
.cd-stat{border-radius:16px;padding:1.25rem;color:#fff;position:relative;overflow:hidden;animation:cdUp .5s cubic-bezier(.22,1,.36,1) both;transition:transform .2s;cursor:default;}
.cd-stat:hover{transform:translateY(-3px);}
.cd-stat::after{content:'';position:absolute;right:-20px;bottom:-20px;width:80px;height:80px;border-radius:50%;background:rgba(255,255,255,.08);}
.cd-stat-emoji{font-size:1.5rem;margin-bottom:.75rem;}
.cd-stat-val{font-size:1.75rem;font-weight:700;line-height:1;margin-bottom:4px;}
.cd-stat-label{font-size:.75rem;opacity:.75;}
.cd-stat.blue{background:linear-gradient(135deg,#2563eb,#1d4ed8);}
.cd-stat.amber{background:linear-gradient(135deg,#d97706,#b45309);}
.cd-stat.green{background:linear-gradient(135deg,#059669,#047857);}
.cd-section-title{font-family:'DM Serif Display',serif;font-size:1.15rem;color:#1e3a8a;margin-bottom:1.25rem;}
.cd-contracts{display:flex;flex-direction:column;gap:1.25rem;}
.cd-contract-card{background:#fff;border-radius:18px;border:1px solid #dbeafe;overflow:hidden;box-shadow:0 2px 12px rgba(37,99,235,.06);transition:all .25s cubic-bezier(.22,1,.36,1);animation:cdUp .5s cubic-bezier(.22,1,.36,1) both;}
.cd-contract-card:hover{box-shadow:0 8px 32px rgba(37,99,235,.1);transform:translateY(-2px);border-color:#bfdbfe;}
.cd-contract-strip{height:3px;background:linear-gradient(90deg,#1e3a8a,#3b82f6,#93c5fd);}
.cd-contract-head{display:flex;align-items:center;gap:1rem;padding:1.25rem;}
.cd-contract-icon{width:46px;height:46px;border-radius:13px;background:#eff6ff;border:1px solid #bfdbfe;display:flex;align-items:center;justify-content:center;font-size:1.4rem;flex-shrink:0;}
.cd-contract-name{font-family:'DM Serif Display',serif;font-size:1rem;color:#1e3a8a;margin:0 0 3px;}
.cd-contract-meta{font-size:.75rem;color:#94a3b8;}
.cd-applicant-count{margin-left:auto;display:flex;align-items:center;gap:6px;font-size:.78rem;font-weight:600;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;border-radius:20px;padding:.3rem .75rem;flex-shrink:0;}
.cd-applicants-divider{height:1px;background:#f8faff;}
.cd-applicant-row{display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.25rem;transition:background .15s;}
.cd-applicant-row:hover{background:#fafcff;}
.cd-applicant-row:not(:last-child){border-bottom:1px solid #f1f5f9;}
.cd-applicant-identity{display:flex;align-items:center;gap:.75rem;}
.cd-applicant-avatar{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:700;color:#fff;flex-shrink:0;}
.cd-applicant-name{font-size:.875rem;font-weight:500;color:#1e293b;margin:0 0 2px;}
.cd-applicant-email{font-size:.72rem;color:#94a3b8;}
.cd-applicant-actions{display:flex;align-items:center;gap:.5rem;}
.cd-status-badge{display:inline-flex;align-items:center;gap:4px;padding:.25rem .625rem;border-radius:20px;font-size:.7rem;font-weight:600;border:1px solid;}
.cd-status-badge::before{content:'';width:5px;height:5px;border-radius:50%;}
.cd-status-badge.approved{background:#dcfce7;color:#166534;border-color:#86efac;}
.cd-status-badge.approved::before{background:#16a34a;}
.cd-status-badge.pending{background:#fef3c7;color:#92400e;border-color:#fde68a;}
.cd-status-badge.pending::before{background:#d97706;animation:cdPulse 1.5s infinite;}
@keyframes cdPulse{0%,100%{opacity:1}50%{opacity:.3}}
.cd-approve-btn{padding:.4rem .875rem;border-radius:8px;border:none;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;font-family:'DM Sans',sans-serif;font-size:.78rem;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 3px 10px rgba(37,99,235,.3);}
.cd-approve-btn:hover{box-shadow:0 5px 16px rgba(37,99,235,.4);transform:translateY(-1px);}
.cd-approve-btn:active{transform:scale(.97);}
.cd-empty{text-align:center;padding:4rem 2rem;background:#fff;border-radius:20px;border:2px dashed #bfdbfe;}
.cd-empty-icon{width:64px;height:64px;border-radius:50%;background:#eff6ff;display:flex;align-items:center;justify-content:center;margin:0 auto 1rem;font-size:1.75rem;}
.cd-empty-title{font-family:'DM Serif Display',serif;font-size:1rem;color:#1e3a8a;margin-bottom:4px;}
.cd-empty-sub{font-size:.82rem;color:#94a3b8;}
@media(max-width:640px){.cd-stats{grid-template-columns:repeat(3,1fr);}.cd-stat-val{font-size:1.3rem;}.cd-applicant-row{flex-wrap:wrap;gap:.5rem;}.cd-applicant-actions{width:100%;justify-content:flex-end;}.cd-title{font-size:1.4rem;}}
`;

export default function CompanyDashboard() {
  const { token } = useSelector((s) => s.auth);
  const [contracts, setContracts] = useState([]);

  useEffect(() => { fetchContracts(); }, [token]);
  const fetchContracts = async () => {
    const { data } = await API.get("/api/contracts/company", { headers: { Authorization: `Bearer ${token}` } });
    setContracts(data);
  };

  const approve = async (contractId, farmerId) => {
    await API.put("/api/contracts/approve", { contractId, farmerId }, { headers: { Authorization: `Bearer ${token}` } });
    fetchContracts();
  };

  const totalPending = contracts.reduce((a, c) => a + (c.applicants?.filter(x => x.status === "pending").length ?? 0), 0);
  const totalApproved = contracts.reduce((a, c) => a + (c.applicants?.filter(x => x.status === "approved").length ?? 0), 0);

  const initials = (name) => (name || "?").split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="cd">
      <style>{S}</style>

      <div className="cd-header">
        <div className="cd-eyebrow">Overview</div>
        <h1 className="cd-title">Company Dashboard</h1>
        <p className="cd-sub">Manage your contracts and farmer approvals</p>
      </div>

      <div className="cd-stats">
        {[
          { label:"Total contracts", value: contracts.length, cls:"blue", emoji:"📋" },
          { label:"Pending approvals", value: totalPending, cls:"amber", emoji:"⏳" },
          { label:"Approved farmers", value: totalApproved, cls:"green", emoji:"✅" },
        ].map(({ label, value, cls, emoji }, i) => (
          <div key={label} className={`cd-stat ${cls}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="cd-stat-emoji">{emoji}</div>
            <div className="cd-stat-val">{value}</div>
            <div className="cd-stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="cd-section-title">Contract Applications</div>

      {contracts.length === 0 ? (
        <div className="cd-empty">
          <div className="cd-empty-icon">📋</div>
          <div className="cd-empty-title">No contracts yet</div>
          <div className="cd-empty-sub">Create your first contract to start receiving farmer applications</div>
        </div>
      ) : (
        <div className="cd-contracts">
          {contracts.map((c, i) => (
            <div key={c._id} className="cd-contract-card" style={{ animationDelay: `${i * 0.07}s` }}>
              <div className="cd-contract-strip" />
              <div className="cd-contract-head">
                <div className="cd-contract-icon">🌱</div>
                <div>
                  <div className="cd-contract-name">{c.cropType || c.cropName}</div>
                  <div className="cd-contract-meta">{c.quantity} units · ₹{c.price}/unit{c.location ? ` · ${c.location}` : ""}</div>
                </div>
                <div style={{ fontSize: ".75rem", color: "#64748b", marginTop: "4px" }}>
  📍 {c.company?.companyDetails?.city}, {c.company?.companyDetails?.state}
</div>
                <div className="cd-applicant-count">
                  <svg viewBox="0 0 24 24" style={{width:12,height:12,fill:"currentColor"}}><path d="M12 12a5 5 0 110-10 5 5 0 010 10zm-6 8a6 6 0 1112 0H6z"/></svg>
                  {c.applicants?.length ?? 0} applicants
                </div>
              </div>

              <div className="cd-applicants-divider" />

              {c.applicants?.length === 0 ? (
                <div style={{ padding:"1rem 1.25rem", fontSize:".82rem", color:"#94a3b8", fontStyle:"italic" }}>No applicants yet</div>
              ) : (
                c.applicants?.map((a) => (
                  <div key={a._id} className="cd-applicant-row">
                    <div className="cd-applicant-identity">
                      <div className="cd-applicant-avatar">{initials(a.farmer?.name)}</div>
                      <div>
                        <div className="cd-applicant-name">{a.farmer?.name}</div>
                        <div className="cd-applicant-email">{a.farmer?.email}</div>
                      </div>
                    </div>
                    <div className="cd-applicant-actions">
                      <span className={`cd-status-badge ${a.status}`}>{a.status}</span>
                      {a.status === "pending" && (
                        <button className="cd-approve-btn" onClick={() => approve(c._id, a.farmer._id)}>
                          Approve
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}