import api from '../api/axios.js';

export const dashboardService = {
  // Get KPI stats
  async getStats() {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },

  // Get revenue chart data
  async getRevenueData(period = 'month') {
    const res = await api.get('/dashboard/revenue', { params: { period } });
    return res.data;
  },

  // Get routes distribution
  async getRoutesDistribution() {
    const res = await api.get('/dashboard/routes-dist');
    return res.data;
  },

  // Get daily passengers
  async getPassengersDaily() {
    const res = await api.get('/dashboard/passengers-daily');
    return res.data;
  },

  // Get booking status distribution
  async getStatusDistribution() {
    const res = await api.get('/dashboard/status-dist');
    return res.data;
  },
};

export const passengerService = {
  // Admin: Get all passengers
  async getPassengers(search) {
    const params = {};
    if (search) params.search = search;
    const res = await api.get('/passengers', { params });
    return res.data;
  },
};
