import { request } from './api';

export const getAllPromotions = () => request('/promotions');
export const validatePromoCode = (code) => request(`/promotions/validate/${code}`);
export const addPromotion = (body) =>
  request('/promotions', { method: 'POST', body: JSON.stringify(body) });
export const togglePromotion = (id) => request(`/promotions/toggle/${id}`, { method: 'PUT' });
export const deletePromotion = (id) => request(`/promotions/${id}`, { method: 'DELETE' });