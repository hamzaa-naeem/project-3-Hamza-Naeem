import mongoose from 'mongoose';

const passengerSubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    cnic: { type: String, required: true },
    phone: { type: String, default: '' },
    age: { type: String, default: '' },
    gender: { type: String, default: 'Male' },
    city: { type: String, default: '' },
    seat: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    route: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Route',
    },
    passengerName: {
      type: String,
      required: [true, 'Passenger name is required'],
    },
    cnic: {
      type: String,
      required: [true, 'CNIC is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: [true, 'Travel date is required'],
    },
    dep: {
      type: String,
      default: '',
    },
    arr: {
      type: String,
      default: '',
    },
    busType: {
      type: String,
      default: 'AC Bus',
    },
    seats: {
      type: [String],
      required: true,
    },
    passengers: {
      type: [passengerSubSchema],
      default: [],
    },
    farePerSeat: {
      type: Number,
      required: true,
      min: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Pending', 'Cancelled', 'Refunded'],
      default: 'Confirmed',
    },
    payment: {
      type: String,
      default: 'Pay at Counter',
    },
  },
  { timestamps: true }
);

// Index for user's bookings lookup
bookingSchema.index({ user: 1, createdAt: -1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
