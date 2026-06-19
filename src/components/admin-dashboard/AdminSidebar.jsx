const MENU = [
  { key: 'overview',   icon: '📊', label: 'Overview' },
  { key: 'approvals',  icon: '✅', label: 'User Approvals' },
  { key: 'users',      icon: '👤', label: 'User Management' },
  { key: 'bookings',   icon: '📋', label: 'All Bookings' },
  { key: 'fleet',      icon: '🚗', label: 'Fleet Management' },
  { key: 'promotions', icon: '🎟', label: 'Promotions' },
  { key: 'disputes',   icon: '🛡', label: 'Reviews & Disputes' },
  { key: 'reports',    icon: '📈', label: 'Reports' },
];
export default function AdminSidebar({ tab, setTab, userName, initial, pendingCount, onLogout }) {
  return (
    <div className="rr-sidebar d-flex flex-column">
      <div className="d-flex align-items-center gap-2 border-bottom" style={{ padding:'16px 14px', borderColor:'#2a2a2a' }}>
        <div className="rr-sidebar-logo d-flex align-items-center justify-content-center" style={{ fontSize:14 }}>🚗</div>
        <span className="fw-bold" style={{ fontSize:12, letterSpacing:1 }}>ROADREADY</span>
      </div>
      <div className="d-flex align-items-center gap-2 border-bottom" style={{ padding:'14px', borderColor:'#2a2a2a' }}>
        <div className="rr-sidebar-avatar d-flex align-items-center justify-content-center flex-shrink-0">{initial}</div>
        <div className="text-truncate">
          <div className="fw-semibold text-truncate" style={{ fontSize:13 }}>{userName}</div>
          <div className="rr-orange" style={{ fontSize:11 }}>Administrator</div>
        </div>
      </div>

      <nav className="flex-grow-1 overflow-auto" style={{ padding:'10px 8px' }}>
        {MENU.map(m => (
          <button key={m.key} onClick={() => setTab(m.key)}
            className={`rr-nav-btn d-flex align-items-center gap-2 w-100 text-start ${tab === m.key ? 'active' : ''}`}
            style={{ padding:'10px 12px' }}>
            <span style={{ fontSize:14 }}>{m.icon}</span>
            <span className="flex-grow-1">{m.label}</span>
            {m.key === 'approvals' && pendingCount > 0 && (
              <span className="nav-badge d-flex align-items-center justify-content-center px-1">{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>

      <div className="border-top" style={{ padding:'10px 8px', borderColor:'#2a2a2a' }}>
        <button onClick={onLogout} className="rr-logout-btn d-flex align-items-center gap-2 w-100" style={{ padding:'10px 12px' }}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export { MENU };