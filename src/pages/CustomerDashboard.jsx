import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCars, getMyBookings, cancelBooking, addReview, getAllReviews, extendReservation } from '../api/api';
import { useAuth } from '../context/AuthContext';

import Sidebar, { SIDEBAR_WIDTH } from '../components/customer-dashboard/Sidebar';
import TopBar from '../components/customer-dashboard/TopBar';
import BrowseCarsTab from '../components/customer-dashboard/BrowseCarsTab';
import ReservationsTab from '../components/customer-dashboard/ReservationsTab';
import ReviewsTab from '../components/customer-dashboard/ReviewsTab';
import ProfileTab from '../components/customer-dashboard/ProfileTab';
import ExtendReservationModal from '../components/customer-dashboard/ExtendReservationModal';
import ReviewModal from '../components/customer-dashboard/ReviewModal';
import Toast from '../components/customer-dashboard/Toast';

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
  const [maxPrice, setMaxPrice] = useState(10000);
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
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendResult, setExtendResult] = useState(null);
  const [extendError, setExtendError] = useState('');

  // Toast
  const [toast, setToast] = useState('');

  function showToast(msg) { 
    setToast(msg);
    setTimeout(() => setToast(''), 3000); 
  }

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
    } 
    catch (e) { 
    showToast(e.message);
   }
  }

  async function submitReview() {
    try {
      await addReview(userId, { reservationId: reviewModal.id, rating: reviewRating, comment: reviewComment });
      showToast('Review submitted!');
      setReviewModal(null);
      setReviewMsg('');
    } catch (e) { setReviewMsg(e.message); }
  }

  function openExtendModal(booking) {
    const currentDrop = new Date(booking.dropoffDate);
    currentDrop.setDate(currentDrop.getDate() + 1);
    const defaultDate = currentDrop.toISOString().split('T')[0];
    setExtendDate(defaultDate);
    setExtendError('');
    setExtendResult(null);
    setExtendModal(booking);
  }

  async function handleExtend() {
    if (!extendDate) { setExtendError('Please select a new drop-off date.'); return; }
    setExtendLoading(true);
    setExtendError('');
    setExtendResult(null);
    try {
      const result = await extendReservation(extendModal.id, userId, extendDate);
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
  }

  const completedWithoutReview = bookings.filter(b =>
    b.status === 'completed' && !myReviews.some(r => r.reservationId === b.id)
  );

 
  const firstInitial = userName ? userName.charAt(0).toUpperCase() : 'U';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'system-ui, sans-serif' }}>
      <Sidebar
        tab={tab}
        setTab={setTab}
        userName={userName}
        firstInitial={firstInitial}
        onLogout={() => { logout(); navigate('/'); }}
      />

      <div style={{ marginLeft: SIDEBAR_WIDTH, flex: 1, background: '#f1f0ea', minHeight: '100vh' }}>
        <TopBar tab={tab} userName={userName} today={today} />

        <div style={{ padding: '28px 32px' }}>

          {tab === 'browse' && (
            <BrowseCarsTab
              cars={cars}
              carsLoading={carsLoading}
              carSearch={carSearch}
              setCarSearch={setCarSearch}
              typeFilter={typeFilter}
              setTypeFilter={setTypeFilter}
              cityFilter={cityFilter}
              setCityFilter={setCityFilter}
              availFilter={availFilter}
              setAvailFilter={setAvailFilter}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              carPage={carPage}
              setCarPage={setCarPage}
              carTotalPages={carTotalPages}
              filteredCars={filteredCars}
              CITIES={CITIES}
              TYPES={TYPES}
              navigate={navigate}
            />
          )}

          {tab === 'reservations' && (
            <ReservationsTab
              bookings={bookings}
              setTab={setTab}
              handleCancel={handleCancel}
              openExtendModal={openExtendModal}
              myReviews={myReviews}
              setReviewModal={setReviewModal}
              setReviewRating={setReviewRating}
              setReviewComment={setReviewComment}
              setReviewMsg={setReviewMsg}
              bookPage={bookPage}
              setBookPage={setBookPage}
              bookTotalPages={bookTotalPages}
            />
          )}

          {tab === 'reviews' && (
            <ReviewsTab
              completedWithoutReview={completedWithoutReview}
              setReviewModal={setReviewModal}
              setReviewRating={setReviewRating}
              setReviewComment={setReviewComment}
              setReviewMsg={setReviewMsg}
              myReviews={myReviews}
            />
          )}

          {tab === 'profile' && (
  <ProfileTab bookings={bookings} />
)}
        </div>
      </div>

      <ExtendReservationModal
        extendModal={extendModal}
        extendDate={extendDate}
        setExtendDate={setExtendDate}
        extendError={extendError}
        setExtendError={setExtendError}
        extendLoading={extendLoading}
        extendResult={extendResult}
        handleExtend={handleExtend}
        closeExtendModal={closeExtendModal}
      />

      <ReviewModal
        reviewModal={reviewModal}
        setReviewModal={setReviewModal}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewMsg={reviewMsg}
        submitReview={submitReview}
      />

      <Toast toast={toast} />
    </div>
  );
}