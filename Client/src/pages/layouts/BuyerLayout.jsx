import { Outlet, Link, useLocation } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Syne:wght@600;700&display=swap');

  .buyer-sidebar {
    width: 240px;
    min-height: 100vh;
    background: #fafaf9;
    border-right: 1px solid #e7e5e4;
    display: flex;
    flex-direction: column;
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

  .buyer-header {
    padding: 1.75rem 1.5rem 1.25rem;
    border-bottom: 1px solid #e7e5e4;
  }

  .buyer-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }

  .buyer-brand-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: linear-gradient(135deg, #d97706, #b45309);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(217,119,6,0.25);
  }

  .buyer-brand-name {
    font-family: 'Syne', sans-serif;
    font-size: 1.05rem;
    font-weight: 700;
    color: #1c1917;
    letter-spacing: -0.01em;
  }

  .buyer-role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    font-weight: 500;
    color: #d97706;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  .buyer-role-badge::before {
    content: '';
    display: inline-block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #d97706;
  }

  .buyer-nav {
    flex: 1;
    padding: 1rem 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .buyer-nav-section {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.65rem;
    font-weight: 600;
    color: #a8a29e;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 0.75rem 0.75rem 0.4rem;
  }

  .buyer-nav-link {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    color: #78716c;
    text-decoration: none;
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .buyer-nav-link:hover {
    color: #1c1917;
    background: #f5f5f4;
    transform: translateX(2px);
  }

  .buyer-nav-link.active {
    color: #92400e;
    background: #fef3c7;
    font-weight: 500;
    border: 1px solid #fde68a;
  }

  .nav-icon { width: 16px; height: 16px; flex-shrink: 0; }

  .buyer-cart-badge {
    margin-left: auto;
    background: #d97706;
    color: #fff;
    font-size: 0.6rem;
    font-weight: 600;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .buyer-promo-card {
    margin: 0 0.75rem 1rem;
    background: linear-gradient(135deg, #d97706, #b45309);
    border-radius: 12px;
    padding: 1rem;
    position: relative;
    overflow: hidden;
  }

  .buyer-promo-card::after {
    content: '🌾';
    position: absolute;
    right: -4px;
    bottom: -8px;
    font-size: 3rem;
    opacity: 0.2;
  }

  .buyer-promo-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 2px;
  }

  .buyer-promo-desc {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.7);
    margin-bottom: 0.6rem;
  }

  .buyer-promo-btn {
    display: inline-block;
    background: rgba(255,255,255,0.2);
    border: 1px solid rgba(255,255,255,0.3);
    border-radius: 6px;
    padding: 0.25rem 0.625rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.7rem;
    font-weight: 500;
    color: #fff;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s;
  }

  .buyer-promo-btn:hover { background: rgba(255,255,255,0.3); }

  .buyer-footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid #e7e5e4;
  }

  .buyer-user-pill {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0.6rem;
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .buyer-user-pill:hover { background: #f5f5f4; }

  .buyer-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(135deg, #d97706, #92400e);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 600;
    color: #fff;
    flex-shrink: 0;
  }

  .buyer-user-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    font-weight: 500;
    color: #1c1917;
  }

  .buyer-user-role {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.68rem;
    color: #a8a29e;
  }

 .buyer-main {
  margin-left: 240px;
  width: calc(100% - 240px);
  min-height: 100vh;
  background: #fff;
  animation: fadeIn 0.5s ease 0.2s both;
  overflow-x: hidden;
}

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .buyer-topbar {
    height: 56px;
    background: rgba(255,255,255,0.9);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid #f5f5f4;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1.5rem;
    position: sticky;
    top: 0;
    z-index: 50;
  }

  .buyer-search {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #fafaf9;
    border: 1px solid #e7e5e4;
    border-radius: 8px;
    padding: 0 0.75rem;
    height: 32px;
    width: 200px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }

  .buyer-search:focus-within {
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,0.1);
  }

  .buyer-search input {
    border: none;
    background: transparent;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.82rem;
    color: #1c1917;
    width: 100%;
  }

  .buyer-search input::placeholder { color: #a8a29e; }

  .buyer-topbar-btn {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: #fafaf9;
    border: 1px solid #e7e5e4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #78716c;
    transition: all 0.2s;
    position: relative;
  }

  .buyer-topbar-btn:hover {
    background: #f5f5f4;
    color: #1c1917;
  }

  .buyer-content { padding: 2rem; }
`;

const navItems = [
  {
    to: "/buyer/marketplace",
    label: "Marketplace",
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M2.97 1.35A1 1 0 013.73 1h8.54a1 1 0 01.76.35l2.609 3.044A1.5 1.5 0 0116 5.37v.255a2.375 2.375 0 01-4.25 1.458A2.371 2.371 0 019.875 8 2.37 2.37 0 018 7.083 2.37 2.37 0 016.125 8a2.37 2.37 0 01-1.875-.917A2.375 2.375 0 010 5.625V5.37a1.5 1.5 0 01.361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 002.75 0 .5.5 0 011 0 1.375 1.375 0 002.75 0 .5.5 0 011 0 1.375 1.375 0 102.75 0V5.37a.5.5 0 00-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 001 5.37v.255a1.375 1.375 0 002.75 0 .5.5 0 011 0zM1.5 8.5A.5.5 0 012 9v6h1v-5a1 1 0 011-1h3a1 1 0 011 1v5h6V9a.5.5 0 011 0v6h.5a.5.5 0 010 1H.5a.5.5 0 010-1H1V9a.5.5 0 01.5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3zm3 0h-2v3h2v-3z"/></svg>,
  },
  {
    to: "/buyer/cart",
    label: "Cart",
    badge: 1,
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M0 1.5A.5.5 0 01.5 1H2a.5.5 0 01.485.379L2.89 3H14.5a.5.5 0 01.491.592l-1.5 8A.5.5 0 0113 12H4a.5.5 0 01-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 01-.5-.5zM5 12a2 2 0 100 4 2 2 0 000-4zm7 0a2 2 0 100 4 2 2 0 000-4zm-7 1a1 1 0 110 2 1 1 0 010-2zm7 0a1 1 0 110 2 1 1 0 010-2z"/></svg>,
  },
  {
    to: "/buyer/orders",
    label: "Orders",
    icon: <svg className="nav-icon" viewBox="0 0 16 16" fill="currentColor"><path d="M2 1a1 1 0 011-1h10a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V1zm4 0v1h4V1H6zM3 1v14h10V1H9v1a1 1 0 01-1 1H6a1 1 0 01-1-1V1H3z"/><path d="M4.5 8a.5.5 0 000 1h7a.5.5 0 000-1h-7zm0 2.5a.5.5 0 000 1h4a.5.5 0 000-1h-4z"/></svg>,
  },
];

export default function BuyerLayout() {
  const location = useLocation();
  return (
<div style={{ display: "flex", width: "100vw", overflowX: "hidden" }}>
      <style>{styles}</style>

      <aside className="buyer-sidebar">
        <div className="buyer-header">
          <div className="buyer-brand">
            <div className="buyer-brand-icon">🛒</div>
            <span className="buyer-brand-name">AgriHub</span>
          </div>
          <div className="buyer-role-badge">Buyer Portal</div>
        </div>

        <nav className="buyer-nav">
          <div className="buyer-nav-section">Shopping</div>
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`buyer-nav-link ${location.pathname === item.to ? "active" : ""}`}
            >
              {item.icon}
              {item.label}
              {item.badge && <span className="buyer-cart-badge">{item.badge}</span>}
            </Link>
          ))}
        </nav>

        <div className="buyer-promo-card">
          <div className="buyer-promo-title">Fresh Season</div>
          <div className="buyer-promo-desc">New harvests available now</div>
          <Link to="/buyer/marketplace" className="buyer-promo-btn">Browse →</Link>
        </div>

        <div className="buyer-footer">
          <div className="buyer-user-pill">
            <div className="buyer-avatar">BU</div>
            <div>
              <div className="buyer-user-name">Buyer User</div>
              <div className="buyer-user-role">Premium Member</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="buyer-main">
        <div className="buyer-topbar">
          <div className="buyer-search">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#a8a29e">
              <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.099zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
            </svg>
            <input placeholder="Search produce..." />
          </div>
          <div className="buyer-topbar-btn">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16a2 2 0 001.985-1.75H6.015A2 2 0 008 16zm.847-13.698A5 5 0 003 7v3l-1 2h12l-1-2V7a5 5 0 00-5.153-4.698z"/></svg>
          </div>
        </div>
        <div className="buyer-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}