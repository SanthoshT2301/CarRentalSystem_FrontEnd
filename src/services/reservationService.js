import { request } from './api';

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
 * Extend a confirmed reservation's drop-off date or hours (once only).
 */
export const extendReservation = (reservationId, userId, newDropoffDate, additionalHours) =>
  request(`/reservations/${reservationId}/extend?userId=${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      newDropoffDate: newDropoffDate || null,
      additionalHours: additionalHours || null,
    }),
  });