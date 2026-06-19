export default function TopBar({ tab, userName, today }) {
  const title =
    tab === 'browse' ? 'Browse Cars' :
    tab === 'reservations' ? 'My Reservations' :
    tab === 'reviews' ? 'Reviews' : 'Profile';

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: 18 }}>{title}</div>
        <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
      </div>
      <div style={{ color: '#888', fontSize: 13 }}>{today}</div>
    </div>
  );
}