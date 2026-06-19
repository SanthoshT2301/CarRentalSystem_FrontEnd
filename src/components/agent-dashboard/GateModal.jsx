import Modal from './Modal';

export default function GateModal({ gateModal, gateForm, setGateForm, setGateModal, doGate }) {
  if (!gateModal) return null;
  return (
    <Modal
      title={`${gateModal.type === 'checkout' ? 'Gate Checkout' : 'Gate Check-in'} — Booking #${gateModal.reservationId}`}
      onClose={() => setGateModal(null)}>
      {gateModal.type === 'checkout' ? (
        <>
          {[['driverLicense', "Driver's license", 'text'], ['mileageOut', 'Mileage out', 'number'], ['fuelOut', 'Fuel level out (%)', 'number']].map(([k, l, t]) => (
            <div key={k} className="mb-3">
              <label className="form-label fw-medium" style={{ fontSize: 13 }}>{l}</label>
              <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} className="form-control" placeholder={l} type={t} />
            </div>
          ))}
        </>
      ) : (
        <>
          {[['mileageIn', 'Mileage in', 'number'], ['fuelIn', 'Fuel level in (%)', 'number']].map(([k, l, t]) => (
            <div key={k} className="mb-3">
              <label className="form-label fw-medium" style={{ fontSize: 13 }}>{l}</label>
              <input value={gateForm[k] || ''} onChange={e => setGateForm(f => ({ ...f, [k]: e.target.value }))} className="form-control" placeholder={l} type={t} />
            </div>
          ))}
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>Damages (or type "none")</label>
          <input value={gateForm.damages || ''} onChange={e => setGateForm(f => ({ ...f, damages: e.target.value }))} className="form-control" placeholder="Describe any damages..." />
        </>
      )}
      <div className="d-flex gap-3 mt-4">
        <button onClick={() => setGateModal(null)} className="btn btn-light flex-fill">Cancel</button>
        <button onClick={doGate} className="btn rr-orange-btn flex-fill">Confirm</button>
      </div>
    </Modal>
  );
}