const pgBtn = (active) => ({
  padding: '7px 16px', border: '1px solid #e0e0e0', borderRadius: 8,
  cursor: active ? 'pointer' : 'not-allowed', background: '#fff',
  fontSize: 13, opacity: active ? 1 : 0.4,
});

export default function ReservationsTab({
  bookings, setTab, handleCancel, openExtendModal, myReviews,
  setReviewModal, setReviewRating, setReviewComment, setReviewMsg,
  bookPage, setBookPage, bookTotalPages,
}) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>My Reservations</div>
      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div>No reservations yet.</div>
          <button onClick={() => setTab('browse')} style={{ marginTop: 16, padding: '10px 24px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Browse Cars</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {bookings.map((b) => {
            const d1 = new Date(b.pickupDate), d2 = new Date(b.dropoffDate);
            const days = b.isHourly ? null : Math.max(1, Math.ceil((d2 - d1) / 86400000));
            const canExtend = b.status === 'confirmed' && !b.isHourly && !b.isExtended;
            return (
              <div key={b.id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 18 }}>
                <div style={{ width: 44, height: 44, background: '#fef3ee', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚗</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Car #{b.carId}</div>
                  <div style={{ color: '#666', fontSize: 13 }}>{b.pickupLocation} → {b.dropoffLocation}</div>
                  <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                    {b.pickupDate} — {b.isHourly ? `${b.durationHours}h` : `${b.dropoffDate} · ${days} day${days > 1 ? 's' : ''}`}
                  </div>
                  {b.isExtended && (
                    <div style={{ color: '#7c3aed', fontSize: 11, fontWeight: 600, marginTop: 3 }}>✦ Extended</div>
                  )}
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 20, color: '#e85d24' }}>${b.totalAmount}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>Booking R{String(b.id).padStart(3, '0')}</div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span style={{
                      padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: b.status === 'completed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
                      color: b.status === 'completed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#2563eb',
                      textTransform: 'capitalize',
                    }}>{b.status}</span>
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancel(b.id)} style={{ padding: '3px 12px', borderRadius: 20, border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    )}
                    {canExtend && (
                      <button onClick={() => openExtendModal(b)} style={{ padding: '3px 12px', borderRadius: 20, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                        Extend
                      </button>
                    )}
                    {b.status === 'completed' && !myReviews.some(r => r.reservationId === b.id) && (
                      <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                        style={{ padding: '3px 12px', borderRadius: 20, border: 'none', background: '#e85d24', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Review</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {bookTotalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button onClick={() => setBookPage(p => Math.max(1, p - 1))} disabled={bookPage === 1} style={pgBtn(bookPage > 1)}>← Prev</button>
          <span style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13 }}>{bookPage} / {bookTotalPages}</span>
          <button onClick={() => setBookPage(p => Math.min(bookTotalPages, p + 1))} disabled={bookPage === bookTotalPages} style={pgBtn(bookPage < bookTotalPages)}>Next →</button>
        </div>
      )}
    </div>
  );
}