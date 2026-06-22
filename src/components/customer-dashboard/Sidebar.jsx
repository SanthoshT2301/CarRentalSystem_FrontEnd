const SIDEBAR_WIDTH = 170;

const MENU = [
  { key: 'browse', icon: '🚗', label: 'Browse Cars' },
  { key: 'reservations', icon: '📋', label: 'My Reservations' },
  { key: 'reviews', icon: '⭐', label: 'My Reviews' },
  { key: 'profile', icon: '👤', label: 'Profile' },
];

export default function Sidebar({ tab, setTab, userName, firstInitial, onLogout, mobileOpen, closeMobile }) {
  return (
    <>
      {mobileOpen && (
        <div className="rr-sidebar-overlay" onClick={closeMobile} />
      )}
      <div
        className={`rr-sidebar ${mobileOpen ? 'rr-sidebar-open' : ''}`}
        style={{ width: SIDEBAR_WIDTH, background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}
      >
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚗</div>
            <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
          </div>
          <button
            onClick={closeMobile}
            className="rr-mobile-toggle"
            style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 20, lineHeight: 1, padding: 0 }}
          >
            ×
          </button>
        </div>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#e85d24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 }}>{firstInitial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ color: '#e85d24', fontSize: 11 }}>Customer</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {MENU.map(m => (
            <button
              key={m.key}
              onClick={() => { setTab(m.key); closeMobile?.(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                background: tab === m.key ? '#e85d2430' : 'transparent',
                color: tab === m.key ? '#e85d24' : '#aaa',
                fontWeight: tab === m.key ? 600 : 400, fontSize: 13, textAlign: 'left', marginBottom: 2,
                transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: 15 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
          <button onClick={onLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#e85d24', fontSize: 13,
          }}>🚪 Logout</button>
        </div>
      </div>
    </>
  );
}

export { SIDEBAR_WIDTH };