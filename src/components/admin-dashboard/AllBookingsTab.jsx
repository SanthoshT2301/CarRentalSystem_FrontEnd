import { useState, useEffect } from 'react';
import { getAllBookings } from '../../services';
import StatusBadge from './StatusBadge';

export default function AllBookingsTab() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getAllBookings(page, 20).then(r => { setData(r.data || []); setTotalPages(r.totalPages || 1); }).catch(() => {});
  }, [page]);

  const filtered = data.filter(b => {
    if (statusFilter !== 'All' && b.status !== statusFilter.toLowerCase()) return false;
    if (search && !`${b.pickupLocation} ${b.dropoffLocation} ${b.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold" style={{ fontSize:22 }}>All Bookings</div>
        <div className="d-flex gap-2">
          {['All','Confirmed','Completed','Cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} className="border-0 fw-medium"
              style={{ padding:'6px 14px', borderRadius:20, fontSize:12, background: statusFilter === s ? '#1a1a1a' : '#f0f0f0', color: statusFilter === s ? '#fff' : '#555' }}>{s}</button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="rr-input" style={{ width:180 }} />
        </div>
      </div>
      <div className="rr-card overflow-hidden">
        <table className="table mb-0">
          <thead><tr>{['ID','Car ID','User ID','Pickup','Drop-off','Pickup Date','Return Date','Amount','Status','Type'].map(h => <th key={h} className="rr-th">{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td className="rr-td">#{b.id}</td>
                <td className="rr-td">{b.carId}</td>
                <td className="rr-td">{b.userId}</td>
                <td className="rr-td">{b.pickupLocation}</td>
                <td className="rr-td">{b.dropoffLocation}</td>
                <td className="rr-td">{b.pickupDate}</td>
                <td className="rr-td">{b.dropoffDate}</td>
                <td className="rr-td fw-semibold rr-orange">₹{b.totalAmount}</td>
                <td className="rr-td"><StatusBadge status={b.status} /></td>
                <td className="rr-td"><span className="rr-badge-pill" style={{ background: b.isHourly?'#fef3ee':'#f0fdf4', color: b.isHourly?'#e85d24':'#16a34a', fontWeight:500 }}>{b.isHourly?'Hourly':'Daily'}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} className="text-center text-secondary py-4">No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="rr-pgbtn">← Prev</button>
          <span className="rr-pgbtn" style={{ cursor:'default' }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="rr-pgbtn">Next →</button>
        </div>
      )}
    </div>
  );
}