import { request } from './api';

export const getMyPaymentHistory = (userId) => request(`/payments/my?userId=${userId}`);