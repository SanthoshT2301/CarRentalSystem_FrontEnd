import { request } from './api';

export const getCars = (page = 1, pageSize = 8) =>
  request(`/cars?page=${page}&pageSize=${pageSize}`);
export const getCarById = (id) => request(`/cars/${id}`);
export const updateCar = (id, body) =>
  request(`/cars/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

/** Admin OR Agent can create a car. Pass agentId when called from an agent context. */
export const createCar = (body, agentId = null) => {
  const qs = agentId ? `?agentId=${agentId}` : '';
  return request(`/cars${qs}`, { method: 'POST', body: JSON.stringify(body) });
};
export const deleteCar = (id) => request(`/cars/${id}`, { method: 'DELETE' });

/** Returns only the cars added by this agent. */
export const getAgentCars = (agentId, page = 1, pageSize = 20) =>
  request(`/cars/my-fleet/${agentId}?page=${page}&pageSize=${pageSize}`);