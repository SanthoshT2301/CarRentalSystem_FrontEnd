import Modal from './Modal';

export default function EditUserModal({ editingUser, editForm, setEditForm, editErr, setEditingUser, handleUpdateUser }) {
  if (!editingUser) return null;
  return (
    <Modal title={`Edit ${editingUser.firstName} ${editingUser.lastName || ''}`} onClose={() => setEditingUser(null)}>
      <div className="row g-2">
        <div className="col-6">
          <label className="rr-label">First name</label>
          <input className="rr-input" value={editForm.firstName} onChange={e => setEditForm(f => ({ ...f, firstName: e.target.value }))} />
        </div>
        <div className="col-6">
          <label className="rr-label">Last name</label>
          <input className="rr-input" value={editForm.lastName} onChange={e => setEditForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="col-12">
          <label className="rr-label">Email</label>
          <input className="rr-input" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} />
        </div>
        <div className="col-6">
          <label className="rr-label">Phone</label>
          <input className="rr-input" value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} />
        </div>
        <div className="col-6">
          <label className="rr-label">Role</label>
          <select className="rr-input" value={editForm.roleId} onChange={e => setEditForm(f => ({ ...f, roleId: Number(e.target.value) }))}>
            <option value={1}>Admin</option>
            <option value={2}>Customer</option>
            <option value={3}>Agent</option>
          </select>
        </div>
      </div>
      {editErr && <p className="text-danger mt-2" style={{ fontSize: 13 }}>{editErr}</p>}
      <div className="d-flex gap-2 mt-4">
        <button onClick={() => setEditingUser(null)} className="flex-grow-1 border-0 fw-medium" style={{ padding: 10, background: '#f5f5f5', borderRadius: 10 }}>Cancel</button>
        <button onClick={handleUpdateUser} className="flex-grow-1 rr-bg-orange border-0 fw-bold" style={{ padding: 10, borderRadius: 10 }}>Save Changes</button>
      </div>
    </Modal>
  );
}