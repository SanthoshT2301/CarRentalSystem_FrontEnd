import { request } from './api';

export const getMaintenanceAlerts = () => request('/maintenance');
export const addMaintenanceAlert = (body) =>
  request('/maintenance', { method: 'POST', body: JSON.stringify(body) });
export const updateAlertStatus = (id, status) =>
  request(`/maintenance/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });