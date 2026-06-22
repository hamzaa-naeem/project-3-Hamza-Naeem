import Complaint from '../models/Complaint.js';

// @desc    File a complaint
// @route   POST /api/v1/complaints
// @access  Private
export const fileComplaint = async (req, res) => {
  try {
    const { ticketId, category, name, phone, desc } = req.body;

    // Generate unique complaint ID safely to handle concurrency
    let complaintId;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      const count = await Complaint.countDocuments();
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 4-digit random number
      complaintId = `CMP-${String(count + 1).padStart(4, '0')}-${randomSuffix}`;
      const existing = await Complaint.findOne({ complaintId });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }
    if (!isUnique) {
      complaintId = `CMP-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const complaint = await Complaint.create({
      complaintId,
      ticketId: ticketId || '',
      user: req.user._id,
      name,
      phone,
      category,
      desc,
      status: 'Open',
    });

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all complaints (admin)
// @route   GET /api/v1/complaints
// @access  Admin
export const getAllComplaints = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's complaints
// @route   GET /api/v1/complaints/my
// @access  Private
export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: complaints.length, data: complaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Resolve a complaint
// @route   PUT /api/v1/complaints/:id/resolve
// @access  Admin
export const resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = 'Resolved';
    await complaint.save();

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track complaint by complaint ID or ticket ID
// @route   GET /api/v1/complaints/track/:id
// @access  Private
export const trackComplaint = async (req, res) => {
  try {
    const q = req.params.id.toUpperCase();
    const complaint = await Complaint.findOne({
      $or: [{ complaintId: q }, { ticketId: q }],
    });

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'No complaint found with this ID' });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
