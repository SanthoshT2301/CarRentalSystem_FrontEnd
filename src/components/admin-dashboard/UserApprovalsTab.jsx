export default function UserApprovalsTab({ pendingUsers, handleApprove }) {
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <div className="fw-bold mb-1" style={{ fontSize:22 }}>Pending User Approvals</div>
          <div className="text-secondary" style={{ fontSize:14 }}>Agent and Admin accounts require your approval before they can log in.</div>
        </div>
        {pendingUsers.length > 0 && (
          <div style={{ background:'#fef3c7', border:'1px solid #fcd34d', borderRadius:10, padding:'8px 16px', color:'#92400e', fontWeight:700, fontSize:14 }}>
            {pendingUsers.length} pending
          </div>
        )}
      </div>

      <div className="d-flex gap-3 mb-4" style={{ background:'#eff6ff', border:'1px solid #bfdbfe', borderRadius:12, padding:'14px 20px' }}>
        <span style={{ fontSize:18 }}>ℹ️</span>
        <div style={{ fontSize:13, color:'#1e40af', lineHeight:1.6 }}>
          <strong>How it works:</strong> When a new Agent or Admin registers, their account is created with <code>IsApproved = false</code>. They receive an email notification and <strong>cannot log in</strong> until you approve their account here. Customers are auto-approved on registration.
        </div>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="rr-card text-center" style={{ padding:'60px 40px' }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✅</div>
          <div className="fw-bold mb-2" style={{ fontSize:18 }}>All caught up!</div>
          <div className="text-secondary" style={{ fontSize:14 }}>No pending approvals at the moment.</div>
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {pendingUsers.map(u => (
            <div key={u.userId} className="rr-card d-flex align-items-center gap-3" style={{ padding:'22px 24px' }}>
              <div className="d-flex align-items-center justify-content-center flex-shrink-0" style={{ width:50, height:50, background: u.role==='Agent'?'#dbeafe':'#fce7f3', borderRadius:'50%', fontWeight:700, fontSize:20, color: u.role==='Agent'?'#2563eb':'#db2777' }}>
                {(u.firstName || '?').charAt(0).toUpperCase()}
              </div>

              <div className="flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="fw-bold" style={{ fontSize:16 }}>{u.firstName} {u.lastName}</span>
                  <span className="rr-badge-pill" style={{ background: u.role==='Agent'?'#dbeafe':'#fce7f3', color: u.role==='Agent'?'#2563eb':'#db2777' }}>
                    {u.role === 'Agent' ? '🔧 Agent' : '👑 Admin'}
                  </span>
                </div>
                <div className="mb-1" style={{ color:'#555', fontSize:13 }}>📧 {u.email}</div>
                {u.phone && <div className="text-secondary" style={{ fontSize:12 }}>📞 {u.phone}</div>}
                <div className="text-secondary mt-1" style={{ fontSize:12 }}>
                  Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) : 'Unknown'}
                </div>
              </div>

              <div style={{ background:'#f9f9f9', borderRadius:10, padding:'12px 16px', fontSize:12, color:'#666', maxWidth:220, lineHeight:1.5 }}>
                {u.role === 'Agent'
                  ? '🔧 Can manage bookings, gate check-in/out, and report maintenance alerts.'
                  : '👑 Will have full admin access including approvals, fleet, promotions and reports.'}
              </div>

              <div className="d-flex flex-column gap-2">
                <button onClick={() => handleApprove(u.userId, true)} className="d-flex align-items-center gap-2 border-0 fw-bold" style={{ padding:'9px 22px', background:'#16a34a', color:'#fff', borderRadius:8, fontSize:13 }}>
                  ✓ Approve
                </button>
                <button onClick={() => handleApprove(u.userId, false)} className="d-flex align-items-center gap-2 fw-semibold" style={{ padding:'9px 22px', background:'#fff', color:'#dc2626', border:'1.5px solid #fca5a5', borderRadius:8, fontSize:13 }}>
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}