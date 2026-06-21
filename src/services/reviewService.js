import { request } from './api';

export const getAllReviews = (page = 1, pageSize = 10) =>
  request(`/reviews?page=${page}&pageSize=${pageSize}`);
export const getCarReviews = (carId, page = 1, pageSize = 10) =>
  request(`/reviews/car/${carId}?page=${page}&pageSize=${pageSize}`);
export const addReview = (userId, body) =>
  request(`/reviews?userId=${userId}`, { method: 'POST', body: JSON.stringify(body) });