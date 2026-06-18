const BASE = 'http://localhost:5022/api/v1';

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders(extra = {}) {
  const t = getToken();
  return {
    'Content-Type': 'application/json',
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...extra,
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, { headers: authHeaders(), ...options });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || 'Request failed');
  }
  if (res.status === 204) return null;
  return res.json();
}




// Auth
export const login = (body) =>
  request('/authentication/login', { method: 'POST', body: JSON.stringify(body) });
export const register = (body) =>
  request('/authentication/register', { method: 'POST', body: JSON.stringify(body) });
export const forgotPassword = (body) =>
  request('/authentication/forgot-password', { method: 'POST', body: JSON.stringify(body) });
export const verifyOtp = (body) =>
  request('/authentication/verify-otp', { method: 'POST', body: JSON.stringify(body) });
export const resetPassword = (body) =>
  request('/authentication/reset-password', { method: 'POST', body: JSON.stringify(body) });

// Cars
export const getCars = (page = 1, pageSize = 8) =>
  request(`/cars?page=${page}&pageSize=${pageSize}`);
export const getCarById = (id) => request(`/cars/${id}`);

/** Admin OR Agent can create a car. Pass agentId when called from an agent context. */
export const createCar = (body, agentId = null) => {
  const qs = agentId ? `?agentId=${agentId}` : '';
  return request(`/cars${qs}`, { method: 'POST', body: JSON.stringify(body) });
};
export const deleteCar = (id) => request(`/cars/${id}`, { method: 'DELETE' });

/** Returns only the cars added by this agent. */
export const getAgentCars = (agentId, page = 1, pageSize = 20) =>
  request(`/cars/my-fleet/${agentId}?page=${page}&pageSize=${pageSize}`);

// Reservations
export const getMyBookings = (userId, page = 1, pageSize = 10) =>
  request(`/reservations/my?userId=${userId}&page=${page}&pageSize=${pageSize}`);
export const getAllBookings = (page = 1, pageSize = 10) =>
  request(`/reservations/all?page=${page}&pageSize=${pageSize}`);
export const createBooking = (userId, body) =>
  request(`/reservations?userId=${userId}`, { method: 'POST', body: JSON.stringify(body) });
export const cancelBooking = (id, userId, isAdmin = false) =>
  request(`/reservations/${id}/cancel?userId=${userId}&isAdmin=${isAdmin}`, { method: 'DELETE' });
export const returnCar = (id, userId, isAdmin = false) =>
  request(`/reservations/${id}/return?userId=${userId}&isAdmin=${isAdmin}`, { method: 'PUT' });

/**
 * Extend a confirmed reservation's drop-off date (once only, daily bookings only).
 * Body: { newDropoffDate: "yyyy-MM-dd" }
 * Returns ExtendReservationDto: { reservationId, oldDropoffDate, newDropoffDate, extraCharge, newTotalAmount, message }
 */
export const extendReservation = (reservationId, userId, newDropoffDate, additionalHours) =>
  request(`/reservations/${reservationId}/extend?userId=${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      newDropoffDate: newDropoffDate || null,
      additionalHours: additionalHours || null,
    }),
  });

// Reviews
export const getAllReviews = (page = 1, pageSize = 10) =>
  request(`/reviews?page=${page}&pageSize=${pageSize}`);
export const getCarReviews = (carId, page = 1, pageSize = 10) =>
  request(`/reviews/car/${carId}?page=${page}&pageSize=${pageSize}`);
export const addReview = (userId, body) =>
  request(`/reviews?userId=${userId}`, { method: 'POST', body: JSON.stringify(body) });

// Promotions
export const getAllPromotions = () => request('/promotions');
export const validatePromoCode = (code) => request(`/promotions/validate/${code}`);
export const addPromotion = (body) =>
  request('/promotions', { method: 'POST', body: JSON.stringify(body) });
export const togglePromotion = (id) => request(`/promotions/toggle/${id}`, { method: 'PUT' });
export const deletePromotion = (id) => request(`/promotions/${id}`, { method: 'DELETE' });

// Maintenance
export const getMaintenanceAlerts = () => request('/maintenance');
export const addMaintenanceAlert = (body) =>
  request('/maintenance', { method: 'POST', body: JSON.stringify(body) });
export const updateAlertStatus = (id, status) =>
  request(`/maintenance/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });

// Gate logistics
export const gateCheckout = (reservationId, body) =>
  request(`/gate/checkout/${reservationId}`, { method: 'POST', body: JSON.stringify(body) });
export const gateCheckin = (reservationId, body) =>
  request(`/gate/checkin/${reservationId}`, { method: 'POST', body: JSON.stringify(body) });
export const getGateDetails = (reservationId) =>
  request(`/gate/details/${reservationId}`);

/**
 * Returns reservations for cars added by this agent.
 */
export const getAgentBookings = (agentId, page = 1, pageSize = 50) =>
  request(`/gate/agent-bookings/${agentId}?page=${page}&pageSize=${pageSize}`);

// Admin
export const getAdminStats = () => request('/admin/stats');
export const approveUser = (userId, approve) =>
  request(`/admin/users/${userId}/approve?approve=${approve}`, { method: 'PUT' });
export const getPendingUsers = () => request('/admin/users/pending');
export const getBookingReport = (start, end) =>
  request(`/admin/reports/bookings?StartDate=${start}&EndDate=${end}`);
export const getRevenueReport = (start, end) =>
  request(`/admin/reports/revenue?StartDate=${start}&EndDate=${end}`);
export const getReviewReport = (start, end) =>
  request(`/admin/reports/reviews?StartDate=${start}&EndDate=${end}`);
export const getPerformanceReport = (start, end) =>
  request(`/admin/reports/performance?StartDate=${start}&EndDate=${end}`);
export const downloadReport = (type, start, end) => {
  const token = getToken();
  window.open(
    `${BASE}/admin/reports/${type}/download?StartDate=${start}&EndDate=${end}&token=${token}`,
    '_blank'
  );
};

// Disputes
export const flagDispute = (reviewId, resolution) =>
  request(`/Disputes/dispute/${reviewId}`, { method: 'POST', body: JSON.stringify({ resolution }) });
export const resolveDispute = (reviewId, action) =>
  request(`/Disputes/resolve/${reviewId}`, { method: 'POST', body: JSON.stringify({ action }) });