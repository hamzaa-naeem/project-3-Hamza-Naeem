import mongoose from 'mongoose';

const refundSchema = new mongoose.Schema(
  {
    refundId: {
      type: String,
      unique: true,
      required: true,
    },
    ticketId: {
      type: String,
      required: [true, 'Ticket ID is required'],
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    method: {
      type: String,
      required: [true, 'Refund method is required'],
      enum: ['Easypaisa', 'JazzCash', 'Bank Account'],
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Processed', 'Rejected'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

refundSchema.index({ user: 1 });

const Refund = mongoose.model('Refund', refundSchema);
export default Refund;
