import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";

const styles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  overflow-x: hidden;
}

.fl-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.55);z-index:90;backdrop-filter:blur(2px);}
.fl-overlay.open{display:block;}

.farmer-sidebar{
  width:240px;min-height:100vh;
  background:linear-gradient(180deg,#052e16 0%,#064e3b 60%,#065f46 100%);
  display:flex;flex-direction:column;position:fixed;top:0;left:0;z-index:100;overflow:hidden;
  transition:transform 0.35s cubic-bezier(0.22,1,0.36,1);
}
.farmer-sidebar::before{content:'';position:absolute;bottom:-60px;right:-60px;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,rgba(74,222,128,0.08) 0%,transparent 70%);pointer-events:none;}

.farmer-header{padding:1.75rem 1.5rem 1.25rem;border-bottom:1px solid rgba(255,255,255,0.08);position:relative;}
.farmer-brand{display:flex;align-items:center;gap:10px;margin-bottom:4px;}
.farmer-brand-icon{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#16a34a,#15803d);display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 0 16px rgba(74,222,128,0.3);}
.farmer-brand-name{font-family:'Playfair Display',serif;font-size:1.1rem;color:#ecfdf5;}
.farmer-role-badge{display:inline-flex;align-items:center;gap:5px;font-family:'DM Sans',sans-serif;font-size:0.68rem;font-weight:500;color:#4ade80;letter-spacing:0.12em;text-transform:uppercase;}
.farmer-role-badge::before{content:'';display:inline-block;width:5px;height:5px;border-radius:50%;background:#4ade80;animation:fPulse 2s infinite;}
@keyframes fPulse{0%,100%{opacity:1;box-shadow:0 0 0 0 rgba(74,222,128,0.4);}50%{opacity:0.7;box-shadow:0 0 0 4px rgba(74,222,128,0);}}

.farmer-nav{flex:1;padding:1rem 0.75rem;display:flex;flex-direction:column;gap:2px;}
.farmer-nav-section{font-family:'DM Sans',sans-serif;font-size:0.65rem;font-weight:600;color:rgba(255,255,255,0.25);letter-spacing:0.14em;text-transform:uppercase;padding:0.75rem 0.75rem 0.4rem;}
.farmer-nav-link{display:flex;align-items:center;gap:10px;padding:0.65rem 0.75rem;border-radius:10px;font-family:'DM Sans',sans-serif;font-size:0.875rem;font-weight:400;color:rgba(255,255,255,0.55);text-decoration:none;transition:all 0.25s cubic-bezier(0.22,1,0.36,1);position:relative;}
.farmer-nav-link::after{content:'';position:absolute;inset:0;border-radius:10px;background:linear-gradient(135deg,rgba(74,222,128,0.15),rgba(16,185,129,0.08));opacity:0;transition:opacity 0.25s;}
.farmer-nav-link:hover{color:#fff;transform:translateX(3px);}
.farmer-nav-link:hover::after{opacity:1;}
.farmer-nav-link.active{color:#4ade80;font-weight:500;background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.2);}
.farmer-nav-link.active::after{opacity:0;}
.nav-icon{width:16px;height:16px;flex-shrink:0;}

.farmer-stats-card{margin:0 0.75rem 1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:0.875rem;}
.farmer-stats-label{font-family:'DM Sans',sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.35);text-transform:uppercase;letter-spacing:0.1em;margin-bottom:0.5rem;}
.farmer-stats-row{display:flex;gap:0.5rem;}
.farmer-stat{flex:1;text-align:center;padding:0.4rem;background:rgba(255,255,255,0.04);border-radius:8px;}
.farmer-stat-num{font-family:'DM Sans',sans-serif;font-size:1.1rem;font-weight:600;color:#4ade80;}
.farmer-stat-desc{font-family:'DM Sans',sans-serif;font-size:0.62rem;color:rgba(255,255,255,0.3);}

.farmer-footer{padding:1rem 1.25rem;border-top:1px solid rgba(255,255,255,0.08);}
.farmer-user-pill{display:flex;align-items:center;gap:10px;padding:0.6rem;border-radius:10px;cursor:pointer;transition:background 0.2s;}
.farmer-user-pill:hover{background:rgba(255,255,255,0.06);}
.farmer-avatar{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,#16a34a,#166534);display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:600;color:#fff;flex-shrink:0;border:1.5px solid rgba(74,222,128,0.3);}
.farmer-user-name{font-family:'DM Sans',sans-serif;font-size:0.8rem;font-weight:500;color:#d1fae5;}
.farmer-user-role{font-family:'DM Sans',sans-serif;font-size:0.68rem;color:rgba(255,255,255,0.3);}

.farmer-main{margin-left:240px;min-height:100vh;background:#f0fdf4;width:calc(100vw - 240px);animation:fadeIn 0.5s ease 0.2s both;box-sizing:border-box;}
@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}

.farmer-topbar{height:56px;background:rgba(255,255,255,0.85);backdrop-filter:blur(12px);border-bottom:1px solid #dcfce7;display:flex;align-items:center;justify-content:space-between;padding:0 1.5rem;position:sticky;top:0;z-index:50;}
.farmer-topbar-left{display:flex;align-items:center;gap:12px;}
.farmer-topbar-title{font-family:'DM Sans',sans-serif;font-size:0.875rem;font-weight:500;color:#166534;}
.farmer-topbar-actions{display:flex;gap:8px;}
.farmer-topbar-btn{width:32px;height:32px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#16a34a;transition:all 0.2s;}
.farmer-topbar-btn:hover{background:#dcfce7;border-color:#4ade80;}

.hamburger-btn{display:none;width:36px;height:36px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;align-items:center;justify-content:center;cursor:pointer;color:#16a34a;flex-shrink:0;}
.sidebar-close-btn{display:none;position:absolute;top:1rem;right:1rem;width:28px;height:28px;border-radius:6px;background:rgba(255,255,255,0.1);border:none;color:#fff;cursor:pointer;font-size:1rem;align-items:center;justify-content:center;z-index:2;}

.farmer-content{padding:1.5rem;width:100%;box-sizing:border-box;}

@media(max-width:768px){
  .farmer-sidebar{transform:translateX(-100%);box-shadow:4px 0 24px rgba(0,0,0,0.3);}
  .farmer-sidebar.open{transform:translateX(0);}
  .farmer-main{margin-left:0!important;width:100vw!important;}
  .hamburger-btn{display:flex;}
  .sidebar-close-btn{display:flex;}
  .farmer-content{padding:1rem;}
  .farmer-topbar{padding:0 1rem;}
}
@media(max-width:480px){
  .farmer-topbar-title{font-size:0.78rem;}
  .farmer-content{padding:0.75rem;}
}
`;

const navItems = [
  { to:"/farmer/dashboard", label:"Dashboard", icon:<svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/><path d="M0 10a8 8 0 1115.547 2.661c-.442 1.253-1.845 1.602-2.932 1.25C11.309 13.488 9.475 13 8 13c-1.474 0-3.31.488-4.615.911-1.087.352-2.49.003-2.932-1.25A7.988 7.988 0 010 10z"/></svg> },
  { to:"/farmer/contracts", label:"Contracts", icon:<svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M5 4a.5.5 0 000 1h6a.5.5 0 000-1H5zm-.5 2.5A.5.5 0 015 6h6a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM5 8a.5.5 0 000 1h6a.5.5 0 000-1H5zm0 2a.5.5 0 000 1h3a.5.5 0 000-1H5z"/><path d="M2 2a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V2zm10-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V2a1 1 0 00-1-1z"/></svg> },
  { to:"/farmer/my-contracts", label:"My Contracts", icon:<svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3a1.5 1.5 0 011.5 1.5v3a1.5 1.5 0 01-1.5 1.5h-3A1.5 1.5 0 019 13.5v-3z"/></svg> },
  { to:"/farmer/add-crop", label:"Add Crop", icon:<svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/></svg> },
];

export default function FarmerLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  return (
    <>
      <style>{styles}</style>
      <div className="flex w-screen h-screen" style={{fontFamily:"'DM Sans',sans-serif", minHeight: '100vh',     // ✅ changed
    overflow: 'auto'}}>
        <div className={`fl-overlay ${open?"open":""}`} onClick={()=>setOpen(false)}/>
        <aside className={`farmer-sidebar ${open?"open":""}`}>
          <button className="sidebar-close-btn" onClick={()=>setOpen(false)}>✕</button>
          <div className="farmer-header">
            <div className="farmer-brand"><div className="farmer-brand-icon">🌱</div><span className="farmer-brand-name">AgriHub</span></div>
            <div className="farmer-role-badge">Farmer Portal</div>
          </div>
          <nav className="farmer-nav">
            <div className="farmer-nav-section">Navigation</div>
            {navItems.map(item=>(
              <Link key={item.to} to={item.to} className={`farmer-nav-link ${location.pathname===item.to?"active":""}`} onClick={()=>setOpen(false)}>
                {item.icon}{item.label}
              </Link>
            ))}
          </nav>
          <div className="farmer-stats-card">
            <div className="farmer-stats-label">Season Overview</div>
            <div className="farmer-stats-row">
              <div className="farmer-stat"><div className="farmer-stat-num">12</div><div className="farmer-stat-desc">Active</div></div>
              <div className="farmer-stat"><div className="farmer-stat-num">3</div><div className="farmer-stat-desc">Pending</div></div>
              <div className="farmer-stat"><div className="farmer-stat-num">₹2L</div><div className="farmer-stat-desc">Earned</div></div>
            </div>
          </div>
          <div className="farmer-footer">
            <div className="farmer-user-pill">
              <div className="farmer-avatar">FK</div>
              <div><div className="farmer-user-name">Admin</div><div className="farmer-user-role">Verified Farmer</div></div>
            </div>
          </div>
        </aside>
        <main className="farmer-main">
          <div className="farmer-topbar">
            <div className="farmer-topbar-left">
              <button className="hamburger-btn" onClick={()=>setOpen(true)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              </button>
              <span className="farmer-topbar-title">🌿 Farmer Dashboard</span>
            </div>
            <div className="farmer-topbar-actions">
              <div className="farmer-topbar-btn"><svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16a2 2 0 001.985-1.75H6.015A2 2 0 008 16zm.847-13.698A5 5 0 003 7v3l-1 2h12l-1-2V7a5 5 0 00-5.153-4.698z"/></svg></div>
            </div>
          </div>
          <div className="farmer-content"><Outlet/></div>
        </main>
      </div>
    </>
  );
}