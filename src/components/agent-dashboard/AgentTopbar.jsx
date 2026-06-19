export default function AgentTopbar({ title, userName, myCarsCount, bookingsCount }) {
  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center sticky-top" style={{ zIndex: 10 }}>
      <div>
        <div className="fw-bold" style={{ fontSize: 18 }}>{title}</div>
        <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
      </div>
      <div className="d-flex gap-3">
        <div className="rr-stat-pill-blue">{myCarsCount} cars in your fleet</div>
        <div className="rr-stat-pill-green">{bookingsCount} booking{bookingsCount !== 1 ? 's' : ''} total</div>
      </div>
    </div>
  );
}