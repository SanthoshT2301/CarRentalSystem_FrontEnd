export default function ReviewsTab({ completedWithoutReview, setReviewModal, setReviewRating, setReviewComment, setReviewMsg, myReviews }) {
  return (
    <div>
      <div className="fw-bold fs-22 mb-4">Reviews</div>

      {completedWithoutReview.length > 0 && (
        <div className="rr-card p-4 mb-4">
          <div className="fw-semibold fs-13 mb-3">Pending Reviews ({completedWithoutReview.length})</div>
          {completedWithoutReview.map(b => (
            <div key={b.id} className="rr-review-card d-flex justify-content-between align-items-center py-3">
              <div>
                <div className="fw-medium fs-13">Car #{b.carId}</div>
                <div className="text-secondary fs-12">{b.pickupDate} — {b.dropoffDate}</div>
              </div>
              <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                className="btn rr-orange-btn rounded-pill fw-semibold fs-13 px-3 py-2">
                Write Review
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="rr-card p-4">
        <div className="fw-semibold fs-13 mb-3">Your Past Reviews</div>
        {myReviews.length === 0 ? (
          <p className="text-secondary fs-13">No reviews yet.</p>
        ) : (
          myReviews.map(r => (
            <div key={r.reviewId} className="rr-review-card py-3">
              <div className="d-flex justify-content-between align-items-start">
                <div className="fw-semibold fs-13">{r.carName}</div>
                <div className="rr-stars">{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
              </div>
              <p className="text-secondary fs-13 mt-2 mb-1" style={{ lineHeight: 1.5 }}>{r.comment}</p>
              <div className="text-secondary fs-12">{r.createdAt?.split(' ')[0]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}