export default function ExtendReservationModal({
  extendModal, extendDate, setExtendDate, extendError, setExtendError,
  extendLoading, extendResult, handleExtend, closeExtendModal,
}) {
  if (!extendModal) return null;
  return (
    <div className="rr-modal-overlay d-flex align-items-center justify-content-center">
      <div className="rr-modal rr-modal-wide">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="fw-bold m-0 fs-5">Extend Reservation</h3>
          <button onClick={closeExtendModal} className="btn-close-custom border-0 bg-transparent text-secondary" style={{ fontSize: 22, lineHeight: 1 }}>×</button>
        </div>

        {!extendResult ? (
          <>
            <div className="rr-extend-banner p-3 mb-4 fs-13" style={{ color: '#6b21a8' }}>
              <div className="fw-semibold mb-1">Booking R{String(extendModal.id).padStart(3, '0')}</div>
              <div>Current drop-off: <strong>{extendModal.dropoffDate}</strong></div>
              <div className="mt-1 fs-12" style={{ color: '#7c3aed' }}>You can extend this reservation once. Extra days will be charged at the same daily rate.</div>
            </div>

            <label className="form-label fw-semibold fs-13">New drop-off date</label>
            <input
              type="date"
              value={extendDate}
              min={(() => { const d = new Date(extendModal.dropoffDate); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]; })()}
              onChange={e => { setExtendDate(e.target.value); setExtendError(''); }}
              className="form-control mb-4"
            />

            {extendError && (
              <div className="rr-error-box px-3 py-2 fs-13 mb-3">
                {extendError}
              </div>
            )}

            <div className="d-flex gap-3">
              <button onClick={closeExtendModal} className="btn btn-light flex-fill fw-medium">Cancel</button>
              <button
                onClick={handleExtend}
                disabled={extendLoading || !extendDate}
                className="btn flex-fill fw-bold text-white"
                style={{ background: extendDate && !extendLoading ? '#7c3aed' : '#e0e0e0', color: extendDate && !extendLoading ? '#fff' : '#aaa' }}
              >
                {extendLoading ? 'Processing...' : 'Confirm Extension'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center">
            <div className="fs-1 mb-3">✅</div>
            <div className="fw-bold fs-5 mb-2 text-rr-green">Extension Confirmed!</div>
            <p className="text-secondary fs-13 mb-4" style={{ lineHeight: 1.6 }}>{extendResult.message}</p>
            <div className="rr-extend-result-box p-3 mb-4 text-start">
              {[
                ['Old drop-off', extendResult.oldDropoffDate],
                ['New drop-off', extendResult.newDropoffDate],
                ['Extra charge', `₹${extendResult.extraCharge}`],
                ['New total', `₹${extendResult.newTotalAmount}`],
              ].map(([k, v]) => (
                <div key={k} className="d-flex justify-content-between mb-2 fs-13">
                  <span className="text-secondary">{k}</span>
                  <span className="fw-semibold">{v}</span>
                </div>
              ))}
            </div>
            <button onClick={closeExtendModal} className="btn w-100 fw-bold text-white" style={{ background: '#16a34a' }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}