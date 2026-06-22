export default function TopBar({ tab, userName, today, onMenuClick }) {
  const title =
    tab === 'browse' ? 'Browse Cars' :
    tab === 'reservations' ? 'My Reservations' :
    tab === 'reviews' ? 'Reviews' : 'Profile';

  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-2">
        <button
          onClick={onMenuClick}
          className="rr-mobile-toggle"
          style={{ background: 'none', border: '1px solid #e0e0e0', borderRadius: 8, width: 36, height: 36, fontSize: 16, alignItems: 'center', justifyContent: 'center' }}
        >
          ☰
        </button>
        <div>
          <div className="fw-bold fs-5">{title}</div>
          <div className="text-secondary fs-13">Welcome back, {userName}</div>
        </div>
      </div>
      <div className="text-secondary fs-13">{today}</div>
    </div>
  );
}