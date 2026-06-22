import { MENU } from './AdminSidebar';

export default function AdminTopbar({ tab, userName, pendingCount, setTab, today, onMenuOpen }) {
  return (
    <div className="rr-topbar d-flex justify-content-between align-items-center">
      <div className="d-flex align-items-center gap-3">
        {/* Hamburger — shown on tablet/mobile via CSS */}
        <button
          className="rr-mobile-menu-btn"
          onClick={onMenuOpen}
          aria-label="Open navigation"
        >
          ☰
        </button>
        <div>
          <div className="fw-bold fs-5">{MENU.find(m => m.key === tab)?.label}</div>
          <div className="text-secondary d-none d-sm-block" style={{ fontSize: 13 }}>Welcome back, {userName}</div>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3 flex-wrap justify-content-end">
        {pendingCount > 0 && tab !== 'approvals' && (
          <button
            onClick={() => setTab('approvals')}
            className="d-flex align-items-center gap-2 border-0 fw-semibold"
            style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', padding: '7px 14px', borderRadius: 8, fontSize: 12 }}
          >
            ⚠ {pendingCount} pending
          </button>
        )}
        <div className="text-secondary d-none d-md-block" style={{ fontSize: 13 }}>{today}</div>
      </div>
    </div>
  );
}