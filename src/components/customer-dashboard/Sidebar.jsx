const SIDEBAR_WIDTH = 170;

const MENU = [
  { key: 'browse', icon: '🚗', label: 'Browse Cars' },
  { key: 'reservations', icon: '📋', label: 'My Reservations' },
  { key: 'billing', icon: '💳', label: 'Billing & Payments' },
  { key: 'reviews', icon: '⭐', label: 'My Reviews' },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar({ tab, setTab, userName, firstInitial, onLogout, mobileOpen, closeMobile }) {
  return (
    <>
      {/* Overlay — blocks background when drawer is open */}
      <div
        className={`rr-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={closeMobile}
      />

      <div className={`rr-sidebar ${mobileOpen ? 'rr-sidebar-open' : ''}`}>
        {/* Header row */}
        <div style={{
          padding: '16px 14px',
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 28, height: 28, background: '#e85d24', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
            }}>🚗</div>
            <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
          </div>
          {/* Close X — only visible on mobile via CSS */}
          <button className="rr-sidebar-close" onClick={closeMobile} aria-label="Close menu">×</button>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: '#e85d24', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0,
            }}>{firstInitial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userName}
              </div>
              <div style={{ color: '#e85d24', fontSize: 11 }}>Customer</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', overflowY: 'auto' }}>
          {MENU.map(m => (
            <button
              key={m.key}
              onClick={() => { setTab(m.key); closeMobile?.(); }}
              className={`rr-nav-btn ${tab === m.key ? 'active' : ''}`}
            >
              <span style={{ fontSize: 15 }}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
          <button onClick={onLogout} className="rr-logout-btn">🚪 Logout</button>
        </div>
      </div>
    </>
  );
}

export { SIDEBAR_WIDTH };