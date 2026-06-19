export default function ProfileTab({ userName, firstInitial, email, bookings }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>My Profile</div>
      <div style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 420, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid #f0f0f0', marginBottom: 20 }}>
          <div style={{ width: 56, height: 56, background: '#e85d24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: '#fff' }}>{firstInitial}</div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{userName}</div>
            <div style={{ color: '#888', fontSize: 13 }}>{email}</div>
            <span style={{ background: '#fef3ee', color: '#e85d24', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Customer</span>
          </div>
        </div>
        {[
          ['Email', email],
          ['Account Role', 'Customer'],
          ['Member Since', 'January 2024'],
          ['Total Bookings', bookings.length],
        ].map(([k, v]) => (
          <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
            <span style={{ color: '#888' }}>{k}</span>
            <span style={{ fontWeight: 500 }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}