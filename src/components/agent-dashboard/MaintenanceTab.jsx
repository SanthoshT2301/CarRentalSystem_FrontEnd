const PRIORITY_CLR = { High: '#dc2626', Medium: '#d97706', Low: '#16a34a' };

export default function MaintenanceTab({ alerts, setMaintModal, changeStatus }) {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="fw-bold" style={{ fontSize: 22 }}>Maintenance Alerts</div>
        <button onClick={() => setMaintModal(true)} className="btn rr-orange-btn">+ Report Alert</button>
      </div>
      <div className="d-flex flex-column gap-3">
        {alerts.map(a => (
          <div key={a.maintenanceAlertId} className="rr-card p-3 d-flex justify-content-between align-items-center">
            <div>
              <div className="d-flex gap-2 align-items-center mb-1">
                <p className="fw-bold m-0">{a.carName}</p>
                <span
                  className="rr-priority-badge"
                  style={{ background: `${PRIORITY_CLR[a.priority] || '#888'}20`, color: PRIORITY_CLR[a.priority] || '#888' }}>
                  {a.priority}
                </span>
              </div>
              <p style={{ color: '#666', fontSize: 13 }} className="mb-1">{a.description}</p>
              <p style={{ color: '#aaa', fontSize: 12 }} className="m-0">
                Reported by {a.reportedBy} · {new Date(a.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span
                className={`badge ${
                  a.status === 'Fixed' ? 'bg-success'
                  : a.status === 'In Progress' ? 'bg-warning text-dark'
                  : 'bg-secondary'
                }`}>
                {a.status}
              </span>
              {a.status !== 'Fixed' && (
                <select
                  onChange={e => changeStatus(a.maintenanceAlertId, e.target.value)}
                  defaultValue=""
                  className="form-select form-select-sm w-auto">
                  <option value="" disabled>Update</option>
                  {['In Progress', 'Fixed'].map(s => <option key={s}>{s}</option>)}
                </select>
              )}
            </div>
          </div>
        ))}
        {alerts.length === 0 && (
          <div className="text-center text-secondary" style={{ padding: 60 }}>No maintenance alerts.</div>
        )}
      </div>
    </div>
  );
}