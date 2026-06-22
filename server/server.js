import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import passengerRoutes from './routes/passengerRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import refundRoutes from './routes/refundRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// Load env vars
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Mount routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/routes', routeRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/passengers', passengerRoutes);
app.use('/api/v1/complaints', complaintRoutes);
app.use('/api/v1/refunds', refundRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, message: 'PakRide API is running 🚌', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

// Connect to database first, then start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚌 PakRide API Server running on port ${PORT}`);
      console.log(`   Health: http://localhost:${PORT}/api/v1/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
