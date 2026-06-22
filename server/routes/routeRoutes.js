import express from 'express';
import {
  getRoutes,
  getRoute,
  createRoute,
  updateRoute,
  deleteRoute,
  getCities,
} from '../controllers/routeController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/cities', getCities);
router.get('/', getRoutes);
router.get('/:id', getRoute);

// Admin-only routes
router.post('/', protect, authorize('admin'), createRoute);
router.put('/:id', protect, authorize('admin'), updateRoute);
router.delete('/:id', protect, authorize('admin'), deleteRoute);

export default router;
