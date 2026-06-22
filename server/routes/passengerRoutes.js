import express from 'express';
import { getPassengers } from '../controllers/passengerController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, authorize('admin'), getPassengers);

export default router;
