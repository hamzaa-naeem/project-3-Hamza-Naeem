import Booking from '../models/Booking.js';
import Passenger from '../models/Passenger.js';
import Complaint from '../models/Complaint.js';
import Refund from '../models/Refund.js';

// @desc    Get dashboard KPI stats
// @route   GET /api/v1/dashboard/stats
// @access  Admin
export const getStats = async (req, res) => {
  try {
    const bookings = await Booking.find();
    const totalRevenue = bookings
      .filter((b) => b.status !== 'Cancelled' && b.status !== 'Refunded')
      .reduce((sum, b) => sum + b.total, 0);

    const ticketsSold = bookings.filter((b) => b.status === 'Confirmed').length;
    const passengers = await Passenger.countDocuments();
    const openComplaints = await Complaint.countDocuments({ status: 'Open' });
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled').length;

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        ticketsSold,
        passengers,
        openComplaints,
        totalBookings,
        cancelledBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get revenue chart data
// @route   GET /api/v1/dashboard/revenue
// @access  Admin
export const getRevenueData = async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const bookings = await Booking.find({
      status: { $in: ['Confirmed', 'Pending'] },
    });

    const now = new Date();
    let labels = [];
    let data = [];

    if (period === 'month') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      labels = months;
      data = new Array(12).fill(0);
      bookings.forEach((b) => {
        const d = new Date(b.createdAt);
        if (d.getFullYear() === now.getFullYear()) {
          data[d.getMonth()] += b.total;
        }
      });
    } else if (period === 'week') {
      for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        labels.push(`W${12 - i}`);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        const weekTotal = bookings
          .filter((b) => {
            const d = new Date(b.createdAt);
            return d >= weekStart && d < weekEnd;
          })
          .reduce((sum, b) => sum + b.total, 0);
        data.push(weekTotal);
      }
    } else {
      // daily — last 30 days
      for (let i = 29; i >= 0; i--) {
        const day = new Date(now);
        day.setDate(day.getDate() - i);
        const dayStr = day.toISOString().slice(0, 10);
        labels.push(day.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }));
        const dayTotal = bookings
          .filter((b) => b.date === dayStr || new Date(b.createdAt).toISOString().slice(0, 10) === dayStr)
          .reduce((sum, b) => sum + b.total, 0);
        data.push(dayTotal);
      }
    }

    res.status(200).json({ success: true, data: { labels, data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get routes distribution data
// @route   GET /api/v1/dashboard/routes-dist
// @access  Admin
export const getRoutesDistribution = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $group: { _id: { from: '$from', to: '$to' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    const labels = result.map((r) => `${r._id.from} → ${r._id.to}`);
    const data = result.map((r) => r.count);

    res.status(200).json({ success: true, data: { labels, data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily passengers data
// @route   GET /api/v1/dashboard/passengers-daily
// @access  Admin
export const getPassengersDaily = async (req, res) => {
  try {
    const now = new Date();
    const labels = [];
    const data = [];

    for (let i = 29; i >= 0; i--) {
      const day = new Date(now);
      day.setDate(day.getDate() - i);
      const dayStr = day.toISOString().slice(0, 10);
      labels.push(day.toLocaleDateString('en-PK', { day: 'numeric', month: 'short' }));

      const count = await Booking.countDocuments({
        date: dayStr,
        status: { $ne: 'Cancelled' },
      });
      data.push(count);
    }

    res.status(200).json({ success: true, data: { labels, data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booking status distribution
// @route   GET /api/v1/dashboard/status-dist
// @access  Admin
export const getStatusDistribution = async (req, res) => {
  try {
    const result = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const labels = result.map((r) => r._id);
    const data = result.map((r) => r.count);

    res.status(200).json({ success: true, data: { labels, data } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
