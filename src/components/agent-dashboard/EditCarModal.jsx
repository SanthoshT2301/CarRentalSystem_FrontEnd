import Modal from './Modal';

export default function EditCarModal({ editModal, editForm, setEditForm, editErr, setEditModal, handleSaveEdit }) {
  if (!editModal) return null;
  return (
    <Modal title={`Edit ${editModal.make} ${editModal.model}`} onClose={() => setEditModal(null)}>
      <div className="mb-3">
        <label className="form-label fw-medium">Make (Brand)</label>
        <input className="form-control" value={editForm.make} onChange={e => setEditForm(f => ({ ...f, make: e.target.value }))} />
      </div>
      <div className="mb-3">
        <label className="form-label fw-medium">Model</label>
        <input className="form-control" value={editForm.model} onChange={e => setEditForm(f => ({ ...f, model: e.target.value }))} />
      </div>
      <div className="row">
        <div className="col-6 mb-3">
          <label className="form-label fw-medium">Price / Day ($)</label>
          <input type="number" className="form-control" value={editForm.pricePerDay} onChange={e => setEditForm(f => ({ ...f, pricePerDay: e.target.value }))} />
        </div>
        <div className="col-6 mb-3">
          <label className="form-label fw-medium">Price / Hour ($)</label>
          <input type="number" className="form-control" value={editForm.pricePerHour} onChange={e => setEditForm(f => ({ ...f, pricePerHour: e.target.value }))} />
        </div>
      </div>

      {editErr && <div className="alert alert-danger py-2">{editErr}</div>}

      <div className="d-flex gap-2 mt-3">
        <button onClick={() => setEditModal(null)} className="btn btn-light flex-fill">Cancel</button>
        <button onClick={handleSaveEdit} className="btn rr-orange-btn flex-fill">Save Changes</button>
      </div>
    </Modal>
  );
}