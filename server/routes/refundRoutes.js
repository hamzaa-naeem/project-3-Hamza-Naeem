import express from 'express';
import {
  requestRefund,
  getAllRefunds,
  getMyRefunds,
  processRefund,
  trackRefund,
} from '../controllers/refundController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, requestRefund);
router.get('/my', protect, getMyRefunds);
router.get('/track/:id', protect, trackRefund);

// Admin routes
router.get('/', protect, authorize('admin'), getAllRefunds);
router.put('/:id/process', protect, authorize('admin'), processRefund);

export default router;
