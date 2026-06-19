export default function ReviewsTab({ completedWithoutReview, setReviewModal, setReviewRating, setReviewComment, setReviewMsg, myReviews }) {
  return (
    <div>
      <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>Reviews</div>

      {completedWithoutReview.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Pending Reviews ({completedWithoutReview.length})</div>
          {completedWithoutReview.map(b => (
            <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div>
                <div style={{ fontWeight: 500, fontSize: 14 }}>Car #{b.carId}</div>
                <div style={{ color: '#888', fontSize: 12 }}>{b.pickupDate} — {b.dropoffDate}</div>
              </div>
              <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                style={{ padding: '7px 18px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                Write Review
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Your Past Reviews</div>
        {myReviews.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: 14 }}>No reviews yet.</p>
        ) : (
          myReviews.map(r => (
            <div key={r.reviewId} style={{ padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{r.carName}</div>
                <div style={{ color: '#f59e0b', letterSpacing: 2, fontSize: 15 }}>{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
              </div>
              <p style={{ color: '#555', fontSize: 13, margin: '6px 0 4px', lineHeight: 1.5 }}>{r.comment}</p>
              <div style={{ color: '#aaa', fontSize: 12 }}>{r.createdAt?.split(' ')[0]}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}