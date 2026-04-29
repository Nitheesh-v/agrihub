import { Outlet, Link, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .admin-sidebar {
    width: 240px;
    min-height: 100vh;
    background: linear-gradient(180deg, #0f0f0f 0%, #1a1a1a 100%);
    border-right: 1px solid #2a2a2a;
    display: flex;
    flex-direction: column;
    padding: 0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    animation: slideInLeft 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }

  @keyframes slideInLeft {
    from { transform: translateX(-100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .admin-sidebar-header {
    padding: 1.75rem 1.5rem 1.25rem;
    border-bottom: 1px solid #252525;
    position: relative;
    overflow: hidden;
  }

  .admin-sidebar-header::before {
    content: '';
    position: absolute;
    top: -20px;
    right: -20px;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(220,38,38,0.15) 0%, transparent 70%);
  }

  .admin-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .admin-brand-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #dc2626, #991b1b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    box-shadow: 0 0 12px rgba(220,38,38,0.4);
  }

  .admin-brand-name {
    font-family: 'Playfair Display', serif;
    font-size: 1.1rem;
    color: #fff;
    letter-spacing: 0.01em;
  }

  .admin-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    color: #dc2626;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .admin-role-badge::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #dc2626;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .admin-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .admin-nav-section {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: #444;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.75rem 0.75rem 0.4rem;
  }

  .admin-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem 0.75rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: #888;
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }

  .admin-nav-link::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 60%;
    border-radius: 0 4px 4px 0;
    background: #dc2626;
    transition: width 0.2s ease;
  }

  .admin-nav-link:hover {
    color: #fff;
    background: rgba(255,255,255,0.05);
  }

  .admin-nav-link:hover::before { width: 3px; }

  .admin-nav-link.active {
    color: #fff;
    background: rgba(220,38,38,0.12);
    font-weight: 500;
  }

  .admin-nav-link.active::before { width: 3px; }

  .admin-nav-icon {
    width: 16px;
    height: 16px;
    opacity: 0.7;
    flex-shrink: 0;
  }

  .admin-nav-link:hover .admin-nav-icon,
  .admin-nav-link.active .admin-nav-icon { opacity: 1; }

  .admin-sidebar-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid #252525;
  }

  .admin-user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem;
    border-radius: 8px;
    background: rgba(255,255,255,0.04);
    cursor: pointer;
    transition: background 0.2s;
  }

  .admin-user-pill:hover { background: rgba(255,255,255,0.08); }

  .admin-avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: linear-gradient(135deg, #dc2626, #7f1d1d);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
  }

  .admin-user-info { flex: 1; min-width: 0; }

  .admin-user-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: #e5e5e5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-user-role {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    color: #555;
  }

  .admin-main {
    margin-left: 240px;
    min-height: 100vh;
    background: #0a0a0a;
    animation: fadeIn 0.5s ease 0.2s both;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-topbar {
    height: 56px;
    background: rgba(15,15,15,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #1e1e1e;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 1.5rem;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .admin-topbar-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255,255,255,0.05);
    border: 1px solid #2a2a2a;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #666;
    transition: all 0.2s;
  }

  .admin-topbar-btn:hover {
    background: rgba(255,255,255,0.1);
    color: #fff;
    border-color: #404040;
  }

  .admin-content { padding: 2rem; }
`;

const navItems = [
  {
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className="admin-nav-icon">
        <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 00-11.215 0c-.22.578.254 1.139.872 1.139h9.47z" />
      </svg>
    ),
    label: "Users",
    to: "/admin",
  },
];

export default function AdminLayout() {
  const location = useLocation();
  return (
    <div style={{ display: "flex", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{styles}</style>

      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-brand">
            <div className="admin-brand-icon">🛡️</div>
            <span className="admin-brand-name">AgriHub</span>
          </div>
          <div className="admin-role-badge">Admin Console</div>
        </div>

        <nav className="admin-nav">
          <div className="admin-nav-section">Management</div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`admin-nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-pill">
            <div className="admin-avatar">AD</div>
            <div className="admin-user-info">
              <div className="admin-user-name">Administrator</div>
              <div className="admin-user-role">Super Admin</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar">
          <div className="admin-topbar-btn" title="Notifications">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16a2 2 0 001.985-1.75H6.015A2 2 0 008 16zm.847-13.698A5 5 0 003 7v3l-1 2h12l-1-2V7a5 5 0 00-5.153-4.698z" />
            </svg>
          </div>
          <div className="admin-topbar-btn" title="Settings">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 4.754a3.246 3.246 0 100 6.492 3.246 3.246 0 000-6.492zM5.754 8a2.246 2.246 0 114.492 0 2.246 2.246 0 01-4.492 0z" />
              <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 01-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 01-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 01.52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 011.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 011.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 01.52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 01-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 01-1.255-.52l-.094-.319z" />
            </svg>
          </div>
        </div>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}