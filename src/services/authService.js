import api from '../api/axios.js';

export const authService = {
  // Register a new user
  async register(data) {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  // Login user
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  // Get current user profile
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data;
  },
};
