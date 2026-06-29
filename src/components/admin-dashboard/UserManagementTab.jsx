export default function UserManagementTab({
  allUsers, userSearch, setUserSearch, roleFilter, setRoleFilter,
  handleToggleUserActive, handleDeleteUser,
  showUserForm, setShowUserForm, userForm, setUserForm, userFormErr, handleCreateUser,
  openEditUser,
}) {
  const filtered = allUsers
    .filter(u => roleFilter === 'All' || u.role === roleFilter)
    .filter(u => !userSearch || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
  <div>
    <div className="fw-bold" style={{ fontSize:22 }}>User Management</div>
    <div className="text-secondary" style={{ fontSize:14 }}>
      Create accounts, edit details, deactivate, or delete users permanently.
    </div>
  </div>
  <div className="d-flex gap-2 flex-wrap">
    <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rr-input" style={{ width:140 }}>
      {['All', 'Admin', 'Agent', 'Customer'].map(r => <option key={r}>{r}</option>)}
    </select>
    <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name or email..." className="rr-input" style={{ width:220 }} />
    <button onClick={() => setShowUserForm(true)} className="rr-bg-orange border-0 fw-semibold" style={{ padding: '9px 18px', borderRadius: 8, fontSize: 13 }}>
      + Add User
    </button>
  </div>
</div>

{showUserForm && (
  <div className="rr-card mb-4" style={{ padding: 24 }}>
    <div className="fw-bold mb-3" style={{ fontSize: 16 }}>New User</div>
    <div className="row g-2">
      <div className="col-6">
        <label className="rr-label">First name</label>
        <input className="rr-input" value={userForm.firstName} onChange={e => setUserForm(f => ({ ...f, firstName: e.target.value }))} />
      </div>
      <div className="col-6">
        <label className="rr-label">Last name</label>
        <input className="rr-input" value={userForm.lastName} onChange={e => setUserForm(f => ({ ...f, lastName: e.target.value }))} />
      </div>
      <div className="col-6">
        <label className="rr-label">Email</label>
        <input className="rr-input" value={userForm.email} onChange={e => setUserForm(f => ({ ...f, email: e.target.value }))} />
      </div>
      <div className="col-6">
        <label className="rr-label">Password</label>
        <input type="password" className="rr-input" value={userForm.password} onChange={e => setUserForm(f => ({ ...f, password: e.target.value }))} />
      </div>
      <div className="col-6">
        <label className="rr-label">Phone</label>
        <input className="rr-input" value={userForm.phone} onChange={e => setUserForm(f => ({ ...f, phone: e.target.value }))} />
      </div>
      <div className="col-6">
        <label className="rr-label">Role</label>
        <select className="rr-input" value={userForm.roleId} onChange={e => setUserForm(f => ({ ...f, roleId: Number(e.target.value) }))}>
          <option value={2}>Customer</option>
          <option value={3}>Agent</option>
          <option value={1}>Admin</option>
        </select>
      </div>
    </div>
    {userFormErr && <p className="text-danger mt-2" style={{ fontSize: 13 }}>{userFormErr}</p>}
    <div className="d-flex gap-2 mt-3">
      <button onClick={() => setShowUserForm(false)} className="border-0 fw-medium" style={{ padding: '9px 20px', background: '#f5f5f5', borderRadius: 8 }}>Cancel</button>
      <button onClick={handleCreateUser} className="rr-bg-orange border-0 fw-bold" style={{ padding: '9px 20px', borderRadius: 8 }}>Create User</button>
    </div>
  </div>
)}

      <div className="rr-card overflow-hidden">
        <div style={{ overflowX:'auto' }}>
          <table className="table mb-0">
            <thead>
              <tr>{['ID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'Actions'].map(h => <th key={h} className="rr-th">{h}</th>)}</tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.userId}>
                  <td className="rr-td">#{u.userId}</td>
                  <td className="rr-td">{u.firstName} {u.lastName}</td>
                  <td className="rr-td">{u.email}</td>
                  <td className="rr-td">{u.phone || '—'}</td>
                  <td className="rr-td">
                    <span className="rr-badge-pill" style={{
                      background: u.role === 'Admin' ? '#fce7f3' : u.role === 'Agent' ? '#dbeafe' : '#f0fdf4',
                      color: u.role === 'Admin' ? '#db2777' : u.role === 'Agent' ? '#2563eb' : '#16a34a',
                    }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="rr-td">
                    <span className="rr-badge-pill" style={{ background: u.isActive ? '#dcfce7' : '#f1f1f1', color: u.isActive ? '#16a34a' : '#888' }}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  

                  





                  <td className="rr-td">
                    
                    <div className="d-flex gap-2">
                        <button onClick={() => openEditUser(u)} className="fw-medium" style={{
      padding: '6px 14px', borderRadius: 8, fontSize: 12,
      border: '1.5px solid #bfdbfe', color: '#2563eb', background: '#fff',
    }}>
      ✏ Edit
    </button>
                      <button onClick={() => handleToggleUserActive(u)} className="fw-medium" style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12,
                        border: `1.5px solid ${u.isActive ? '#e0e0e0' : '#bbf7d0'}`,
                        color: u.isActive ? '#666' : '#16a34a', background: '#fff',
                      }}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeleteUser(u)} className="fw-medium" style={{
                        padding: '6px 14px', borderRadius: 8, fontSize: 12,
                        border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff',
                      }}>
                        🗑 Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center text-secondary py-5">No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}