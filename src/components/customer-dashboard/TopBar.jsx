export default function TopBar({ tab, userName, today }) {
  const title =
    tab === 'browse' ? 'Browse Cars' :
    tab === 'reservations' ? 'My Reservations' :
    tab === 'reviews' ? 'Reviews' : 'Profile';

  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center">
      <div>
        <div className="fw-bold fs-5">{title}</div>
        <div className="text-secondary fs-13">Welcome back, {userName}</div>
      </div>
      <div className="text-secondary fs-13">{today}</div>
    </div>
  );
}