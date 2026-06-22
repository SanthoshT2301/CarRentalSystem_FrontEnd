export default function GateLogisticsTab({ confirmedBookings, setGateModal, setGateForm }) {
  return (
    <div>
      <div className="rr-info-banner d-flex gap-2 mb-4">
        <span>ℹ️</span>
        <span>Gate logistics is limited to <strong>confirmed</strong> bookings for your cars. Completed or cancelled bookings are handled automatically.</span>
      </div>

      <div className="rr-card overflow-hidden">
        <div className="rr-scrollable-table rr-gate-table-wrap">
          <table className="table mb-0">
            <thead>
              <tr>
                {['Booking ID', 'Car ID', 'Pickup Location', 'Status', 'Checkout', 'Check-in'].map(h => (
                  <th key={h} className="rr-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {confirmedBookings.map(b => (
                <tr key={b.id}>
                  <td className="rr-td">#{b.id}</td>
                  <td className="rr-td">Car #{b.carId}</td>
                  <td className="rr-td">{b.pickupLocation}</td>
                  <td className="rr-td">
                    <span className="rr-status-badge" style={{ background: '#eff6ff', color: '#2563eb' }}>
                      Confirmed
                    </span>
                  </td>
                  <td className="rr-td">
                    <button
                      onClick={() => { setGateModal({ type: 'checkout', reservationId: b.id }); setGateForm({}); }}
                      className="rr-action-btn"
                      style={{ borderColor: '#fde68a', color: '#d97706', whiteSpace: 'nowrap' }}>
                      Checkout →
                    </button>
                  </td>
                  <td className="rr-td">
                    <button
                      onClick={() => { setGateModal({ type: 'checkin', reservationId: b.id }); setGateForm({}); }}
                      className="rr-action-btn"
                      style={{ borderColor: '#bbf7d0', color: '#16a34a', whiteSpace: 'nowrap' }}>
                      Check-in →
                    </button>
                  </td>
                </tr>
              ))}
              {confirmedBookings.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center text-secondary" style={{ padding: 48 }}>
                    No confirmed bookings pending gate operations.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}