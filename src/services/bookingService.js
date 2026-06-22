import api from '../api/axios.js';

export const bookingService = {
  // Create a booking
  async createBooking(data) {
    const res = await api.post('/bookings', data);
    return res.data;
  },

  // Get booked seats for a route and date
  async getBookedSeats(routeId, date) {
    const res = await api.get(`/bookings/route/${routeId}/seats`, { params: { date } });
    return res.data;
  },

  // Get current user's bookings
  async getMyBookings(search) {
    const params = {};
    if (search) params.search = search;
    const res = await api.get('/bookings/my', { params });
    return res.data;
  },

  // Get single booking
  async getBooking(id) {
    const res = await api.get(`/bookings/${id}`);
    return res.data;
  },

  // Cancel a booking
  async cancelBooking(id) {
    const res = await api.put(`/bookings/${id}/cancel`);
    return res.data;
  },

  // Admin: Get all bookings
  async getAllBookings(status, search) {
    const params = {};
    if (status) params.status = status;
    if (search) params.search = search;
    const res = await api.get('/bookings', { params });
    return res.data;
  },
};
