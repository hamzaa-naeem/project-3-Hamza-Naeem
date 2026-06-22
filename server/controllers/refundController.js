import Refund from '../models/Refund.js';
import Booking from '../models/Booking.js';

// @desc    Request a refund
// @route   POST /api/v1/refunds
// @access  Private
export const requestRefund = async (req, res) => {
  try {
    const { ticketId, cnic, phone, method, reason } = req.body;

    // Find the booking
    const booking = await Booking.findOne({ ticketId });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Ticket ID not found' });
    }

    // Check if refund already exists for this ticket
    const existingRefund = await Refund.findOne({ ticketId });
    if (existingRefund) {
      return res.status(400).json({ success: false, message: 'Refund already requested for this ticket' });
    }

    // Generate unique refund ID safely to handle concurrency
    let refundId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const count = await Refund.countDocuments();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      refundId = `REF-${String(count + 1).padStart(4, '0')}-${randomSuffix}`;
      const existing = await Refund.findOne({ refundId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    if (!isUnique) {
      refundId = `REF-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const refund = await Refund.create({
      refundId,
      ticketId,
      booking: booking._id,
      user: req.user._id,
      name: booking.passengerName,
      cnic,
      amount: booking.total,
      method,
      reason,
      status: 'Pending',
    });

    // Update booking status to Refunded
    booking.status = 'Refunded';
    await booking.save();

    res.status(201).json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all refunds (admin)
// @route   GET /api/v1/refunds
// @access  Admin
export const getAllRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: refunds.length, data: refunds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's refunds
// @route   GET /api/v1/refunds/my
// @access  Private
export const getMyRefunds = async (req, res) => {
  try {
    const refunds = await Refund.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: refunds.length, data: refunds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Process a refund
// @route   PUT /api/v1/refunds/:id/process
// @access  Admin
export const processRefund = async (req, res) => {
  try {
    const refund = await Refund.findById(req.params.id);
    if (!refund) {
      return res.status(404).json({ success: false, message: 'Refund not found' });
    }

    refund.status = 'Processed';
    await refund.save();

    res.status(200).json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track refund by refund ID or ticket ID
// @route   GET /api/v1/refunds/track/:id
// @access  Private
export const trackRefund = async (req, res) => {
  try {
    const q = req.params.id.toUpperCase();
    const refund = await Refund.findOne({
      $or: [{ refundId: q }, { ticketId: q }],
    });

    if (!refund) {
      return res.status(404).json({ success: false, message: 'No refund found with this ID' });
    }

    res.status(200).json({ success: true, data: refund });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
