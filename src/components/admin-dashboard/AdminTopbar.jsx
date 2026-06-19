import { MENU } from './AdminSidebar';

export default function AdminTopbar({ tab, userName, pendingCount, setTab, today }) {
  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center">
      <div>
        <div className="fw-bold fs-5">{MENU.find(m => m.key === tab)?.label}</div>
        <div className="text-secondary" style={{ fontSize:13 }}>Welcome back, {userName}</div>
      </div>
      <div className="d-flex align-items-center gap-3">
        {pendingCount > 0 && tab !== 'approvals' && (
          <button onClick={() => setTab('approvals')} className="d-flex align-items-center gap-2 border-0 fw-semibold"
            style={{ background:'#fef3c7', border:'1px solid #fcd34d', color:'#92400e', padding:'7px 14px', borderRadius:8, fontSize:12 }}>
            ⚠ {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
          </button>
        )}
        <div className="text-secondary" style={{ fontSize:13 }}>{today}</div>
      </div>
    </div>
  );
}