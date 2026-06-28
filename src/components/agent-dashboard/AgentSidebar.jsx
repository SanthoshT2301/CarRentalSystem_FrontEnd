const MENU = [
  { key: 'bookings',    icon: '📋', label: 'My Bookings' },
  { key: 'gate',        icon: '🚧', label: 'Gate Logistics' },
  { key: 'fleet',       icon: '🚗', label: 'My Fleet' },
  { key: 'reviews',     icon: '⭐', label: 'Reviews' },
  { key: 'maintenance', icon: '🔧', label: 'Maintenance' },
];

export default function AgentSidebar({ tab, setTab, userName, onLogout, mobileOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`rr-sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
        onClick={onClose}
      />

      <div className={`rr-sidebar d-flex flex-column ${mobileOpen ? 'rr-sidebar-open' : ''}`}>
        {/* Header */}
        <div
          className="d-flex align-items-center justify-content-between border-bottom p-3"
          style={{ borderColor: '#222' }}
        >
          <div className="d-flex align-items-center gap-2">
            <div className="rr-sidebar-logo d-flex align-items-center justify-content-center">🚗</div>
            <span className="text-white fw-bold" style={{ fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
          </div>
          <button
            onClick={onClose}
            className="rr-sidebar-close-btn"
            aria-label="Close menu"
          >
            ×
          </button>
        </div>

        {/* User info */}
        <div className="p-3 border-bottom" style={{ borderColor: '#222' }}>
          <div className="rr-sidebar-avatar d-flex align-items-center justify-content-center text-white fw-bold mb-2">
            {(userName || 'A').charAt(0).toUpperCase()}
          </div>
          <div className="text-white fw-semibold" style={{ fontSize: 13 }}>{userName}</div>
          <div style={{ color: '#2563eb', fontSize: 11, fontWeight: 600 }}>Agent</div>
        </div>

        {/* Nav */}
        <nav className="flex-grow-1 p-2" style={{ overflowY: 'auto' }}>
          {MENU.map(m => (
            <button
              key={m.key}
              onClick={() => { setTab(m.key); onClose?.(); }}
              className={`rr-nav-btn d-flex align-items-center gap-2 w-100 text-start border-0 mb-1 px-3 py-2 ${tab === m.key ? 'active' : ''}`}
            >
              <span style={{ fontSize: 15 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-2 border-top" style={{ borderColor: '#222' }}>
          <button onClick={onLogout} className="rr-logout-btn d-flex align-items-center gap-2 w-100 border-0 px-3 py-2">
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}