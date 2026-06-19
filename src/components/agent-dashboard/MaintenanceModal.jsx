import Modal from './Modal';

export default function MaintenanceModal({ maintModal, maintForm, setMaintForm, setMaintModal, doMaint }) {
  if (!maintModal) return null;
  return (
    <Modal title="Report Maintenance Alert" onClose={() => setMaintModal(false)}>
      {[['carId', 'Car ID', 'number'], ['description', 'Description', 'text']].map(([k, l, t]) => (
        <div key={k} className="mb-3">
          <label className="form-label fw-medium" style={{ fontSize: 13 }}>{l}</label>
          <input value={maintForm[k]} onChange={e => setMaintForm(f => ({ ...f, [k]: e.target.value }))} className="form-control" placeholder={l} type={t} />
        </div>
      ))}
      <label className="form-label fw-medium" style={{ fontSize: 13 }}>Priority</label>
      <select value={maintForm.priority} onChange={e => setMaintForm(f => ({ ...f, priority: e.target.value }))} className="form-select mb-3">
        {['Low', 'Medium', 'High'].map(p => <option key={p}>{p}</option>)}
      </select>
      <div className="d-flex gap-3 mt-2">
        <button onClick={() => setMaintModal(false)} className="btn btn-light flex-fill">Cancel</button>
        <button onClick={doMaint} className="btn rr-orange-btn flex-fill">Submit</button>
      </div>
    </Modal>
  );
}