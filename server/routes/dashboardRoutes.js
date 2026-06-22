import express from 'express';
import {
  getStats,
  getRevenueData,
  getRoutesDistribution,
  getPassengersDaily,
  getStatusDistribution,
} from '../controllers/dashboardController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, authorize('admin'), getStats);
router.get('/revenue', protect, authorize('admin'), getRevenueData);
router.get('/routes-dist', protect, authorize('admin'), getRoutesDistribution);
router.get('/passengers-daily', protect, authorize('admin'), getPassengersDaily);
router.get('/status-dist', protect, authorize('admin'), getStatusDistribution);

export default router;
