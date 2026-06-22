export default function AgentTopbar({ title, userName, myCarsCount, bookingsCount, onMenuOpen }) {
  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 10 }}>
      <div className="d-flex align-items-center gap-3">
        {/* Hamburger — hidden on desktop, shown on mobile via CSS */}
        <button
          onClick={onMenuOpen}
          className="rr-mobile-menu-btn"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div>
          <div className="fw-bold" style={{ fontSize: 18 }}>{title}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
        </div>
      </div>

      <div className="d-flex gap-2 rr-topbar-pills">
        <div className="rr-stat-pill-blue">{myCarsCount} cars in fleet</div>
        <div className="rr-stat-pill-green">{bookingsCount} booking{bookingsCount !== 1 ? 's' : ''}</div>
      </div>
    </div>
  );
}