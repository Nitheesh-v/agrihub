import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUsers, verifyUser } from "@/services/adminService";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@600&display=swap');

  .admin-panel { font-family: 'DM Sans', sans-serif; }

  .admin-panel-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 2rem;
    animation: fadeDown 0.5s ease both;
  }

  @keyframes fadeDown {
    from { opacity: 0; transform: translateY(-12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-panel-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.75rem;
    font-weight: 600;
    color: #f5f5f5;
    margin: 0 0 4px;
  }

  .admin-panel-subtitle {
    font-size: 0.82rem;
    color: #666;
    margin: 0;
  }

  .admin-stats-bar {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.75rem;
    animation: fadeDown 0.5s ease 0.1s both;
  }

  .admin-stat-card {
    flex: 1;
    background: #161616;
    border: 1px solid #252525;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    transition: border-color 0.2s, transform 0.2s;
    cursor: default;
  }

  .admin-stat-card:hover {
    border-color: #333;
    transform: translateY(-2px);
  }

  .admin-stat-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #555;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.375rem;
  }

  .admin-stat-num {
    font-size: 1.6rem;
    font-weight: 600;
    color: #e5e5e5;
    line-height: 1;
    margin-bottom: 2px;
  }

  .admin-stat-change {
    font-size: 0.72rem;
    color: #4ade80;
  }

  .admin-stat-card.red .admin-stat-num { color: #f87171; }
  .admin-stat-card.amber .admin-stat-num { color: #fbbf24; }
  .admin-stat-card.red .admin-stat-change { color: #f87171; }
  .admin-stat-card.amber .admin-stat-change { color: #fbbf24; }

  .admin-table-wrapper {
    background: #111;
    border: 1px solid #1e1e1e;
    border-radius: 16px;
    overflow: hidden;
    animation: fadeUp 0.5s ease 0.2s both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .admin-table-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #1e1e1e;
  }

  .admin-table-toolbar-title {
    font-size: 0.875rem;
    font-weight: 500;
    color: #d4d4d4;
  }

  .admin-search-input {
    display: flex;
    align-items: center;
    gap: 8px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 0 0.75rem;
    height: 32px;
    transition: border-color 0.2s;
  }

  .admin-search-input:focus-within {
    border-color: #dc2626;
  }

  .admin-search-input input {
    background: transparent;
    border: none;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.8rem;
    color: #d4d4d4;
    width: 160px;
  }

  .admin-search-input input::placeholder { color: #444; }

  .admin-user-row {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr auto;
    gap: 1rem;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #171717;
    transition: background 0.15s;
    animation: rowIn 0.4s ease both;
  }

  @keyframes rowIn {
    from { opacity: 0; transform: translateX(-8px); }
    to { opacity: 1; transform: translateX(0); }
  }

  .admin-user-row:last-child { border-bottom: none; }
  .admin-user-row:hover { background: rgba(255,255,255,0.02); }

  .admin-table-head {
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 1fr 1.5fr auto;
    gap: 1rem;
    padding: 0.625rem 1.25rem;
    border-bottom: 1px solid #1e1e1e;
    background: #0d0d0d;
  }

  .admin-th {
    font-size: 0.65rem;
    font-weight: 600;
    color: #444;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .admin-user-identity { display: flex; align-items: center; gap: 10px; }

  .admin-user-avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, #7f1d1d, #991b1b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.72rem;
    font-weight: 600;
    color: #fca5a5;
    flex-shrink: 0;
    border: 1.5px solid #2a1010;
  }

  .admin-user-name-text {
    font-size: 0.875rem;
    font-weight: 500;
    color: #e5e5e5;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .admin-cell-text {
    font-size: 0.82rem;
    color: #888;
  }

  .admin-role-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .admin-role-chip.farmer { background: rgba(74,222,128,0.1); color: #4ade80; border: 1px solid rgba(74,222,128,0.2); }
  .admin-role-chip.buyer { background: rgba(251,191,36,0.1); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2); }
  .admin-role-chip.company { background: rgba(96,165,250,0.1); color: #60a5fa; border: 1px solid rgba(96,165,250,0.2); }
  .admin-role-chip.admin { background: rgba(220,38,38,0.1); color: #f87171; border: 1px solid rgba(220,38,38,0.2); }

  .admin-status-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.2rem 0.5rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 500;
    text-transform: capitalize;
  }

  .admin-status-chip::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .admin-status-chip.pending {
    background: rgba(251,191,36,0.1);
    color: #fbbf24;
    border: 1px solid rgba(251,191,36,0.15);
  }
  .admin-status-chip.pending::before { background: #fbbf24; }

  .admin-status-chip.verified {
    background: rgba(74,222,128,0.1);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.15);
  }
  .admin-status-chip.verified::before { background: #4ade80; animation: pulse 2s infinite; }

  .admin-status-chip.rejected {
    background: rgba(220,38,38,0.1);
    color: #f87171;
    border: 1px solid rgba(220,38,38,0.15);
  }
  .admin-status-chip.rejected::before { background: #f87171; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .admin-actions { display: flex; gap: 6px; }

  .admin-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0.35rem 0.7rem;
    border-radius: 7px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.75rem;
    font-weight: 500;
    border: none;
    cursor: pointer;
    transition: all 0.2s cubic-bezier(0.22, 1, 0.36, 1);
    white-space: nowrap;
  }

  .admin-btn:active { transform: scale(0.95); }

  .admin-btn-approve {
    background: rgba(74,222,128,0.12);
    color: #4ade80;
    border: 1px solid rgba(74,222,128,0.25);
  }

  .admin-btn-approve:hover {
    background: rgba(74,222,128,0.2);
    box-shadow: 0 0 12px rgba(74,222,128,0.15);
  }

  .admin-btn-reject {
    background: rgba(220,38,38,0.12);
    color: #f87171;
    border: 1px solid rgba(220,38,38,0.25);
  }

  .admin-btn-reject:hover {
    background: rgba(220,38,38,0.2);
    box-shadow: 0 0 12px rgba(220,38,38,0.15);
  }

  .admin-doc-link {
    color: #60a5fa;
    font-size: 0.8rem;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 3px;
    transition: color 0.15s;
  }

  .admin-doc-link:hover { color: #93c5fd; }

  .admin-empty {
    padding: 3rem;
    text-align: center;
    color: #444;
    font-size: 0.875rem;
  }

  .admin-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    gap: 8px;
    color: #555;
    font-size: 0.875rem;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #333;
    border-top-color: #dc2626;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 10px;
    padding: 0.75rem 1rem;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem;
    color: #e5e5e5;
    display: flex;
    align-items: center;
    gap: 8px;
    z-index: 999;
    animation: toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }

  @keyframes toastIn {
    from { opacity: 0; transform: translateY(12px) scale(0.95); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .toast.success { border-color: rgba(74,222,128,0.3); }
  .toast.error { border-color: rgba(220,38,38,0.3); }
`;

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => { fetchUsers(); }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await getUsers(token);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await verifyUser({ userId: id, status }, token);
      showToast(`User ${status === "verified" ? "approved ✓" : "rejected"}`, status === "verified" ? "success" : "error");
      fetchUsers();
    } catch {
      showToast("Action failed", "error");
    }
  };

  const initials = (name) => name ? name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "??";

  const filtered = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const pending = users.filter(u => (u.verification?.status || "pending") === "pending").length;
  const verified = users.filter(u => u.verification?.status === "verified").length;
  const rejected = users.filter(u => u.verification?.status === "rejected").length;

  return (
    <div className="admin-panel">
      <style>{styles}</style>

      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      <div className="admin-panel-header">
        <div>
          <h1 className="admin-panel-title">User Verification</h1>
          <p className="admin-panel-subtitle">Review and manage user verification requests</p>
        </div>
      </div>

      <div className="admin-stats-bar">
        <div className="admin-stat-card">
          <div className="admin-stat-label">Total Users</div>
          <div className="admin-stat-num">{users.length}</div>
          <div className="admin-stat-change">↑ All time</div>
        </div>
        <div className="admin-stat-card amber">
          <div className="admin-stat-label">Pending</div>
          <div className="admin-stat-num">{pending}</div>
          <div className="admin-stat-change">Needs review</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-label">Verified</div>
          <div className="admin-stat-num">{verified}</div>
          <div className="admin-stat-change">↑ Active</div>
        </div>
        <div className="admin-stat-card red">
          <div className="admin-stat-label">Rejected</div>
          <div className="admin-stat-num">{rejected}</div>
          <div className="admin-stat-change">Declined</div>
        </div>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-toolbar">
          <span className="admin-table-toolbar-title">All Users ({filtered.length})</span>
          <div className="admin-search-input">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="#444">
              <path d="M11.742 10.344a6.5 6.5 0 10-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 001.415-1.414l-3.85-3.85a1.007 1.007 0 00-.115-.099zM12 6.5a5.5 5.5 0 11-11 0 5.5 5.5 0 0111 0z"/>
            </svg>
            <input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-table-head">
          <div className="admin-th">User</div>
          <div className="admin-th">Email</div>
          <div className="admin-th">Role</div>
          <div className="admin-th">Status</div>
          <div className="admin-th">Document</div>
          <div className="admin-th">Actions</div>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="spinner" /> Loading users...
          </div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty">No users found.</div>
        ) : (
          filtered.map((u, i) => {
            const status = u.verification?.status || "pending";
            return (
              <div key={u._id} className="admin-user-row" style={{ animationDelay: `${i * 0.05}s` }}>
                <div className="admin-user-identity">
                  <div className="admin-user-avatar">{initials(u.name)}</div>
                  <span className="admin-user-name-text">{u.name}</span>
                </div>
                <div className="admin-cell-text">{u.email}</div>
                <div>
                  <span className={`admin-role-chip ${u.role}`}>{u.role}</span>
                </div>
                <div>
                  <span className={`admin-status-chip ${status}`}>{status}</span>
                </div>
                <div>
                  {u.verification?.documentUrl ? (
                    <a href={u.verification.documentUrl} target="_blank" rel="noreferrer" className="admin-doc-link">
                      <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor"><path d="M4.5 3a2.5 2.5 0 015 0v9a1.5 1.5 0 01-3 0V5a.5.5 0 011 0v7a.5.5 0 001 0V3a1.5 1.5 0 00-3 0v9a2.5 2.5 0 005 0V5a.5.5 0 011 0v7a3.5 3.5 0 01-7 0V3z"/></svg>
                      View doc
                    </a>
                  ) : (
                    <span className="admin-cell-text" style={{ fontStyle: "italic" }}>Not submitted</span>
                  )}
                </div>
                <div className="admin-actions">
                  <button className="admin-btn admin-btn-approve" onClick={() => handleVerify(u._id, "verified")}>
                    ✓ Approve
                  </button>
                  <button className="admin-btn admin-btn-reject" onClick={() => handleVerify(u._id, "rejected")}>
                    ✕ Reject
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}