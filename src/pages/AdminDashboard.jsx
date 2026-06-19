import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStats, getCars, createCar, deleteCar,
  getAllPromotions, addPromotion, togglePromotion, deletePromotion,
  getAllReviews, flagDispute, resolveDispute,
  getBookingReport, getRevenueReport, getReviewReport, getPerformanceReport,
  downloadReport,                                          
  getAllBookings, getPendingUsers, approveUser,
} from '../api/api';
import { useAuth } from '../context/AuthContext';

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
const SIDEBAR_W = 210;
const dateN = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().split('T')[0]; };

/* ─── tiny shared style tokens ─── */
const S = {
  card: { background: '#fff', borderRadius: 14, boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #eee' },
  lbl: { display: 'block', fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 5, letterSpacing: 0.3 },
  inp: { width: '100%', padding: '9px 12px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box', background: '#fff' },
  th: { padding: '11px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#888', borderBottom: '1px solid #eee', letterSpacing: 0.4, whiteSpace: 'nowrap', background: '#f9f9f9' },
  td: { padding: '12px 14px', fontSize: 13, color: '#333', borderBottom: '1px solid #f5f5f5' },
  pgBtn: (ok) => ({ padding: '7px 16px', border: '1px solid #e0e0e0', borderRadius: 8, cursor: ok ? 'pointer' : 'not-allowed', background: '#fff', fontSize: 13, opacity: ok ? 1 : 0.4 }),
  badge: (bg, color) => ({ padding: '3px 11px', borderRadius: 20, fontSize: 11, fontWeight: 600, background: bg, color }),
};

const STATUS_CLR = {
  confirmed: { bg: '#dbeafe', color: '#2563eb' },
  completed:  { bg: '#dcfce7', color: '#16a34a' },
  cancelled:  { bg: '#fee2e2', color: '#dc2626' },
};

export default function AdminDashboard() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  /* per-tab data */
  const [stats, setStats]       = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [cars, setCars]         = useState([]);
  const [promos, setPromos]     = useState([]);
  const [reviews, setReviews]   = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportType, setReportType] = useState('bookings');
  const [dateRange, setDateRange] = useState({ start: dateN(1), end: new Date().toISOString().split('T')[0] });

  /* modals / forms */
  const [showCarForm, setShowCarForm]   = useState(false);
  const [carForm, setCarForm] = useState({ make:'', model:'', year:2024, type:'Sedan', location:'San Francisco', pricePerDay:60, image:'', noSeats:5, transmission:'Automatic', color:'White', mileage:'Brand New' });
  const [carFormErr, setCarFormErr]     = useState('');
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({ code:'', discountPercent:10, description:'', active:true });
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeText, setDisputeText]   = useState('');

  function flash(msg, type = 'success') { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3500); }

  /* ── load pending count on mount (badge) ── */
  useEffect(() => {
    getPendingUsers().then(r => setPendingCount(Array.isArray(r) ? r.length : (r?.data?.length ?? 0))).catch(() => {});
  }, []);

  /* ── load per-tab data ── */
  useEffect(() => {
    if (tab === 'overview') {
      getAdminStats().then(setStats).catch(() => {});
      getAllBookings(1, 5).then(r => setRecentBooks(r.data || [])).catch(() => {});
    }
    if (tab === 'approvals') {
      getPendingUsers()
        .then(r => { const arr = Array.isArray(r) ? r : (r?.data || []); setPendingUsers(arr); setPendingCount(arr.length); })
        .catch(() => {});
    }
    if (tab === 'fleet') getCars(1, 50).then(r => setCars(r.data || [])).catch(() => {});
    if (tab === 'promotions') getAllPromotions().then(p => setPromos(Array.isArray(p) ? p : [])).catch(() => {});
    if (tab === 'disputes') getAllReviews(1, 100).then(r => setReviews(r.data || [])).catch(() => {});
    if (tab === 'reports') loadReport();
  }, [tab]);

  async function loadReport() {
    try {
      const { start, end } = dateRange;
      let r;
      if (reportType === 'bookings')    r = await getBookingReport(start, end);
      else if (reportType === 'revenue') r = await getRevenueReport(start, end);
      else if (reportType === 'reviews') r = await getReviewReport(start, end);
      else                               r = await getPerformanceReport(start, end);
      setReportData(r.data || r || []);
    } catch (e) { flash(e.message, 'error'); }
  }
  useEffect(() => { if (tab === 'reports') loadReport(); }, [reportType, dateRange]);

  /* ── approval actions ── */
  async function handleApprove(userId, approve) {
    try {
      const r = await approveUser(userId, approve);
      const msg = r?.message || (approve ? 'User approved.' : 'User rejected.');
      flash(msg);
      setPendingUsers(p => p.filter(u => u.userId !== userId));
      setPendingCount(c => Math.max(0, c - 1));
    } catch (e) { flash(e.message, 'error'); }
  }

  /* ── car actions ── */
  async function handleCreateCar() {
    setCarFormErr('');
    try {
      const car = await createCar({ ...carForm, features: [carForm.transmission, 'GPS', carForm.color] });
      setCars(c => [car, ...c]);
      setShowCarForm(false);
      setCarForm({ make:'', model:'', year:2024, type:'Sedan', location:'San Francisco', pricePerDay:60, image:'', noSeats:5, transmission:'Automatic', color:'White', mileage:'Brand New' });
      flash('Car added to fleet!');
    } catch (e) { setCarFormErr(e.message); }
  }
  async function handleDeleteCar(id) {
    if (!window.confirm('Delete this car permanently?')) return;
    try { await deleteCar(id); setCars(c => c.filter(x => x.id !== id)); flash('Car deleted.'); }
    catch (e) { flash(e.message, 'error'); }
  }

  /* ── promo actions ── */
  async function handleAddPromo() {
    try {
      const p = await addPromotion(promoForm);
      setPromos(prev => [p, ...prev]);
      setShowPromoForm(false);
      setPromoForm({ code:'', discountPercent:10, description:'', active:true });
      flash('Promotion created!');
    } catch (e) { flash(e.message, 'error'); }
  }
  async function handleTogglePromo(id) {
    try {
      const r = await togglePromotion(id);
      setPromos(p => p.map(x => x.promotionId === id ? { ...x, active: r.activeStatus } : x));
    } catch (e) { flash(e.message, 'error'); }
  }
  async function handleDeletePromo(id) {
    if (!window.confirm('Delete promotion?')) return;
    try { await deletePromotion(id); setPromos(p => p.filter(x => x.promotionId !== id)); flash('Promotion deleted.'); }
    catch (e) { flash(e.message, 'error'); }
  }

  /* ── dispute actions ── */
  async function handleFlag() {
    try {
      await flagDispute(disputeModal.reviewId, disputeText);
      setReviews(r => r.map(x => x.reviewId === disputeModal.reviewId ? { ...x, isDisputed: true, disputeResolution: disputeText } : x));
      setDisputeModal(null);
      flash('Review flagged.');
    } catch (e) { flash(e.message, 'error'); }
  }
  async function handleResolve(reviewId, action) {
    try {
      await resolveDispute(reviewId, action);
      if (action === 'remove') setReviews(r => r.filter(x => x.reviewId !== reviewId));
      else setReviews(r => r.map(x => x.reviewId === reviewId ? { ...x, isDisputed: false, disputeResolution: 'Resolved: Feedback approved and retained.' } : x));
      flash(`Review ${action === 'remove' ? 'removed' : 'kept'}.`);
    } catch (e) { flash(e.message, 'error'); }
  }

  const initial = userName ? userName.charAt(0).toUpperCase() : 'A';

  const MENU = [
    { key: 'overview',   icon: '📊', label: 'Overview' },
    { key: 'approvals',  icon: '✅', label: 'User Approvals', badge: pendingCount },
    { key: 'bookings',   icon: '📋', label: 'All Bookings' },
    { key: 'fleet',      icon: '🚗', label: 'Fleet Management' },
    { key: 'promotions', icon: '🎟', label: 'Promotions' },
    { key: 'disputes',   icon: '🛡', label: 'Reviews & Disputes' },
    { key: 'reports',    icon: '📈', label: 'Reports' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>

      {/* ── Sidebar ── */}
      <div style={{ width: SIDEBAR_W, background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 20 }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚗</div>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
        </div>
        <div style={{ padding: '14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#e85d24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{initial}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ color: '#e85d24', fontSize: 11 }}>Administrator</div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {MENU.map(m => (
            <button key={m.key} onClick={() => setTab(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: 9, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === m.key ? '#e85d2430' : 'transparent',
              color: tab === m.key ? '#e85d24' : '#aaa',
              fontWeight: tab === m.key ? 600 : 400, fontSize: 13, textAlign: 'left',
              marginBottom: 2, transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 14 }}>{m.icon}</span>
              <span style={{ flex: 1 }}>{m.label}</span>
              {m.badge > 0 && (
                <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px' }}>{m.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div style={{ padding: '10px 8px', borderTop: '1px solid #2a2a2a' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{ display: 'flex', alignItems: 'center', gap: 9, width: '100%', padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#e85d24', fontSize: 13 }}>
            🚪 Logout
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{ marginLeft: SIDEBAR_W, flex: 1, background: '#f1f0ea', minHeight: '100vh' }}>
        {/* Topbar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{MENU.find(m => m.key === tab)?.label}</div>
            <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {pendingCount > 0 && tab !== 'approvals' && (
              <button onClick={() => setTab('approvals')} style={{ background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                ⚠ {pendingCount} pending approval{pendingCount > 1 ? 's' : ''}
              </button>
            )}
            <div style={{ color: '#888', fontSize: 13 }}>{TODAY}</div>
          </div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* ════════════ OVERVIEW ════════════ */}
          {tab === 'overview' && (
            <div>
              {pendingCount > 0 && (
                <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>⚠️</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: '#92400e' }}>Pending User Approvals</div>
                      <div style={{ color: '#a16207', fontSize: 13 }}>{pendingCount} agent/admin account{pendingCount > 1 ? 's' : ''} waiting for your approval</div>
                    </div>
                  </div>
                  <button onClick={() => setTab('approvals')} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>Review Now →</button>
                </div>
              )}

              {/* Stat cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 18, marginBottom: 24 }}>
                {[
                  { label: 'Total Users',    value: stats?.usersCount    ?? '—', icon: '👥', bg: '#dbeafe', ic: '#2563eb' },
                  { label: 'Total Cars',     value: stats?.carsCount     ?? '—', icon: '🚗', bg: '#dcfce7', ic: '#16a34a' },
                  { label: 'Total Bookings', value: stats?.bookingsCount ?? '—', icon: '📋', bg: '#fef3c7', ic: '#d97706' },
                  { label: 'Revenue',        value: stats ? `$${Number(stats.revenue).toLocaleString()}` : '—', icon: '💰', bg: '#fce7f3', ic: '#db2777' },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 48, height: 48, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>
                    <div>
                      <div style={{ color: '#888', fontSize: 12, marginBottom: 3 }}>{s.label}</div>
                      <div style={{ fontWeight: 800, fontSize: 26, color: '#111' }}>{s.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
                {[
                  { label: 'Review Approvals', icon: '✅', action: () => setTab('approvals'), color: '#f59e0b', show: pendingCount > 0 },
                  { label: 'Add a Car',        icon: '🚗', action: () => { setTab('fleet'); setTimeout(() => setShowCarForm(true), 100); }, color: '#e85d24', show: true },
                  { label: 'Create Promotion', icon: '🎟', action: () => { setTab('promotions'); setTimeout(() => setShowPromoForm(true), 100); }, color: '#7c3aed', show: true },
                  { label: 'View Reports',     icon: '📈', action: () => setTab('reports'), color: '#059669', show: true },
                ].filter(qa => qa.show).map(qa => (
                  <button key={qa.label} onClick={qa.action} style={{ ...S.card, padding: '16px 18px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
                    <div style={{ width: 40, height: 40, background: qa.color + '20', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{qa.icon}</div>
                    <span style={{ fontWeight: 600, fontSize: 13, color: '#111' }}>{qa.label}</span>
                    <span style={{ marginLeft: 'auto', color: '#ccc' }}>→</span>
                  </button>
                ))}
              </div>

              {/* Recent bookings */}
              <div style={{ ...S.card, padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 22px', borderBottom: '1px solid #f0f0f0' }}>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Recent Bookings</div>
                  <button onClick={() => setTab('bookings')} style={{ background: 'none', border: 'none', color: '#e85d24', fontSize: 13, cursor: 'pointer', fontWeight: 500 }}>View all →</button>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr>{['ID','Pickup','Drop-off','Date','Amount','Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {recentBooks.map(b => (
                      <tr key={b.id}>
                        <td style={S.td}>#{b.id}</td>
                        <td style={S.td}>{b.pickupLocation}</td>
                        <td style={S.td}>{b.dropoffLocation}</td>
                        <td style={S.td}>{b.pickupDate}</td>
                        <td style={{ ...S.td, fontWeight: 600, color: '#e85d24' }}>${b.totalAmount}</td>
                        <td style={S.td}><StatusBadge status={b.status} /></td>
                      </tr>
                    ))}
                    {recentBooks.length === 0 && <tr><td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#aaa' }}>No bookings yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ════════════ USER APPROVALS ════════════ */}
          {tab === 'approvals' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 4 }}>Pending User Approvals</div>
                  <div style={{ color: '#888', fontSize: 14 }}>Agent and Admin accounts require your approval before they can log in.</div>
                </div>
                {pendingUsers.length > 0 && (
                  <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 10, padding: '8px 16px', color: '#92400e', fontWeight: 700, fontSize: 14 }}>
                    {pendingUsers.length} pending
                  </div>
                )}
              </div>

              {/* Info box */}
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12, padding: '14px 20px', marginBottom: 24, display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 18 }}>ℹ️</span>
                <div style={{ fontSize: 13, color: '#1e40af', lineHeight: 1.6 }}>
                  <strong>How it works:</strong> When a new Agent or Admin registers, their account is created with <code>IsApproved = false</code>. They receive an email notification and <strong>cannot log in</strong> until you approve their account here. Customers are auto-approved on registration.
                </div>
              </div>

              {pendingUsers.length === 0 ? (
                <div style={{ ...S.card, padding: '60px 40px', textAlign: 'center' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                  <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>All caught up!</div>
                  <div style={{ color: '#888', fontSize: 14 }}>No pending approvals at the moment.</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {pendingUsers.map(u => (
                    <div key={u.userId} style={{ ...S.card, padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                      {/* Avatar */}
                      <div style={{ width: 50, height: 50, background: u.role === 'Agent' ? '#dbeafe' : '#fce7f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 20, color: u.role === 'Agent' ? '#2563eb' : '#db2777', flexShrink: 0 }}>
                        {(u.firstName || '?').charAt(0).toUpperCase()}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700, fontSize: 16 }}>{u.firstName} {u.lastName}</span>
                          <span style={{ ...S.badge(u.role === 'Agent' ? '#dbeafe' : '#fce7f3', u.role === 'Agent' ? '#2563eb' : '#db2777') }}>
                            {u.role === 'Agent' ? '🔧 Agent' : '👑 Admin'}
                          </span>
                        </div>
                        <div style={{ color: '#555', fontSize: 13, marginBottom: 3 }}>📧 {u.email}</div>
                        {u.phone && <div style={{ color: '#888', fontSize: 12 }}>📞 {u.phone}</div>}
                        <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>
                          Registered: {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                        </div>
                      </div>

                      {/* Role description */}
                      <div style={{ background: '#f9f9f9', borderRadius: 10, padding: '12px 16px', fontSize: 12, color: '#666', maxWidth: 220, lineHeight: 1.5 }}>
                        {u.role === 'Agent'
                          ? '🔧 Can manage bookings, gate check-in/out, and report maintenance alerts.'
                          : '👑 Will have full admin access including approvals, fleet, promotions and reports.'}
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button onClick={() => handleApprove(u.userId, true)} style={{ padding: '9px 22px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          ✓ Approve
                        </button>
                        <button onClick={() => handleApprove(u.userId, false)} style={{ padding: '9px 22px', background: '#fff', color: '#dc2626', border: '1.5px solid #fca5a5', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}>
                          ✕ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ════════════ ALL BOOKINGS ════════════ */}
          {tab === 'bookings' && <AllBookingsTab />}

          {/* ════════════ FLEET ════════════ */}
          {tab === 'fleet' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 22 }}>Fleet Management</div>
                <button onClick={() => setShowCarForm(true)} style={{ background: '#e85d24', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>+ Add Car</button>
              </div>

              {showCarForm && (
                <div style={{ ...S.card, padding: 28, marginBottom: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Add New Car</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
                    {[['make','Make (Brand)'],['model','Model'],['year','Year'],['type','Type'],['location','Location'],['pricePerDay','Price/Day ($)'],['noSeats','Seats'],['transmission','Transmission'],['color','Color'],['mileage','Mileage']].map(([k, l]) => (
                      <div key={k}>
                        <label style={S.lbl}>{l}</label>
                        {k === 'type' ? (
                          <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp}>
                            {['Sedan','SUV','Luxury','Compact','Hatchback'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        ) : k === 'location' ? (
                          <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp}>
                            {['San Francisco','New York','Denver','Los Angeles'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        ) : k === 'transmission' ? (
                          <select value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} style={S.inp}>
                            {['Automatic','Manual'].map(t => <option key={t}>{t}</option>)}
                          </select>
                        ) : (
                          <input value={carForm[k]} onChange={e => setCarForm(f => ({ ...f, [k]: e.target.value }))} type={['year','pricePerDay','noSeats'].includes(k) ? 'number' : 'text'} style={S.inp} placeholder={l} />
                        )}
                      </div>
                    ))}
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={S.lbl}>Image URL</label>
                      <input value={carForm.image} onChange={e => setCarForm(f => ({ ...f, image: e.target.value }))} style={S.inp} placeholder="https://..." />
                    </div>
                  </div>
                  {carFormErr && <p style={{ color: '#dc2626', fontSize: 13, marginTop: 10 }}>{carFormErr}</p>}
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={() => { setShowCarForm(false); setCarFormErr(''); }} style={{ padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={handleCreateCar} style={{ padding: '10px 24px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Add Car</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                {cars.map(car => (
                  <div key={car.id} style={{ ...S.card, overflow: 'hidden' }}>
                    <div style={{ position: 'relative', height: 150 }}>
                      <img src={car.image} alt={car.make} style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'; }} />
                      <span style={{ position: 'absolute', top: 10, left: 10, ...S.badge(car.available ? '#16a34a' : '#dc2626', '#fff') }}>{car.available ? 'Available' : 'Unavailable'}</span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <div style={{ fontWeight: 700 }}>{car.make} {car.model}</div>
                        <div style={{ color: '#e85d24', fontWeight: 700 }}>${car.pricePerDay}/day</div>
                      </div>
                      <div style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>{car.type} · {car.location} · {car.year}</div>
                      <button onClick={() => handleDeleteCar(car.id)} style={{ width: '100%', padding: '8px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>🗑 Delete Car</button>
                    </div>
                  </div>
                ))}
                {cars.length === 0 && <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60, color: '#aaa' }}>No cars in fleet.</div>}
              </div>
            </div>
          )}

          {/* ════════════ PROMOTIONS ════════════ */}
          {tab === 'promotions' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <div style={{ fontWeight: 700, fontSize: 22 }}>Promotions</div>
                <button onClick={() => setShowPromoForm(true)} style={{ background: '#7c3aed', color: '#fff', border: 'none', padding: '10px 22px', borderRadius: 10, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>+ Create Promo</button>
              </div>

              {showPromoForm && (
                <div style={{ ...S.card, padding: 28, marginBottom: 24 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>New Promotion</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                    <div>
                      <label style={S.lbl}>Promo Code</label>
                      <input value={promoForm.code} onChange={e => setPromoForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} style={S.inp} placeholder="e.g. SUMMER25" />
                    </div>
                    <div>
                      <label style={S.lbl}>Discount (%)</label>
                      <input type="number" min={1} max={100} value={promoForm.discountPercent} onChange={e => setPromoForm(f => ({ ...f, discountPercent: +e.target.value }))} style={S.inp} />
                    </div>
                    <div style={{ gridColumn: '1/-1' }}>
                      <label style={S.lbl}>Description</label>
                      <input value={promoForm.description} onChange={e => setPromoForm(f => ({ ...f, description: e.target.value }))} style={S.inp} placeholder="Short description..." />
                    </div>
                    <div>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500, color: '#444' }}>
                        <input type="checkbox" checked={promoForm.active} onChange={e => setPromoForm(f => ({ ...f, active: e.target.checked }))} style={{ width: 15, height: 15, accentColor: '#7c3aed' }} />
                        Active immediately
                      </label>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                    <button onClick={() => setShowPromoForm(false)} style={{ padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                    <button onClick={handleAddPromo} style={{ padding: '10px 24px', background: '#7c3aed', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Create</button>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {promos.map(p => (
                  <div key={p.promotionId} style={{ ...S.card, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                    <div style={{ width: 52, height: 52, background: p.active ? '#f3e8ff' : '#f5f5f5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>🎟</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                        <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: 1 }}>{p.code}</span>
                        <span style={S.badge('#f3e8ff', '#7c3aed')}>{p.discountPercent}% OFF</span>
                        <span style={S.badge(p.active ? '#dcfce7' : '#f5f5f5', p.active ? '#16a34a' : '#888')}>{p.active ? 'Active' : 'Inactive'}</span>
                      </div>
                      <div style={{ color: '#888', fontSize: 13 }}>{p.description}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleTogglePromo(p.promotionId)} style={{ padding: '7px 16px', border: `1.5px solid ${p.active ? '#fca5a5' : '#bbf7d0'}`, color: p.active ? '#dc2626' : '#16a34a', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                        {p.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => handleDeletePromo(p.promotionId)} style={{ padding: '7px 12px', border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>🗑</button>
                    </div>
                  </div>
                ))}
                {promos.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>No promotions yet.</div>}
              </div>
            </div>
          )}

          {/* ════════════ REVIEWS & DISPUTES ════════════ */}
          {tab === 'disputes' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 6 }}>Reviews & Disputes</div>
              <div style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>Flag suspicious reviews or resolve existing disputes.</div>

              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {[
                  { label: 'All Reviews', count: reviews.length, color: '#2563eb' },
                  { label: 'Disputed', count: reviews.filter(r => r.isDisputed).length, color: '#d97706' },
                ].map(s => (
                  <div key={s.label} style={{ ...S.card, padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: 24, color: s.color }}>{s.count}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map(r => (
                  <div key={r.reviewId} style={{ ...S.card, padding: '20px 24px', borderLeft: r.isDisputed ? '3px solid #f59e0b' : '3px solid transparent' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                          <span style={{ fontWeight: 700 }}>{r.carName}</span>
                          {r.isDisputed && <span style={S.badge('#fef3c7', '#d97706')}>⚠ Disputed</span>}
                        </div>
                        <div style={{ color: '#888', fontSize: 12, marginBottom: 6 }}>by {r.userName} · {r.createdAt?.split(' ')[0]}</div>
                        <div style={{ color: '#f59e0b', fontSize: 14 }}>{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        {!r.isDisputed && (
                          <button onClick={() => { setDisputeModal(r); setDisputeText(''); }} style={{ padding: '7px 16px', border: '1.5px solid #fde68a', color: '#d97706', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>🚩 Flag</button>
                        )}
                        {r.isDisputed && (
                          <>
                            <button onClick={() => handleResolve(r.reviewId, 'keep')} style={{ padding: '7px 16px', border: '1.5px solid #bbf7d0', color: '#16a34a', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✓ Keep</button>
                            <button onClick={() => handleResolve(r.reviewId, 'remove')} style={{ padding: '7px 16px', border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕ Remove</button>
                          </>
                        )}
                      </div>
                    </div>
                    <p style={{ color: '#555', fontSize: 13, lineHeight: 1.5, margin: 0 }}>{r.comment}</p>
                    {r.isDisputed && r.disputeResolution && (
                      <div style={{ marginTop: 10, background: '#fffbeb', padding: '8px 12px', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
                        📝 Grounds: {r.disputeResolution}
                      </div>
                    )}
                  </div>
                ))}
                {reviews.length === 0 && <div style={{ textAlign: 'center', padding: 60, color: '#aaa' }}>No reviews yet.</div>}
              </div>
            </div>
          )}

          {/* ════════════ REPORTS ════════════ */}
          {tab === 'reports' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 24 }}>Reports</div>
              <div style={{ ...S.card, padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                  <label style={S.lbl}>Report Type</label>
                  <select value={reportType} onChange={e => setReportType(e.target.value)} style={{ ...S.inp, width: 180 }}>
                    {[['bookings','Bookings'],['revenue','Revenue'],['reviews','Reviews'],['performance','Car Performance']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label style={S.lbl}>Start Date</label>
                  <input type="date" value={dateRange.start} onChange={e => setDateRange(d => ({ ...d, start: e.target.value }))} style={S.inp} />
                </div>
                <div>
                  <label style={S.lbl}>End Date</label>
                  <input type="date" value={dateRange.end} onChange={e => setDateRange(d => ({ ...d, end: e.target.value }))} style={S.inp} />
                </div>
                <button onClick={loadReport} style={{ padding: '9px 22px', background: '#059669', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>▶ Run</button>
                <button
  onClick={async () => {
    try {
      await downloadReport(reportType, dateRange.start, dateRange.end);
    } catch (e) {
      flash(e.message, 'error');
    }
  }}
  style={{ padding: '9px 22px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}
>
  ⬇ CSV
</button>
              </div>
              <div style={{ ...S.card, overflow: 'hidden' }}>
                {reportData.length === 0 ? (
                  <div style={{ padding: 60, textAlign: 'center', color: '#aaa' }}>No data for selected range.</div>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead><tr>{Object.keys(reportData[0]).map(k => <th key={k} style={S.th}>{k.replace(/([A-Z])/g,' $1').trim().toUpperCase()}</th>)}</tr></thead>
                      <tbody>
                        {reportData.map((row, i) => (
                          <tr key={i}>
                            {Object.entries(row).map(([k, v]) => (
                              <td key={k} style={S.td}>
                                {typeof v === 'boolean' ? (v ? '✓' : '✗') :
                                 (k.match(/amount|revenue|gross|refund/i)) ? `$${Number(v).toFixed(2)}` :
                                 k.match(/rate/i) ? `${v}%` : String(v)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Dispute Flag Modal ── */}
      {disputeModal && (
        <Modal onClose={() => setDisputeModal(null)} title="🚩 Flag Dispute">
          <p style={{ color: '#666', fontSize: 13, marginBottom: 14 }}>Review by <strong>{disputeModal.userName}</strong> for <strong>{disputeModal.carName}</strong></p>
          <blockquote style={{ background: '#f9f9f9', borderLeft: '3px solid #e0e0e0', padding: '10px 14px', borderRadius: 6, fontSize: 13, color: '#555', margin: '0 0 16px' }}>{disputeModal.comment}</blockquote>
          <label style={S.lbl}>Reason / Resolution grounds</label>
          <textarea value={disputeText} onChange={e => setDisputeText(e.target.value)} rows={4}
            placeholder="Why is this review being disputed?"
            style={{ ...S.inp, resize: 'none' }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button onClick={() => setDisputeModal(null)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
            <button onClick={handleFlag} disabled={!disputeText.trim()} style={{ flex: 1, padding: '12px', background: disputeText.trim() ? '#d97706' : '#e0e0e0', color: disputeText.trim() ? '#fff' : '#aaa', border: 'none', borderRadius: 10, cursor: disputeText.trim() ? 'pointer' : 'not-allowed', fontWeight: 700 }}>Flag Review</button>
          </div>
        </Modal>
      )}

      {/* ── Toast ── */}
      {toast.msg && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: toast.type === 'error' ? '#dc2626' : '#1a1a1a', color: '#fff', padding: '13px 22px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500, zIndex: 9999, display: 'flex', alignItems: 'center', gap: 10 }}>
          {toast.type === 'error' ? '⚠' : '✓'} {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ── All Bookings sub-component ── */
function AllBookingsTab() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    getAllBookings(page, 20).then(r => { setData(r.data || []); setTotalPages(r.totalPages || 1); }).catch(() => {});
  }, [page]);

  const filtered = data.filter(b => {
    if (statusFilter !== 'All' && b.status !== statusFilter.toLowerCase()) return false;
    if (search && !`${b.pickupLocation} ${b.dropoffLocation} ${b.id}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const STATUS_CLR = { confirmed: { bg:'#dbeafe', color:'#2563eb' }, completed:{ bg:'#dcfce7', color:'#16a34a' }, cancelled:{ bg:'#fee2e2', color:'#dc2626' } };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 22 }}>All Bookings</div>
        <div style={{ display: 'flex', gap: 10 }}>
          {['All','Confirmed','Completed','Cancelled'].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500, background: statusFilter === s ? '#1a1a1a' : '#f0f0f0', color: statusFilter === s ? '#fff' : '#555' }}>{s}</button>
          ))}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ padding: '7px 14px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, outline: 'none', width: 180 }} />
        </div>
      </div>
      <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #eee' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['ID','Car ID','User ID','Pickup','Drop-off','Pickup Date','Return Date','Amount','Status','Type'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr></thead>
          <tbody>
            {filtered.map(b => (
              <tr key={b.id}>
                <td style={S.td}>#{b.id}</td>
                <td style={S.td}>{b.carId}</td>
                <td style={S.td}>{b.userId}</td>
                <td style={S.td}>{b.pickupLocation}</td>
                <td style={S.td}>{b.dropoffLocation}</td>
                <td style={S.td}>{b.pickupDate}</td>
                <td style={S.td}>{b.dropoffDate}</td>
                <td style={{ ...S.td, fontWeight: 600, color: '#e85d24' }}>${b.totalAmount}</td>
                <td style={S.td}><StatusBadge status={b.status} /></td>
                <td style={S.td}><span style={{ fontSize: 11, padding:'2px 8px', borderRadius:20, background: b.isHourly?'#fef3ee':'#f0fdf4', color: b.isHourly?'#e85d24':'#16a34a', fontWeight:500 }}>{b.isHourly?'Hourly':'Daily'}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={10} style={{ padding:40, textAlign:'center', color:'#aaa' }}>No bookings found.</td></tr>}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:20 }}>
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} style={S.pgBtn(page>1)}>← Prev</button>
          <span style={{ padding:'7px 14px', background:'#fff', border:'1px solid #e0e0e0', borderRadius:8, fontSize:13 }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} style={S.pgBtn(page<totalPages)}>Next →</button>
        </div>
      )}
    </div>
  );
}

/* ── Helpers ── */
function StatusBadge({ status }) {
  const map = { confirmed:{ bg:'#dbeafe', color:'#2563eb' }, completed:{ bg:'#dcfce7', color:'#16a34a' }, cancelled:{ bg:'#fee2e2', color:'#dc2626' } };
  const s = map[status] || { bg:'#f5f5f5', color:'#888' };
  return <span style={{ padding:'3px 10px', borderRadius:20, fontSize:11, fontWeight:600, background:s.bg, color:s.color, textTransform:'capitalize' }}>{status}</span>;
}

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999 }}>
      <div style={{ background:'#fff', borderRadius:20, padding:36, width:460, boxShadow:'0 20px 60px rgba(0,0,0,0.25)' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <h3 style={{ fontWeight:800, margin:0, fontSize:18 }}>{title}</h3>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:22, cursor:'pointer', color:'#aaa', lineHeight:1 }}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
}