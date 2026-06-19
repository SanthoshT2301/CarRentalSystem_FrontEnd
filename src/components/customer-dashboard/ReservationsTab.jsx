export default function ReservationsTab({
  bookings, setTab, handleCancel, openExtendModal, myReviews,
  setReviewModal, setReviewRating, setReviewComment, setReviewMsg,
  bookPage, setBookPage, bookTotalPages,
}) {
  return (
    <div>
      <div className="fw-bold fs-22 mb-4">My Reservations</div>
      {bookings.length === 0 ? (
        <div className="text-center text-secondary py-5">
          <div className="fs-40 mb-3">📋</div>
          <div>No reservations yet.</div>
          <button onClick={() => setTab('browse')} className="btn rr-orange-btn mt-3 px-4 py-2 fw-semibold">Browse Cars</button>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {bookings.map((b) => {
            const d1 = new Date(b.pickupDate), d2 = new Date(b.dropoffDate);
            const days = b.isHourly ? null : Math.max(1, Math.ceil((d2 - d1) / 86400000));
            const canExtend = b.status === 'confirmed' && !b.isHourly && !b.isExtended;
            return (
              <div key={b.id} className="rr-card d-flex align-items-center gap-3 px-4 py-3">
                <div className="d-flex align-items-center justify-content-center flex-shrink-0 bg-rr-orange-soft rounded-3" style={{ width: 44, height: 44, fontSize: 22 }}>🚗</div>
                <div className="flex-grow-1">
                  <div className="fw-bold fs-13 mb-1">Car #{b.carId}</div>
                  <div className="text-secondary fs-13">{b.pickupLocation} → {b.dropoffLocation}</div>
                  <div className="text-secondary fs-12 mt-1">
                    {b.pickupDate} — {b.isHourly ? `${b.durationHours}h` : `${b.dropoffDate} · ${days} day${days > 1 ? 's' : ''}`}
                  </div>
                  {b.isExtended && (
                    <div className="fs-11 fw-semibold mt-1" style={{ color: '#7c3aed' }}>✦ Extended</div>
                  )}
                </div>
                <div className="text-end d-flex flex-column align-items-end gap-2">
                  <div className="fw-bold fs-5 text-rr-orange">${b.totalAmount}</div>
                  <div className="fs-11 text-secondary">Booking R{String(b.id).padStart(3, '0')}</div>
                  <div className="d-flex gap-2 align-items-center flex-wrap justify-content-end">
                    <span className={`rr-status-badge status-${b.status}`}>{b.status}</span>
                    {b.status === 'confirmed' && (
                      <button onClick={() => handleCancel(b.id)} className="btn btn-sm rounded-pill border fs-12 fw-medium text-rr-red px-3 py-1" style={{ borderColor: '#fca5a5' }}>Cancel</button>
                    )}
                    {canExtend && (
                      <button onClick={() => openExtendModal(b)} className="btn btn-sm rounded-pill border-0 text-white fw-semibold fs-12 px-3 py-1" style={{ background: '#7c3aed' }}>
                        Extend
                      </button>
                    )}
                    {b.status === 'completed' && !myReviews.some(r => r.reservationId === b.id) && (
                      <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                        className="btn btn-sm rr-orange-btn rounded-pill fw-semibold fs-12 px-3 py-1">Review</button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {bookTotalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button onClick={() => setBookPage(p => Math.max(1, p - 1))} disabled={bookPage === 1} className="rr-pagination-btn">← Prev</button>
          <span className="rr-pagination-btn" style={{ cursor: 'default' }}>{bookPage} / {bookTotalPages}</span>
          <button onClick={() => setBookPage(p => Math.min(bookTotalPages, p + 1))} disabled={bookPage === bookTotalPages} className="rr-pagination-btn">Next →</button>
        </div>
      )}
    </div>
  );
}