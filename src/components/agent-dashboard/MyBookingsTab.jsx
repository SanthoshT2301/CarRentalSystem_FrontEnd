import StatusBadge from './StatusBadge';

export default function MyBookingsTab({ bookings, doReturn }) {
  return (
    <div>
      <div className="rr-info-banner d-flex gap-2 mb-4">
        <span>ℹ️</span>
        <span>You can only see customers who booked <strong>your cars</strong>. Cars added by other agents or admins are not shown here.</span>
      </div>

      <div className="rr-card overflow-hidden">
        <table className="table mb-0">
          <thead>
            <tr>
              {['Booking ID', 'Car ID', 'Pickup', 'Drop-off', 'Dates', 'Amount', 'Status', 'Actions'].map(h => (
                <th key={h} className="rr-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td className="rr-td">#{b.id}</td>
                <td className="rr-td">Car #{b.carId}</td>
                <td className="rr-td">{b.pickupLocation}</td>
                <td className="rr-td">{b.dropoffLocation}</td>
                <td className="rr-td">{b.pickupDate} → {b.dropoffDate}</td>
                <td className="rr-td fw-semibold" style={{ color: '#e85d24' }}>${b.totalAmount}</td>
                <td className="rr-td"><StatusBadge status={b.status} /></td>
                <td className="rr-td">
                  {b.status === 'confirmed' && (
                    <button onClick={() => doReturn(b.id)} className="rr-action-btn" style={{ borderColor: '#fca5a5', color: '#dc2626' }}>
                      Return
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr><td colSpan={8} className="text-center text-secondary" style={{ padding: 48 }}>
                No bookings for your cars yet.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}