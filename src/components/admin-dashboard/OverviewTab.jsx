import StatusBadge from './StatusBadge';

export default function OverviewTab({ stats, recentBooks, pendingCount, setTab, setShowCarForm, setShowPromoForm }) {
  return (
    <div>
      {pendingCount > 0 && (
        <div className="rr-pending-banner d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-3">
            <span style={{ fontSize:20 }}>⚠️</span>
            <div>
              <div className="fw-bold" style={{ fontSize:14, color:'#92400e' }}>Pending User Approvals</div>
              <div style={{ color:'#a16207', fontSize:13 }}>{pendingCount} agent/admin account{pendingCount > 1 ? 's' : ''} waiting for your approval</div>
            </div>
          </div>
          <button onClick={() => setTab('approvals')} className="rr-bg-orange fw-semibold" style={{ padding:'8px 18px', borderRadius:8, fontSize:13 }}>Review Now →</button>
        </div>
      )}

      <div className="row row-cols-4 g-3 mb-4">
        {[
          { label:'Total Users',    value: stats?.usersCount    ?? '—', icon:'👥', bg:'#dbeafe' },
          { label:'Total Cars',     value: stats?.carsCount     ?? '—', icon:'🚗', bg:'#dcfce7' },
          { label:'Total Bookings', value: stats?.bookingsCount ?? '—', icon:'📋', bg:'#fef3c7' },
          { label:'Revenue',        value: stats ? `$${Number(stats.revenue).toLocaleString()}` : '—', icon:'💰', bg:'#fce7f3' },
        ].map(s => (
          <div key={s.label} className="col">
            <div className="rr-card d-flex align-items-center gap-3" style={{ padding:'20px 18px' }}>
              <div className="rr-stat-card d-flex align-items-center justify-content-center flex-shrink-0" style={{ background:s.bg }}>{s.icon}</div>
              <div>
                <div className="text-secondary mb-1" style={{ fontSize:12 }}>{s.label}</div>
                <div className="fw-bold" style={{ fontSize:26, color:'#111' }}>{s.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row row-cols-4 g-2 mb-4">
        {[
          { label:'Review Approvals', icon:'✅', action: () => setTab('approvals'), color:'#f59e0b', show: pendingCount > 0 },
          { label:'Add a Car',        icon:'🚗', action: () => { setTab('fleet'); setTimeout(() => setShowCarForm(true), 100); }, color:'#e85d24', show:true },
          { label:'Create Promotion', icon:'🎟', action: () => { setTab('promotions'); setTimeout(() => setShowPromoForm(true), 100); }, color:'#7c3aed', show:true },
          { label:'View Reports',     icon:'📈', action: () => setTab('reports'), color:'#059669', show:true },
        ].filter(qa => qa.show).map(qa => (
          <div key={qa.label} className="col">
            <button onClick={qa.action} className="rr-card rr-quick-action d-flex align-items-center gap-3 w-100" style={{ padding:'16px 18px' }}>
              <div className="d-flex align-items-center justify-content-center" style={{ width:40, height:40, background: qa.color+'20', borderRadius:10, fontSize:18 }}>{qa.icon}</div>
              <span className="fw-semibold" style={{ fontSize:13, color:'#111' }}>{qa.label}</span>
              <span className="ms-auto" style={{ color:'#ccc' }}>→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="rr-card p-0 overflow-hidden">
        <div className="d-flex justify-content-between align-items-center border-bottom" style={{ padding:'18px 22px', borderColor:'#f0f0f0' }}>
          <div className="fw-bold" style={{ fontSize:15 }}>Recent Bookings</div>
          <button onClick={() => setTab('bookings')} className="border-0 bg-transparent rr-orange fw-medium" style={{ fontSize:13 }}>View all →</button>
        </div>
        <table className="table mb-0">
          <thead><tr>{['ID','Pickup','Drop-off','Date','Amount','Status'].map(h => <th key={h} className="rr-th">{h}</th>)}</tr></thead>
          <tbody>
            {recentBooks.map(b => (
              <tr key={b.id}>
                <td className="rr-td">#{b.id}</td>
                <td className="rr-td">{b.pickupLocation}</td>
                <td className="rr-td">{b.dropoffLocation}</td>
                <td className="rr-td">{b.pickupDate}</td>
                <td className="rr-td fw-semibold rr-orange">${b.totalAmount}</td>
                <td className="rr-td"><StatusBadge status={b.status} /></td>
              </tr>
            ))}
            {recentBooks.length === 0 && <tr><td colSpan={6} className="text-center text-secondary py-4">No bookings yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}