export default function ReviewModal({
  reviewModal, setReviewModal, reviewRating, setReviewRating,
  reviewComment, setReviewComment, reviewMsg, submitReview,
}) {
  if (!reviewModal) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, margin: 0 }}>Write a Review</h3>
          <button onClick={() => setReviewModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>×</button>
        </div>
        <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Booking #{reviewModal.id}</p>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Rating</div>
          <div style={{ display: 'flex', gap: 6 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <button key={s} onClick={() => setReviewRating(s)}
                style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: s <= reviewRating ? '#f59e0b' : '#e0e0e0', lineHeight: 1 }}>★</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Comment</div>
          <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4}
            placeholder="Share your experience..."
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
        </div>
        {reviewMsg && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{reviewMsg}</p>}
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
          <button onClick={submitReview} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Submit</button>
        </div>
      </div>
    </div>
  );
}