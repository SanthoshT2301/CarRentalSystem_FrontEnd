export default function ReviewsDisputesTab({ reviews, setDisputeModal, setDisputeText, handleResolve }) {
  return (
    <div>
      <div className="fw-bold mb-1" style={{ fontSize:22 }}>Reviews & Disputes</div>
      <div className="text-secondary mb-4" style={{ fontSize:13 }}>Flag suspicious reviews or resolve existing disputes.</div>

      <div className="d-flex gap-2 mb-3">
        {[
          { label:'All Reviews', count: reviews.length, color:'#2563eb' },
          { label:'Disputed', count: reviews.filter(r => r.isDisputed).length, color:'#d97706' },
        ].map(s => (
          <div key={s.label} className="rr-card d-flex align-items-center gap-2" style={{ padding:'14px 20px' }}>
            <div className="fw-bold" style={{ fontSize:24, color:s.color }}>{s.count}</div>
            <div className="text-secondary" style={{ fontSize:13 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="d-flex flex-column gap-2">
        {reviews.map(r => (
          <div key={r.reviewId} className="rr-card" style={{ padding:'20px 24px', borderLeft: r.isDisputed ? '3px solid #f59e0b' : '3px solid transparent' }}>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-bold">{r.carName}</span>
                  {r.isDisputed && <span className="rr-badge-pill" style={{ background:'#fef3c7', color:'#d97706' }}>⚠ Disputed</span>}
                </div>
                <div className="text-secondary mb-1" style={{ fontSize:12 }}>by {r.userName} · {r.createdAt?.split(' ')[0]}</div>
                <div style={{ color:'#f59e0b', fontSize:14 }}>{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
              </div>
              <div className="d-flex gap-2">
                {!r.isDisputed && (
                  <button onClick={() => { setDisputeModal(r); setDisputeText(''); }} className="fw-medium" style={{ padding:'7px 16px', border:'1.5px solid #fde68a', color:'#d97706', background:'#fff', borderRadius:8, fontSize:13 }}>🚩 Flag</button>
                )}
                {r.isDisputed && (
                  <>
                    <button onClick={() => handleResolve(r.reviewId, 'keep')} className="fw-semibold" style={{ padding:'7px 16px', border:'1.5px solid #bbf7d0', color:'#16a34a', background:'#fff', borderRadius:8, fontSize:13 }}>✓ Keep</button>
                    <button onClick={() => handleResolve(r.reviewId, 'remove')} className="fw-semibold" style={{ padding:'7px 16px', border:'1.5px solid #fca5a5', color:'#dc2626', background:'#fff', borderRadius:8, fontSize:13 }}>✕ Remove</button>
                  </>
                )}
              </div>
            </div>
            <p className="m-0" style={{ color:'#555', fontSize:13, lineHeight:1.5 }}>{r.comment}</p>
            {r.isDisputed && r.disputeResolution && (
              <div className="mt-2" style={{ background:'#fffbeb', padding:'8px 12px', borderRadius:8, fontSize:12, color:'#92400e' }}>
                📝 Grounds: {r.disputeResolution}
              </div>
            )}
          </div>
        ))}
        {reviews.length === 0 && <div className="text-center text-secondary py-5">No reviews yet.</div>}
      </div>
    </div>
  );
}