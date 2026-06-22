import api from '../api/axios.js';

export const refundService = {
  // Request a refund
  async requestRefund(data) {
    const res = await api.post('/refunds', data);
    return res.data;
  },

  // Get current user's refunds
  async getMyRefunds() {
    const res = await api.get('/refunds/my');
    return res.data;
  },

  // Track refund by ID
  async trackRefund(id) {
    const res = await api.get(`/refunds/track/${id}`);
    return res.data;
  },

  // Admin: Get all refunds
  async getAllRefunds() {
    const res = await api.get('/refunds');
    return res.data;
  },

  // Admin: Process refund
  async processRefund(id) {
    const res = await api.put(`/refunds/${id}/process`);
    return res.data;
  },
};
