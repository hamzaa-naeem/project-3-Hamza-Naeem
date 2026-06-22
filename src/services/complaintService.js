import api from '../api/axios.js';

export const complaintService = {
  // File a complaint
  async fileComplaint(data) {
    const res = await api.post('/complaints', data);
    return res.data;
  },

  // Get current user's complaints
  async getMyComplaints() {
    const res = await api.get('/complaints/my');
    return res.data;
  },

  // Track complaint by ID
  async trackComplaint(id) {
    const res = await api.get(`/complaints/track/${id}`);
    return res.data;
  },

  // Admin: Get all complaints
  async getAllComplaints(status) {
    const params = {};
    if (status) params.status = status;
    const res = await api.get('/complaints', { params });
    return res.data;
  },

  // Admin: Resolve complaint
  async resolveComplaint(id) {
    const res = await api.put(`/complaints/${id}/resolve`);
    return res.data;
  },
};
