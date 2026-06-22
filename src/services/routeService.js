import api from '../api/axios.js';

export const routeService = {
  // Get all routes (optionally filtered by from/to)
  async getRoutes(from, to) {
    const params = {};
    if (from) params.from = from;
    if (to) params.to = to;
    const res = await api.get('/routes', { params });
    return res.data;
  },

  // Get single route
  async getRoute(id) {
    const res = await api.get(`/routes/${id}`);
    return res.data;
  },

  // Get all cities
  async getCities() {
    const res = await api.get('/routes/cities');
    return res.data;
  },

  // Admin: Create route
  async createRoute(data) {
    const res = await api.post('/routes', data);
    return res.data;
  },

  // Admin: Update route
  async updateRoute(id, data) {
    const res = await api.put(`/routes/${id}`, data);
    return res.data;
  },

  // Admin: Delete route
  async deleteRoute(id) {
    const res = await api.delete(`/routes/${id}`);
    return res.data;
  },
};
