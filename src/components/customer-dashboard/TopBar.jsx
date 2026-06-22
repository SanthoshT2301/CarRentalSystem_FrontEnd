export default function TopBar({ tab, userName, today, onMenuClick }) {
  const title =
    tab === 'browse' ? 'Browse Cars' :
    tab === 'reservations' ? 'My Reservations' :
    tab === 'reviews' ? 'Reviews' : 'Profile';

  return (
    <div className="rr-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Hamburger — hidden on desktop, shown on mobile via CSS */}
        <button
          onClick={onMenuClick}
          className="rr-mobile-toggle"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div>
          <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
          <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
        </div>
      </div>
      {/* Hide date on very small screens via CSS class */}
      <div className="rr-topbar-date" style={{ color: '#888', fontSize: 13 }}>{today}</div>
    </div>
  );
}