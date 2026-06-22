import Booking from '../models/Booking.js';
import Passenger from '../models/Passenger.js';

// Generate unique ticket ID
function generateTicketId() {
  const now = new Date();
  const y = String(now.getFullYear()).slice(2);
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `PRE-${y}${m}${d}-${rand}`;
}

// @desc    Create a new booking
// @route   POST /api/v1/bookings
// @access  Private
export const createBooking = async (req, res) => {
  try {
    const {
      routeId, passengerName, cnic, phone, from, to, date,
      dep, arr, busType, seats, passengers, farePerSeat, total, payment,
    } = req.body;

    // Generate unique ticket ID
    let ticketId = generateTicketId();
    while (await Booking.findOne({ ticketId })) {
      ticketId = generateTicketId();
    }

    const booking = await Booking.create({
      ticketId,
      user: req.user._id,
      route: routeId || undefined,
      passengerName,
      cnic,
      phone,
      from,
      to,
      date,
      dep,
      arr,
      busType,
      seats,
      passengers,
      farePerSeat,
      total,
      payment,
      status: 'Confirmed',
    });

    // Update passenger records
    if (passengers && passengers.length > 0) {
      for (const p of passengers) {
        const existing = await Passenger.findOne({ cnic: p.cnic });
        if (existing) {
          existing.trips += 1;
          existing.totalSpent += farePerSeat;
          existing.lastTrip = date;
          existing.name = p.name;
          existing.phone = p.phone || existing.phone;
          await existing.save();
        } else {
          await Passenger.create({
            name: p.name,
            cnic: p.cnic,
            phone: p.phone || '',
            city: p.city || '',
            trips: 1,
            totalSpent: farePerSeat,
            lastTrip: date,
          });
        }
      }
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/v1/bookings
// @access  Admin
export const getAllBookings = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status) filter.status = status;

    let bookings = await Booking.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.ticketId.toLowerCase().includes(q) ||
          b.passengerName.toLowerCase().includes(q) ||
          b.from.toLowerCase().includes(q) ||
          b.to.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's bookings
// @route   GET /api/v1/bookings/my
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const { search } = req.query;
    let bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });

    if (search) {
      const q = search.toLowerCase();
      bookings = bookings.filter(
        (b) =>
          b.ticketId.toLowerCase().includes(q) ||
          b.passengerName.toLowerCase().includes(q) ||
          b.from.toLowerCase().includes(q) ||
          b.to.toLowerCase().includes(q)
      );
    }

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/v1/bookings/:id
// @access  Private
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('user', 'name email');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Users can only see their own bookings, admins can see all
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/v1/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Users can only cancel their own bookings
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Booking is already cancelled' });
    }

    booking.status = 'Cancelled';
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get booked seats for a route on a specific date
// @route   GET /api/v1/bookings/route/:routeId/seats
// @access  Private
export const getBookedSeats = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ success: false, message: 'Please provide a travel date' });
    }

    // Find all bookings for this route and date, excluding cancelled ones
    const bookings = await Booking.find({
      route: req.params.routeId,
      date,
      status: { $ne: 'Cancelled' }
    });

    // Extract all seat numbers into a flat list
    let bookedSeats = [];
    bookings.forEach(b => {
      if (b.seats && b.seats.length > 0) {
        bookedSeats = bookedSeats.concat(b.seats);
      }
    });

    res.status(200).json({ success: true, data: bookedSeats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
