import { request } from './api';

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

export const getMyProfile = (userId) => request(`/users/${userId}/profile`);