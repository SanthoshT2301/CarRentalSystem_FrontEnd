import { request, authHeaders, BASE } from './api';

export const getAdminStats = () => request('/admin/stats');
export const approveUser = (userId, approve) =>
  request(`/admin/users/${userId}/approve?approve=${approve}`, { method: 'PUT' });
export const getPendingUsers = () => request('/admin/users/pending');

export const getAllUsers = () => request('/admin/users');
export const setUserStatus = (id, isActive) =>
  request(`/admin/users/${id}/status?isActive=${isActive}`, { method: 'PATCH' });
export const deleteUser = (id) => request(`/admin/users/${id}`, { method: 'DELETE' });


export const createUserByAdmin = (body) =>
  request('/admin/users', { method: 'POST', body: JSON.stringify(body) });
export const updateUserByAdmin = (id, body) =>
  request(`/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(body) });


// Reports
export const getBookingReport = (start, end) =>
  request(`/admin/reports/bookings?StartDate=${start}&EndDate=${end}`);
export const getRevenueReport = (start, end) =>
  request(`/admin/reports/revenue?StartDate=${start}&EndDate=${end}`);
export const getReviewReport = (start, end) =>
  request(`/admin/reports/reviews?StartDate=${start}&EndDate=${end}`);
export const getPerformanceReport = (start, end) =>
  request(`/admin/reports/performance?StartDate=${start}&EndDate=${end}`);

export const downloadReport = async (type, start, end) => {
  const res = await fetch(
    `${BASE}/admin/reports/${type}/download?StartDate=${start}&EndDate=${end}`,
    { headers: authHeaders() }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || err.message || 'Failed to download report.');
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}-report-${start}-to-${end}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};