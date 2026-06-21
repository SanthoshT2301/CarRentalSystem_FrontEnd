import { request } from './api';

export const gateCheckout = (reservationId, body) =>
  request(`/gate/checkout/${reservationId}`, { method: 'POST', body: JSON.stringify(body) });
export const gateCheckin = (reservationId, body) =>
  request(`/gate/checkin/${reservationId}`, { method: 'POST', body: JSON.stringify(body) });
export const getGateDetails = (reservationId) =>
  request(`/gate/details/${reservationId}`);

/** Returns reservations for cars added by this agent. */
export const getAgentBookings = (agentId, page = 1, pageSize = 50) =>
  request(`/gate/agent-bookings/${agentId}?page=${page}&pageSize=${pageSize}`);