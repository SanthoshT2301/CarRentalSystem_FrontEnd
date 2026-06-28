export default function ReviewsTab({ reviews }) {
  return (
    <div>
      <div className="fw-bold mb-1" style={{ fontSize: 22 }}>Reviews for My Cars</div>
      <div className="text-secondary mb-4" style={{ fontSize: 13 }}>
        Feedback left by customers who rented cars from your fleet.
      </div>

      <div className="d-flex flex-column gap-3">
        {reviews.map(r => (
          <div key={r.reviewId} className="rr-card p-3">
            <div className="d-flex justify-content-between align-items-start mb-1 flex-wrap gap-2">
              <span className="fw-bold">{r.carName}</span>
              <span style={{ color: '#f59e0b', fontSize: 14 }}>
                {'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}
              </span>
            </div>
            <div className="text-secondary mb-2" style={{ fontSize: 12 }}>
              by {r.userName} · {r.createdAt?.split(' ')[0]}
            </div>
            <p className="m-0" style={{ color: '#555', fontSize: 13, lineHeight: 1.5 }}>{r.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && (
          <div className="text-center text-secondary" style={{ padding: 60 }}>
            No reviews yet for your cars.
          </div>
        )}
      </div>
    </div>
  );
}