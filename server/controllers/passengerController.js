import Passenger from '../models/Passenger.js';

// @desc    Get all passengers
// @route   GET /api/v1/passengers
// @access  Admin
export const getPassengers = async (req, res) => {
  try {
    const { search } = req.query;
    let passengers;

    if (search) {
      const q = search.toLowerCase();
      passengers = await Passenger.find({
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { cnic: { $regex: q, $options: 'i' } },
          { phone: { $regex: q, $options: 'i' } },
        ],
      }).sort({ trips: -1 });
    } else {
      passengers = await Passenger.find().sort({ trips: -1 });
    }

    res.status(200).json({ success: true, count: passengers.length, data: passengers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
