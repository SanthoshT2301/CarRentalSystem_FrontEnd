import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars, getMyBookings, cancelBooking, addReview, getAllReviews, extendReservation } from '../api/api';
import { useAuth } from '../context/AuthContext';

const SIDEBAR_WIDTH = 170;
const today = new Date().toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });

export default function CustomerDashboard() {
  const { userId, userName, role, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('browse');

  // Browse Cars state
  const [cars, setCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(true);
  const [carSearch, setCarSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [cityFilter, setCityFilter] = useState('All');
  const [availFilter, setAvailFilter] = useState('All');
  const [maxPrice, setMaxPrice] = useState(200);
  const [carPage, setCarPage] = useState(1);
  const [carTotalPages, setCarTotalPages] = useState(1);

  // Reservations state
  const [bookings, setBookings] = useState([]);
  const [bookPage, setBookPage] = useState(1);
  const [bookTotalPages, setBookTotalPages] = useState(1);

  // Reviews state
  const [myReviews, setMyReviews] = useState([]);
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  // Extend reservation state
  const [extendModal, setExtendModal] = useState(null);
  const [extendDate, setExtendDate] = useState('');
  const [extendHours, setExtendHours] = useState(1);   // ← NEW: for hourly extension
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendResult, setExtendResult] = useState(null);
  const [extendError, setExtendError] = useState('');

  // Toast
  const [toast, setToast] = useState('');

  function showToast(msg) { setToast(msg); setTimeout(() => setToast(''), 3000); }

  useEffect(() => {
    setCarsLoading(true);
    getCars(carPage, 9).then(r => {
      setCars(r.data || []);
      setCarTotalPages(r.totalPages || 1);
    }).finally(() => setCarsLoading(false));
  }, [carPage]);

  useEffect(() => {
    getMyBookings(userId, bookPage, 10).then(r => {
      setBookings(r.data || []);
      setBookTotalPages(r.totalPages || 1);
    }).catch(() => {});
  }, [bookPage]);

  useEffect(() => {
    getAllReviews(1, 50).then(r => {
      const mine = (r.data || []).filter(rv => String(rv.userId) === String(userId));
      setMyReviews(mine);
    }).catch(() => {});
  }, []);

  const CITIES = ['All', ...Array.from(new Set(cars.map(c => c.location).filter(Boolean)))];
  const TYPES = ['All', 'Sedan', 'SUV', 'Hatchback', 'Luxury', 'Compact'];

  const filteredCars = cars.filter(c => {
    if (typeFilter !== 'All' && c.type?.toLowerCase() !== typeFilter.toLowerCase()) return false;
    if (cityFilter !== 'All' && c.location !== cityFilter) return false;
    if (availFilter === 'Available' && !c.available) return false;
    if (availFilter === 'Unavailable' && c.available) return false;
    if (c.pricePerDay > maxPrice) return false;
    if (carSearch && !`${c.make} ${c.model} ${c.type} ${c.location}`.toLowerCase().includes(carSearch.toLowerCase())) return false;
    return true;
  });

  async function handleCancel(id) {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await cancelBooking(id, userId, false);
      setBookings(b => b.map(r => r.id === id ? { ...r, status: 'cancelled' } : r));
      showToast('Booking cancelled.');
    } catch (e) { showToast(e.message); }
  }

  async function submitReview() {
    try {
      await addReview(userId, { reservationId: reviewModal.id, rating: reviewRating, comment: reviewComment });
      showToast('Review submitted!');
      setReviewModal(null);
      setReviewMsg('');
    } catch (e) { setReviewMsg(e.message); }
  }

  // ── Extend logic ──────────────────────────────────────────────────────────
  function openExtendModal(booking) {
    if (booking.isHourly) {
      setExtendDate('');
      setExtendHours(1);
    } else {
      const currentDrop = new Date(booking.dropoffDate);
      currentDrop.setDate(currentDrop.getDate() + 1);
      setExtendDate(currentDrop.toISOString().split('T')[0]);
      setExtendHours(0);
    }
    setExtendError('');
    setExtendResult(null);
    setExtendModal(booking);
  }

  async function handleExtend() {
    if (extendModal.isHourly) {
      if (!extendHours || extendHours < 1) { setExtendError('Please enter at least 1 hour.'); return; }
    } else {
      if (!extendDate) { setExtendError('Please select a new drop-off date.'); return; }
    }
    setExtendLoading(true);
    setExtendError('');
    setExtendResult(null);
    try {
      const result = await extendReservation(
        extendModal.id,
        userId,
        extendModal.isHourly ? null : extendDate,
        extendModal.isHourly ? parseInt(extendHours) : null
      );
      setExtendResult(result);
      setBookings(prev => prev.map(b =>
        b.id === extendModal.id
          ? { ...b, dropoffDate: result.newDropoffDate, totalAmount: result.newTotalAmount, isExtended: true }
          : b
      ));
    } catch (e) {
      setExtendError(e.message);
    } finally {
      setExtendLoading(false);
    }
  }

  function closeExtendModal() {
    if (extendResult) showToast('Reservation extended successfully!');
    setExtendModal(null);
    setExtendResult(null);
    setExtendError('');
    setExtendDate('');
    setExtendHours(1);
  }

  const completedWithoutReview = bookings.filter(b =>
    b.status === 'completed' && !myReviews.some(r => r.reservationId === b.id)
  );

  const firstInitial = userName ? userName.charAt(0).toUpperCase() : 'U';
  const email = userName ? userName.toLowerCase().replace(' ', '.') + '@example.com' : '';

  const MENU = [
    { key: 'browse', icon: '🚗', label: 'Browse Cars' },
    { key: 'reservations', icon: '📋', label: 'My Reservations' },
    { key: 'reviews', icon: '⭐', label: 'My Reviews' },
    { key: 'profile', icon: '👤', label: 'Profile' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: SIDEBAR_WIDTH, background: '#1a1a1a', color: '#fff', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 10 }}>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, background: '#e85d24', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🚗</div>
          <span style={{ fontWeight: 700, fontSize: 12, letterSpacing: 1 }}>ROADREADY</span>
        </div>
        <div style={{ padding: '16px 14px', borderBottom: '1px solid #2a2a2a' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: '#e85d24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, color: '#fff', flexShrink: 0 }}>{firstInitial}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
              <div style={{ color: '#e85d24', fontSize: 11 }}>Customer</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {MENU.map(m => (
            <button key={m.key} onClick={() => setTab(m.key)} style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: tab === m.key ? '#e85d2430' : 'transparent',
              color: tab === m.key ? '#e85d24' : '#aaa',
              fontWeight: tab === m.key ? 600 : 400, fontSize: 13, textAlign: 'left', marginBottom: 2,
              transition: 'all 0.15s',
            }}>
              <span style={{ fontSize: 15 }}>{m.icon}</span> {m.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px 8px', borderTop: '1px solid #2a2a2a' }}>
          <button onClick={() => { logout(); navigate('/'); }} style={{
            display: 'flex', alignItems: 'center', gap: 10, width: '100%',
            padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: 'transparent', color: '#e85d24', fontSize: 13,
          }}>🚪 Logout</button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginLeft: SIDEBAR_WIDTH, flex: 1, background: '#f1f0ea', minHeight: '100vh' }}>
        {/* Top bar */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>
              {tab === 'browse' ? 'Browse Cars' : tab === 'reservations' ? 'My Reservations' : tab === 'reviews' ? 'Reviews' : 'Profile'}
            </div>
            <div style={{ color: '#888', fontSize: 13 }}>Welcome back, {userName}</div>
          </div>
          <div style={{ color: '#888', fontSize: 13 }}>{today}</div>
        </div>

        <div style={{ padding: '28px 32px' }}>

          {/* ─── BROWSE CARS ─── */}
          {tab === 'browse' && (
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Filter panel */}
              <div style={{ width: 200, flexShrink: 0 }}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Filters</div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>CAR TYPE</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {TYPES.map(t => (
                        <button key={t} onClick={() => setTypeFilter(t)} style={{
                          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
                          background: typeFilter === t ? '#e85d24' : '#f0f0f0',
                          color: typeFilter === t ? '#fff' : '#555', fontWeight: 500,
                        }}>{t}</button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>CITY</div>
                    <select value={cityFilter} onChange={e => setCityFilter(e.target.value)} style={{ width: '100%', padding: '8px 10px', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13, background: '#fff', cursor: 'pointer' }}>
                      {CITIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5, marginBottom: 8 }}>AVAILABILITY</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {['All', 'Available', 'Unavailable'].map(a => (
                        <button key={a} onClick={() => setAvailFilter(a)} style={{
                          padding: '4px 10px', borderRadius: 20, border: 'none', cursor: 'pointer', fontSize: 12,
                          background: availFilter === a ? '#e85d24' : '#f0f0f0',
                          color: availFilter === a ? '#fff' : '#555', fontWeight: 500,
                        }}>{a}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#888', letterSpacing: 0.5 }}>MAX DAILY PRICE</div>
                      <div style={{ fontSize: 12, color: '#e85d24', fontWeight: 600 }}>${maxPrice}</div>
                    </div>
                    <input type="range" min={20} max={300} value={maxPrice} onChange={e => setMaxPrice(+e.target.value)}
                      style={{ width: '100%', accentColor: '#e85d24' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#aaa' }}>
                      <span>$20</span><span>$300</span>
                    </div>
                  </div>

                  <button onClick={() => { setTypeFilter('All'); setCityFilter('All'); setAvailFilter('All'); setMaxPrice(200); setCarSearch(''); }}
                    style={{ marginTop: 14, background: 'none', border: 'none', color: '#e85d24', fontSize: 13, cursor: 'pointer', padding: 0, fontWeight: 500 }}>
                    Clear filters
                  </button>
                </div>
              </div>

              {/* Car grid */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#aaa', fontSize: 15 }}>🔍</span>
                    <input value={carSearch} onChange={e => setCarSearch(e.target.value)} placeholder="Search by name or type..."
                      style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #e0e0e0', borderRadius: 10, fontSize: 14, background: '#fff', boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                  <div style={{ background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, padding: '10px 16px', fontSize: 13, color: '#555', whiteSpace: 'nowrap' }}>
                    {filteredCars.length} cars found
                  </div>
                </div>

                {carsLoading ? (
                  <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>Loading cars...</div>
                ) : filteredCars.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>No cars match your filters.</div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
                    {filteredCars.map(car => (
                      <CarGridCard key={car.id} car={car} onBook={() => navigate(`/book/${car.id}`)} />
                    ))}
                  </div>
                )}

                {!carSearch && carTotalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 28 }}>
                    <button onClick={() => setCarPage(p => Math.max(1, p - 1))} disabled={carPage === 1} style={pgBtn(carPage > 1)}>← Prev</button>
                    <span style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13 }}>{carPage} / {carTotalPages}</span>
                    <button onClick={() => setCarPage(p => Math.min(carTotalPages, p + 1))} disabled={carPage === carTotalPages} style={pgBtn(carPage < carTotalPages)}>Next →</button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ─── MY RESERVATIONS ─── */}
          {tab === 'reservations' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>My Reservations</div>
              {bookings.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 80, color: '#aaa' }}>
                  <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
                  <div>No reservations yet.</div>
                  <button onClick={() => setTab('browse')} style={{ marginTop: 16, padding: '10px 24px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600 }}>Browse Cars</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {bookings.map((b) => {
                    const d1 = new Date(b.pickupDate), d2 = new Date(b.dropoffDate);
                    const days = b.isHourly ? null : Math.max(1, Math.ceil((d2 - d1) / 86400000));
                    // ← FIXED: hourly bookings can now be extended too
                    const canExtend = b.status === 'confirmed' && !b.isExtended;
                    return (
                      <div key={b.id} style={{ background: '#fff', borderRadius: 14, padding: '20px 24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: 18 }}>
                        <div style={{ width: 44, height: 44, background: '#fef3ee', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🚗</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Car #{b.carId}</div>
                          <div style={{ color: '#666', fontSize: 13 }}>{b.pickupLocation} → {b.dropoffLocation}</div>
                          <div style={{ color: '#888', fontSize: 12, marginTop: 2 }}>
                            {b.pickupDate} — {b.isHourly ? `${b.durationHours}h` : `${b.dropoffDate} · ${days} day${days > 1 ? 's' : ''}`}
                          </div>
                          {b.isExtended && (
                            <div style={{ color: '#7c3aed', fontSize: 11, fontWeight: 600, marginTop: 3 }}>✦ Extended</div>
                          )}
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                          <div style={{ fontWeight: 700, fontSize: 20, color: '#e85d24' }}>${b.totalAmount}</div>
                          <div style={{ fontSize: 11, color: '#aaa' }}>Booking R{String(b.id).padStart(3, '0')}</div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <span style={{
                              padding: '3px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                              background: b.status === 'completed' ? '#dcfce7' : b.status === 'cancelled' ? '#fee2e2' : '#dbeafe',
                              color: b.status === 'completed' ? '#16a34a' : b.status === 'cancelled' ? '#dc2626' : '#2563eb',
                              textTransform: 'capitalize',
                            }}>{b.status}</span>
                            {b.status === 'confirmed' && (
                              <button onClick={() => handleCancel(b.id)} style={{ padding: '3px 12px', borderRadius: 20, border: '1.5px solid #fca5a5', color: '#dc2626', background: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                            )}
                            {canExtend && (
                              <button onClick={() => openExtendModal(b)} style={{ padding: '3px 12px', borderRadius: 20, border: 'none', background: '#7c3aed', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>
                                {b.isHourly ? '+ Hours' : 'Extend'}
                              </button>
                            )}
                            {b.status === 'completed' && !myReviews.some(r => r.reservationId === b.id) && (
                              <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                                style={{ padding: '3px 12px', borderRadius: 20, border: 'none', background: '#e85d24', color: '#fff', fontSize: 12, cursor: 'pointer', fontWeight: 600 }}>Review</button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {bookTotalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
                  <button onClick={() => setBookPage(p => Math.max(1, p - 1))} disabled={bookPage === 1} style={pgBtn(bookPage > 1)}>← Prev</button>
                  <span style={{ padding: '7px 14px', background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, fontSize: 13 }}>{bookPage} / {bookTotalPages}</span>
                  <button onClick={() => setBookPage(p => Math.min(bookTotalPages, p + 1))} disabled={bookPage === bookTotalPages} style={pgBtn(bookPage < bookTotalPages)}>Next →</button>
                </div>
              )}
            </div>
          )}

          {/* ─── MY REVIEWS ─── */}
          {tab === 'reviews' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>Reviews</div>

              {completedWithoutReview.length > 0 && (
                <div style={{ background: '#fff', borderRadius: 14, padding: 24, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Pending Reviews ({completedWithoutReview.length})</div>
                  {completedWithoutReview.map(b => (
                    <div key={b.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 14 }}>Car #{b.carId}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>{b.pickupDate} — {b.dropoffDate}</div>
                      </div>
                      <button onClick={() => { setReviewModal(b); setReviewRating(5); setReviewComment(''); setReviewMsg(''); }}
                        style={{ padding: '7px 18px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 20, cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
                        Write Review
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ background: '#fff', borderRadius: 14, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 14 }}>Your Past Reviews</div>
                {myReviews.length === 0 ? (
                  <p style={{ color: '#aaa', fontSize: 14 }}>No reviews yet.</p>
                ) : (
                  myReviews.map(r => (
                    <div key={r.reviewId} style={{ padding: '14px 0', borderBottom: '1px solid #f5f5f5' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{r.carName}</div>
                        <div style={{ color: '#f59e0b', letterSpacing: 2, fontSize: 15 }}>{'★'.repeat(r.rating || 5)}{'☆'.repeat(5 - (r.rating || 5))}</div>
                      </div>
                      <p style={{ color: '#555', fontSize: 13, margin: '6px 0 4px', lineHeight: 1.5 }}>{r.comment}</p>
                      <div style={{ color: '#aaa', fontSize: 12 }}>{r.createdAt?.split(' ')[0]}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ─── PROFILE ─── */}
          {tab === 'profile' && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 22, marginBottom: 20 }}>My Profile</div>
              <div style={{ background: '#fff', borderRadius: 14, padding: 28, maxWidth: 420, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid #f0f0f0', marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, background: '#e85d24', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 24, color: '#fff' }}>{firstInitial}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 18 }}>{userName}</div>
                    <div style={{ color: '#888', fontSize: 13 }}>{email}</div>
                    <span style={{ background: '#fef3ee', color: '#e85d24', fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>Customer</span>
                  </div>
                </div>
                {[
                  ['Email', email],
                  ['Account Role', 'Customer'],
                  ['Member Since', 'January 2024'],
                  ['Total Bookings', bookings.length],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
                    <span style={{ color: '#888' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── EXTEND RESERVATION MODAL ─── */}
      {extendModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, margin: 0, fontSize: 18 }}>
                {extendModal.isHourly ? 'Add More Hours' : 'Extend Reservation'}
              </h3>
              <button onClick={closeExtendModal} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: '#aaa', lineHeight: 1 }}>×</button>
            </div>

            {!extendResult ? (
              <>
                {/* Info banner — colour-coded by booking type */}
                <div style={{
                  background: extendModal.isHourly ? '#fef3c7' : '#f3e8ff',
                  border: `1px solid ${extendModal.isHourly ? '#fcd34d' : '#d8b4fe'}`,
                  borderRadius: 10, padding: '12px 16px', marginBottom: 20,
                  fontSize: 13, color: extendModal.isHourly ? '#92400e' : '#6b21a8',
                }}>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>
                    Booking R{String(extendModal.id).padStart(3, '0')} ·{' '}
                    <span style={{ background: extendModal.isHourly ? '#fcd34d' : '#d8b4fe', borderRadius: 20, padding: '1px 8px', fontSize: 11 }}>
                      {extendModal.isHourly ? 'Hourly' : 'Daily'}
                    </span>
                  </div>
                  {extendModal.isHourly ? (
                    <div>Current end time: <strong>{extendModal.dropoffDate}</strong></div>
                  ) : (
                    <div>Current drop-off: <strong>{extendModal.dropoffDate}</strong></div>
                  )}
                  <div style={{ marginTop: 6, fontSize: 12, color: extendModal.isHourly ? '#b45309' : '#7c3aed' }}>
                    {extendModal.isHourly
                      ? 'Maximum 24 hours total duration. Billed at the same hourly rate.'
                      : 'One extension allowed. Extra days billed at the same daily rate.'}
                  </div>
                </div>

                {/* ── HOURLY: number-of-hours input ── */}
                {extendModal.isHourly ? (
                  <>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                      Additional hours
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={24}
                      value={extendHours}
                      onChange={e => { setExtendHours(e.target.value); setExtendError(''); }}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
                    />
                  </>
                ) : (
                  /* ── DAILY: date picker ── */
                  <>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#444', marginBottom: 6 }}>
                      New drop-off date
                    </label>
                    <input
                      type="date"
                      value={extendDate}
                      min={(() => {
                        const d = new Date(extendModal.dropoffDate);
                        d.setDate(d.getDate() + 1);
                        return d.toISOString().split('T')[0];
                      })()}
                      onChange={e => { setExtendDate(e.target.value); setExtendError(''); }}
                      style={{ width: '100%', padding: '11px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginBottom: 16 }}
                    />
                  </>
                )}

                {extendError && (
                  <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 12 }}>
                    {extendError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={closeExtendModal} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500, fontSize: 14 }}>
                    Cancel
                  </button>
                  <button
                    onClick={handleExtend}
                    disabled={extendLoading || (extendModal.isHourly ? !extendHours || extendHours < 1 : !extendDate)}
                    style={{
                      flex: 1, padding: '12px', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 14,
                      cursor: extendLoading || (extendModal.isHourly ? !extendHours || extendHours < 1 : !extendDate) ? 'not-allowed' : 'pointer',
                      background: extendLoading || (extendModal.isHourly ? !extendHours || extendHours < 1 : !extendDate) ? '#e0e0e0' : '#7c3aed',
                      color: extendLoading || (extendModal.isHourly ? !extendHours || extendHours < 1 : !extendDate) ? '#aaa' : '#fff',
                    }}>
                    {extendLoading ? 'Processing...' : 'Confirm Extension'}
                  </button>
                </div>
              </>
            ) : (
              /* ── Success state ── */
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8, color: '#16a34a' }}>Extension Confirmed!</div>
                <p style={{ color: '#555', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{extendResult.message}</p>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: '16px 20px', marginBottom: 20, textAlign: 'left' }}>
                  {[
                    [extendModal.isHourly ? 'Old end time' : 'Old drop-off', extendResult.oldDropoffDate],
                    [extendModal.isHourly ? 'New end time' : 'New drop-off', extendResult.newDropoffDate],
                    ['Extra charge', `$${extendResult.extraCharge}`],
                    ['New total',    `$${extendResult.newTotalAmount}`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
                      <span style={{ color: '#666' }}>{k}</span>
                      <span style={{ fontWeight: 600, color: '#111' }}>{v}</span>
                    </div>
                  ))}
                </div>
                <button onClick={closeExtendModal} style={{ width: '100%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review modal */}
      {reviewModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 36, width: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontWeight: 800, margin: 0 }}>Write a Review</h3>
              <button onClick={() => setReviewModal(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#aaa' }}>×</button>
            </div>
            <p style={{ color: '#666', fontSize: 13, marginBottom: 16 }}>Booking #{reviewModal.id}</p>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 8 }}>Rating</div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[1, 2, 3, 4, 5].map(s => (
                  <button key={s} onClick={() => setReviewRating(s)}
                    style={{ background: 'none', border: 'none', fontSize: 28, cursor: 'pointer', color: s <= reviewRating ? '#f59e0b' : '#e0e0e0', lineHeight: 1 }}>★</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 6 }}>Comment</div>
              <textarea value={reviewComment} onChange={e => setReviewComment(e.target.value)} rows={4}
                placeholder="Share your experience..."
                style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e0e0e0', borderRadius: 8, fontSize: 14, resize: 'none', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            {reviewMsg && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 12 }}>{reviewMsg}</p>}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setReviewModal(null)} style={{ flex: 1, padding: '12px', background: '#f5f5f5', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
              <button onClick={submitReview} style={{ flex: 1, padding: '12px', background: '#e85d24', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700 }}>Submit</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, right: 28, background: '#1a1a1a', color: '#fff', padding: '14px 24px', borderRadius: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', fontSize: 14, fontWeight: 500, zIndex: 9999 }}>{toast}</div>
      )}
    </div>
  );
}

function CarGridCard({ car, onBook }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', boxShadow: hover ? '0 8px 28px rgba(0,0,0,0.13)' : '0 1px 6px rgba(0,0,0,0.07)', border: '1px solid #eee', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
      <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
        <img src={car.image} alt={`${car.make} ${car.model}`}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s', transform: hover ? 'scale(1.04)' : 'scale(1)' }}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=600'; }} />
        <span style={{ position: 'absolute', top: 10, left: 10, background: car.available ? '#16a34a' : '#dc2626', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20 }}>
          {car.available ? 'Available' : 'Unavailable'}
        </span>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{car.make} {car.model}</div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#e85d24', fontWeight: 700, fontSize: 15 }}>${car.pricePerDay}<span style={{ fontSize: 11, color: '#aaa', fontWeight: 400 }}>/day</span></div>
            <div style={{ color: '#aaa', fontSize: 11 }}>${Math.ceil((car.pricePerDay || 50) / 10)}/hr</div>
          </div>
        </div>
        <div style={{ color: '#888', fontSize: 12, marginBottom: 10 }}>{car.type} · {car.location} · {car.features?.[0] || ''}</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 1 }}>
            {[1,2,3,4,5].map(s => <span key={s} style={{ color: s <= Math.round(car.rating || 4) ? '#f59e0b' : '#e0e0e0', fontSize: 13 }}>★</span>)}
          </div>
          <span style={{ color: '#aaa', fontSize: 12 }}>({car.reviewsCount || 0})</span>
        </div>
        <button onClick={onBook} disabled={!car.available}
          style={{ width: '100%', padding: '9px 0', background: car.available ? '#e85d24' : '#e5e7eb', color: car.available ? '#fff' : '#9ca3af', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: car.available ? 'pointer' : 'not-allowed', transition: 'opacity 0.2s' }}>
          Reserve Now
        </button>
      </div>
    </div>
  );
}

const pgBtn = (active) => ({
  padding: '7px 16px', border: '1px solid #e0e0e0', borderRadius: 8,
  cursor: active ? 'pointer' : 'not-allowed', background: '#fff',
  fontSize: 13, opacity: active ? 1 : 0.4,
});