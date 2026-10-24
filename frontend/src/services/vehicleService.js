import api from './api';

export const vehicleService = {
  getVehicles: (params) => api.get('/vehicles', { params }),
  getAllVehicles: (params) => api.get('/vehicles', { params }),
  getVehicleById: (id) => api.get(`/vehicles/${id}`),
  getFeaturedVehicles: () => api.get('/vehicles/featured'),
  getCategories: () => api.get('/vehicles/categories'),
  checkAvailability: (data) => api.post('/vehicles/availability', data),
};
