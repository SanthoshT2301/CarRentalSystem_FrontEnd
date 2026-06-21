import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getAdminStats, getCars, createCar, deleteCar,
  getAllPromotions, addPromotion, togglePromotion, deletePromotion,
  getAllReviews, flagDispute, resolveDispute,
  getBookingReport, getRevenueReport, getReviewReport, getPerformanceReport,
  downloadReport,
  getAllBookings, getPendingUsers, approveUser,
  getAllUsers, setUserStatus, deleteUser,
} from '../services';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

import AdminSidebar from '../components/admin-dashboard/AdminSidebar';
import AdminTopbar from '../components/admin-dashboard/AdminTopbar';
import OverviewTab from '../components/admin-dashboard/OverviewTab';
import UserApprovalsTab from '../components/admin-dashboard/UserApprovalsTab';
import AllBookingsTab from '../components/admin-dashboard/AllBookingsTab';
import FleetManagementTab from '../components/admin-dashboard/FleetManagementTab';
import PromotionsTab from '../components/admin-dashboard/PromotionsTab';
import ReviewsDisputesTab from '../components/admin-dashboard/ReviewsDisputesTab';
import ReportsTab from '../components/admin-dashboard/ReportsTab';
import Modal from '../components/admin-dashboard/Modal';
import Toast from '../components/admin-dashboard/Toast';
import UserManagementTab from '../components/admin-dashboard/UserManagementTab';

const TODAY = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
const dateN = (n) => { const d = new Date(); d.setMonth(d.getMonth() - n); return d.toISOString().split('T')[0]; };

export default function AdminDashboard() {
  const { userName, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState({ msg: '', type: 'success' });
const [allUsers, setAllUsers] = useState([]);
const [userSearch, setUserSearch] = useState('');
const [roleFilter, setRoleFilter] = useState('All');
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

  const [showCarForm, setShowCarForm]   = useState(false);
  const [carForm, setCarForm] = useState({ make:'', model:'', year:2024, type:'Sedan', location:'Chennai', pricePerDay:1000, image:'', noSeats:5, transmission:'Automatic', color:'White', mileage:'Brand New' });
  const [carFormErr, setCarFormErr]     = useState('');
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [promoForm, setPromoForm] = useState({ code:'', discountPercent:10, description:'', active:true });
  const [disputeModal, setDisputeModal] = useState(null);
  const [disputeText, setDisputeText]   = useState('');

  function flash(msg, type = 'success') { setToast({ msg, type }); setTimeout(() => setToast({ msg: '', type: 'success' }), 3500); }

  useEffect(() => {
    getPendingUsers().then(r => setPendingCount(Array.isArray(r) ? r.length : (r?.data?.length ?? 0))).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'overview') {
      getAdminStats().then(setStats).catch(() => {});
      getAllBookings(1, 5).then(r => setRecentBooks(r.data || [])).catch(() => {});
    }
    if (tab === 'users') {
  getAllUsers().then(r => setAllUsers(r.data || [])).catch(() => {});
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

  async function handleApprove(userId, approve) {
    try {
      const r = await approveUser(userId, approve);
      const msg = r?.message || (approve ? 'User approved.' : 'User rejected.');
      flash(msg);
      setPendingUsers(p => p.filter(u => u.userId !== userId));
      setPendingCount(c => Math.max(0, c - 1));
    } catch (e) { flash(e.message, 'error'); }
  }


async function handleToggleUserActive(user) {
  const next = !user.isActive;
  if (!window.confirm(`${next ? 'Activate' : 'Deactivate'} ${user.firstName} ${user.lastName}?`)) return;
  try {
    await setUserStatus(user.userId, next);
    setAllUsers(u => u.map(x => x.userId === user.userId ? { ...x, isActive: next } : x));
    flash(`User ${next ? 'activated' : 'deactivated'}.`);
  } catch (e) { flash(e.message, 'error'); }
}

async function handleDeleteUser(user) {
  if (!window.confirm(`Permanently delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) return;
  try {
    await deleteUser(user.userId);
    setAllUsers(u => u.filter(x => x.userId !== user.userId));
    flash('User deleted.');
  } catch (e) { flash(e.message, 'error'); }
}



  async function handleCreateCar() {
    setCarFormErr('');
    try {
      const car = await createCar({ ...carForm, features: [carForm.transmission, 'GPS', carForm.color] });
      setCars(c => [car, ...c]);
      setShowCarForm(false);
      setCarForm({ make:'', model:'', year:2024, type:'Sedan', location:'Chennai', pricePerDay:1000, image:'', noSeats:5, transmission:'Automatic', color:'White', mileage:'Brand New' });
      flash('Car added to fleet!');
    } catch (e) { setCarFormErr(e.message); }
  }
  async function handleDeleteCar(id) {
    if (!window.confirm('Delete this car permanently?')) return;
    try { await deleteCar(id); setCars(c => c.filter(x => x.id !== id)); flash('Car deleted.'); }
    catch (e) { flash(e.message, 'error'); }
  }

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

  return (
    <div className="d-flex min-vh-100" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <AdminSidebar
        tab={tab} setTab={setTab} userName={userName} initial={initial}
        pendingCount={pendingCount} onLogout={() => { logout(); navigate('/'); }}
      />

      <div className="rr-content flex-grow-1">
        <AdminTopbar tab={tab} userName={userName} pendingCount={pendingCount} setTab={setTab} today={TODAY} />

        <div style={{ padding: '28px 32px' }}>

          {tab === 'overview' && (
            <OverviewTab
              stats={stats} recentBooks={recentBooks} pendingCount={pendingCount}
              setTab={setTab} setShowCarForm={setShowCarForm} setShowPromoForm={setShowPromoForm}
            />
          )}
          {tab === 'users' && (
  <UserManagementTab
    allUsers={allUsers}
    userSearch={userSearch}
    setUserSearch={setUserSearch}
    roleFilter={roleFilter}
    setRoleFilter={setRoleFilter}
    handleToggleUserActive={handleToggleUserActive}
    handleDeleteUser={handleDeleteUser}
  />
)}
          {tab === 'approvals' && (
            <UserApprovalsTab pendingUsers={pendingUsers} handleApprove={handleApprove} />
          )}

          {tab === 'bookings' && <AllBookingsTab />}

          {tab === 'fleet' && (
            <FleetManagementTab
              cars={cars} showCarForm={showCarForm} setShowCarForm={setShowCarForm}
              carForm={carForm} setCarForm={setCarForm} carFormErr={carFormErr} setCarFormErr={setCarFormErr}
              handleCreateCar={handleCreateCar} handleDeleteCar={handleDeleteCar}
            />
          )}

          {tab === 'promotions' && (
            <PromotionsTab
              promos={promos} showPromoForm={showPromoForm} setShowPromoForm={setShowPromoForm}
              promoForm={promoForm} setPromoForm={setPromoForm}
              handleAddPromo={handleAddPromo} handleTogglePromo={handleTogglePromo} handleDeletePromo={handleDeletePromo}
            />
          )}

          {tab === 'disputes' && (
            <ReviewsDisputesTab
              reviews={reviews} setDisputeModal={setDisputeModal} setDisputeText={setDisputeText} handleResolve={handleResolve}
            />
          )}

          {tab === 'reports' && (
            <ReportsTab
              reportType={reportType} setReportType={setReportType}
              dateRange={dateRange} setDateRange={setDateRange}
              loadReport={loadReport} reportData={reportData}
              downloadReport={downloadReport} flash={flash}
            />
          )}

        </div>
      </div>

      {disputeModal && (
        <Modal onClose={() => setDisputeModal(null)} title="🚩 Flag Dispute">
          <p className="text-secondary mb-3" style={{ fontSize:13 }}>Review by <strong>{disputeModal.userName}</strong> for <strong>{disputeModal.carName}</strong></p>
          <blockquote className="m-0 mb-3" style={{ background:'#f9f9f9', borderLeft:'3px solid #e0e0e0', padding:'10px 14px', borderRadius:6, fontSize:13, color:'#555' }}>{disputeModal.comment}</blockquote>
          <label className="rr-label">Reason / Resolution grounds</label>
          <textarea value={disputeText} onChange={e => setDisputeText(e.target.value)} rows={4}
            placeholder="Why is this review being disputed?"
            className="rr-input" style={{ resize:'none' }} />
          <div className="d-flex gap-2 mt-3">
            <button onClick={() => setDisputeModal(null)} className="flex-grow-1 border-0 fw-medium" style={{ padding:12, background:'#f5f5f5', borderRadius:10 }}>Cancel</button>
            <button onClick={handleFlag} disabled={!disputeText.trim()} className="flex-grow-1 border-0 fw-bold" style={{ padding:12, background: disputeText.trim() ? '#d97706' : '#e0e0e0', color: disputeText.trim() ? '#fff' : '#aaa', borderRadius:10, cursor: disputeText.trim() ? 'pointer' : 'not-allowed' }}>Flag Review</button>
          </div>
        </Modal>
      )}

      <Toast toast={toast} />
    </div>
  );
}