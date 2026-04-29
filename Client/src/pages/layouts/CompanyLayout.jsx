import { Outlet, Link, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap');

  .company-sidebar {
    width: 240px;
    min-height: 100vh;
    background: linear-gradient(180deg, #0c1e3d 0%, #0f2952 50%, #0d3068 100%);
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    overflow: hidden;
    animation: slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .company-sidebar::before {
    content: '';
    position: absolute;
    top: -80px;
    right: -80px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%);
    pointer-events: none;
  }

  .company-sidebar::after {
    content: '';
    position: absolute;
    bottom: 10%;
    left: -60px;
    width: 160px;
    height: 160px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(96,165,250,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .company-header {
    padding: 1.75rem 1.5rem 1.25rem;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    position: relative;
  }

  .company-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .company-brand-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 0 20px rgba(59,130,246,0.4);
  }

  .company-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    color: #eff6ff;
    letter-spacing: 0.01em;
  }

  .company-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    color: #60a5fa;
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  .company-role-badge::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #60a5fa;
    animation: pulse 2.5s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.75); }
  }

  .company-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .company-nav-section {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: rgba(255,255,255,0.2);
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.75rem 0.75rem 0.4rem;
  }

  .company-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: all 0.25s cubic-bezier(0.22, 1, 0.36, 1);
    position: relative;
    overflow: hidden;
  }

  .company-nav-link::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 10px;
    background: linear-gradient(90deg, rgba(59,130,246,0.2), rgba(37,99,235,0.1));
    opacity: 0;
    transition: opacity 0.25s;
  }

  .company-nav-link:hover {
    color: #fff;
    transform: translateX(3px);
  }

  .company-nav-link:hover::before { opacity: 1; }

  .company-nav-link.active {
    color: #93c5fd;
    font-weight: 500;
    background: rgba(59,130,246,0.15);
    border: 1px solid rgba(59,130,246,0.25);
  }

  .company-nav-link.active::before { opacity: 0; }

  .nav-icon { width: 16px; height: 16px; flex-shrink: 0; }

  .company-kpi-grid {
    margin: 0 0.75rem 1rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }

  .company-kpi {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 0.625rem;
    text-align: center;
    transition: background 0.2s;
  }

  .company-kpi:hover { background: rgba(255,255,255,0.08); }

  .company-kpi-num {
    font-family: 'DM Sans', sans-serif;
    font-size: 1.1rem;
    font-weight: 600;
    color: #60a5fa;
  }

  .company-kpi-label {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.62rem;
    color: rgba(255,255,255,0.3);
    margin-top: 1px;
  }

  .company-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid rgba(255,255,255,0.08);
  }

  .company-user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .company-user-pill:hover { background: rgba(255,255,255,0.06); }

  .company-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
    border: 1.5px solid rgba(96,165,250,0.3);
  }

  .company-user-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: #dbeafe;
  }

  .company-user-role {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    color: rgba(255,255,255,0.3);
  }

  .company-main {
  margin-left: 240px;
  width: calc(100% - 240px);
  min-height: 100vh;
  background: #f8faff;
  animation: fadeIn 0.5s ease 0.2s both;
  overflow-x: hidden;
}

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .company-topbar {
    height: 56px;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #e0eaff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .company-topbar-title {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    color: #1e3a8a;
  }

  .company-topbar-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #2563eb;
    transition: all 0.2s;
  }

  .company-topbar-btn:hover {
    background: #dbeafe;
    border-color: #60a5fa;
  }

  .company-content { padding: 2rem; }
`;

const navItems = [
  {
    to: "/company/dashboard",
    label: "Dashboard",
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M0 0h1v15h15v1H0V0zm14.817 3.113a.5.5 0 01.07.704l-4.5 5.5a.5.5 0 01-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 01-.808-.588l4-5.5a.5.5 0 01.758-.06l2.609 2.61 4.15-5.073a.5.5 0 01.704-.07z"/></svg>,
  },
  {
    to: "/company/create-contract",
    label: "Create Contract",
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/></svg>,
  },
  {
    to: "/company/contracts",
    label: "Contracts",
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M5 4a.5.5 0 000 1h6a.5.5 0 000-1H5zm-.5 2.5A.5.5 0 015 6h6a.5.5 0 010 1H5a.5.5 0 01-.5-.5zM5 8a.5.5 0 000 1h6a.5.5 0 000-1H5zm0 2a.5.5 0 000 1h3a.5.5 0 000-1H5z"/><path d="M2 2a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V2zm10-1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V2a1 1 0 00-1-1z"/></svg>,
  },
];

export default function CompanyLayout() {
  const location = useLocation();
  return (
    <div style={{ display: "flex", width: "100vw", overflowX: "hidden" }}>
      <style>{styles}</style>

      <aside className="company-sidebar">
        <div className="company-header">
          <div className="company-brand">
            <div className="company-brand-icon">🏢</div>
            <span className="company-brand-name">AgriHub</span>
          </div>
          <div className="company-role-badge">Company Portal</div>
        </div>

        <nav className="company-nav">
          <div className="company-nav-section">Operations</div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`company-nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="company-kpi-grid">
          {[
            { num: "01", label: "Contracts" },
            { num: "₹1L", label: "Volume" },
            { num: "92%", label: "Fulfilled" },
            { num: "18", label: "Farmers" },
          ].map((k) => (
            <div key={k.label} className="company-kpi">
              <div className="company-kpi-num">{k.num}</div>
              <div className="company-kpi-label">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="company-footer">
          <div className="company-user-pill">
            <div className="company-avatar">CO</div>
            <div>
              <div className="company-user-name">FASSAI</div>
              <div className="company-user-role">Verified Company</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="company-main">
        <div className="company-topbar">
          <span className="company-topbar-title">🏢 Company Dashboard</span>
          <div style={{ display: "flex", gap: 8 }}>
            <div className="company-topbar-btn">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16a2 2 0 001.985-1.75H6.015A2 2 0 008 16zm.847-13.698A5 5 0 003 7v3l-1 2h12l-1-2V7a5 5 0 00-5.153-4.698z"/></svg>
            </div>
          </div>
        </div>
        <div className="company-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}