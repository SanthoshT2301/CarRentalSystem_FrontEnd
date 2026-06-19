export default function ReviewModal({
  reviewModal, setReviewModal, reviewRating, setReviewRating,
  reviewComment, setReviewComment, reviewMsg, submitReview,
}) {
  if (!reviewModal) return null;
  return (
    <div className="rr-modal-overlay d-flex align-items-center justify-content-center">
      <div className="rr-modal">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0">Write a Review</h3>
          <button onClick={() => setReviewModal(null)} className="border-0 bg-transparent text-secondary" style={{ fontSize: 20, lineHeight: 1 }}>×</button>
        </div>
        <p className="text-secondary fs-13 mb-3">Booking #{reviewModal.id}</p>
        <div className="mb-3">
          <div className="fs-13 fw-medium mb-2">Rating</div>
          <div className="d-flex gap-2">
            {[1, 2, 3, 4, 5].map(s => (
              <button
                key={s}
                onClick={() => setReviewRating(s)}
                className={`rr-star-btn ${s <= reviewRating ? 'filled' : 'empty'}`}
              >★</button>
            ))}
          </div>
        </div>
        <div className="mb-3">
          <div className="fs-13 fw-medium mb-2">Comment</div>
          <textarea
            value={reviewComment}
            onChange={e => setReviewComment(e.target.value)}
            rows={4}
            placeholder="Share your experience..."
            className="form-control"
            style={{ resize: 'none' }}
          />
        </div>
        {reviewMsg && <p className="text-rr-red fs-13 mb-3">{reviewMsg}</p>}
        <div className="d-flex gap-3">
          <button onClick={() => setReviewModal(null)} className="btn btn-light flex-fill fw-medium">Cancel</button>
          <button onClick={submitReview} className="btn rr-orange-btn flex-fill fw-bold">Submit</button>
        </div>
      </div>
    </div>
  );
}