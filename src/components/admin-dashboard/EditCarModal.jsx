import Modal from './Modal';

export default function EditCarModal({ editCarModal, editCarForm, setEditCarForm, editCarErr, setEditCarModal, handleSaveCarEdit }) {
  if (!editCarModal) return null;
  return (
    <Modal title={`Edit ${editCarModal.make} ${editCarModal.model}`} onClose={() => setEditCarModal(null)}>
      <label className="rr-label">Make (Brand)</label>
      <input className="rr-input mb-3" value={editCarForm.make} onChange={e => setEditCarForm(f => ({ ...f, make: e.target.value }))} />
      <label className="rr-label">Model</label>
      <input className="rr-input mb-3" value={editCarForm.model} onChange={e => setEditCarForm(f => ({ ...f, model: e.target.value }))} />
      <div className="row g-2">
        <div className="col-6">
          <label className="rr-label">Price / Day (₹)</label>
          <input type="number" className="rr-input" value={editCarForm.pricePerDay} onChange={e => setEditCarForm(f => ({ ...f, pricePerDay: e.target.value }))} />
        </div>
        <div className="col-6">
          <label className="rr-label">Price / Hour (₹)</label>
          <input type="number" className="rr-input" value={editCarForm.pricePerHour} onChange={e => setEditCarForm(f => ({ ...f, pricePerHour: e.target.value }))} />
        </div>
      </div>
      {editCarErr && <p className="text-danger mt-2" style={{ fontSize: 13 }}>{editCarErr}</p>}
      <div className="d-flex gap-2 mt-4">
        <button onClick={() => setEditCarModal(null)} className="flex-grow-1 border-0 fw-medium" style={{ padding: 10, background: '#f5f5f5', borderRadius: 10 }}>Cancel</button>
        <button onClick={handleSaveCarEdit} className="flex-grow-1 rr-bg-orange border-0 fw-bold" style={{ padding: 10, borderRadius: 10 }}>Save Changes</button>
      </div>
    </Modal>
  );
}