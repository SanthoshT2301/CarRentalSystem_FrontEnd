export default function UserManagementTab({
  allUsers, userSearch, setUserSearch, roleFilter, setRoleFilter,
  handleToggleUserActive, handleDeleteUser,
}) {
  const filtered = allUsers
    .filter(u => roleFilter === 'All' || u.role === roleFilter)
    .filter(u => !userSearch || `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(userSearch.toLowerCase()));

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <div className="fw-bold" style={{ fontSize:22 }}>User Management</div>
          <div className="text-secondary" style={{ fontSize:14 }}>
            View every user, deactivate accounts, or delete them permanently.
          </div>
        </div>
        <div className="d-flex gap-2">
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="rr-input" style={{ width:140 }}>
            {['All', 'Admin', 'Agent', 'Customer'].map(r => <option key={r}>{r}</option>)}
          </select>
          <input value={userSearch} onChange={e => setUserSearch(e.target.value)} placeholder="Search name or email..." className="rr-input" style={{ width:220 }} />
        </div>
      </div>

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