import express from 'express';
import {
  fileComplaint,
  getAllComplaints,
  getMyComplaints,
  resolveComplaint,
  trackComplaint,
} from '../controllers/complaintController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, fileComplaint);
router.get('/my', protect, getMyComplaints);
router.get('/track/:id', protect, trackComplaint);

// Admin routes
router.get('/', protect, authorize('admin'), getAllComplaints);
router.put('/:id/resolve', protect, authorize('admin'), resolveComplaint);

export default router;
