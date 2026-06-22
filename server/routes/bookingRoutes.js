import express from 'express';
import {
  createBooking,
  getAllBookings,
  getMyBookings,
  getBooking,
  cancelBooking,
  getBookedSeats,
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.get('/route/:routeId/seats', protect, getBookedSeats);
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Admin routes
router.get('/', protect, authorize('admin'), getAllBookings);

export default router;
