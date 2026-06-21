import { request } from './api';

export const flagDispute = (reviewId, resolution) =>
  request(`/Disputes/dispute/${reviewId}`, { method: 'POST', body: JSON.stringify({ resolution }) });
export const resolveDispute = (reviewId, action) =>
  request(`/Disputes/resolve/${reviewId}`, { method: 'POST', body: JSON.stringify({ action }) });