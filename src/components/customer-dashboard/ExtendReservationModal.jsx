export default function ExtendReservationModal({
  extendModal, extendDate, setExtendDate, extendError, setExtendError,
  extendLoading, extendResult, handleExtend, closeExtendModal,
}) {
  if (!extendModal) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
      <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 800, margin: 0, fontSize: 18 }}>Extend Reservation</h3>
          <button onClick={closeExtendModal} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
        </div>

        {!extendResult ? (
          <>
            <div style={{ background: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 13, color: '#6b21a8' }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Booking R{String(extendModal.id).padStart(3, '0')}</div>
              <div>Current drop-off: <strong>{extendModal.dropoffDate}</strong></div>
              <div style={{ marginTop: 4, fontSize: 12, color: '#7c3aed' }}>You can extend this reservation once. Extra days will be charged at the same daily rate.</div>
            </div>

            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>New drop-off date</label>
            <input
              type="date"
              value={extendDate}
              min={(() => { const d = new Date(extendModal.dropoffDate); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
              onChange={e => { setExtendDate(e.target.value); setExtendError(''); }}
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
            />

            {extendError && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 12 }}>
                {extendError}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={closeExtendModal} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>Cancel</button>
              <button onClick={handleExtend} disabled={extendLoading || !extendDate} style={{ flex: 1, padding: '12px', background: extendDate && !extendLoading ? '#7c3aed' : '#e0e0e0', color: extendDate && !extendLoading ? '#fff' : '#aaa', border: 'none', borderRadius: 10, cursor: extendDate && !extendLoading ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: 14 }}>
                {extendLoading ? 'Processing...' : 'Confirm Extension'}
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#16a34a' }}>Extension Confirmed!</div>
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{extendResult.message}</p>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 20, textAlign: 'left' }}>
              {[
                ['Old drop-off', extendResult.oldDropoffDate],
                ['New drop-off', extendResult.newDropoffDate],
                ['Extra charge', `$${extendResult.extraCharge}`],
                ['New total', `$${extendResult.newTotalAmount}`],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                  <span style={{ color: '#666' }}>{k}</span>
                  <span style={{ fontWeight: 600, color: '#111' }}>{v}</span>
                </div>
              ))}
            </div>
            <button onClick={closeExtendModal} style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}