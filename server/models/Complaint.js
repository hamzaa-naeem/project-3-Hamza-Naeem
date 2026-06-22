import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema(
  {
    complaintId: {
      type: String,
      unique: true,
      required: true,
    },
    ticketId: {
      type: String,
      default: '',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    category: {
      type: String,
      required: [true, 'Complaint category is required'],
      enum: [
        'Bus Late / Delayed',
        'Rude Staff Behavior',
        'Seat Issue / Dirty Bus',
        'AC Not Working',
        'Overcharging',
        'Luggage Lost / Damaged',
        'Safety Concern',
        'Other',
      ],
    },
    desc: {
      type: String,
      required: [true, 'Complaint description is required'],
    },
    status: {
      type: String,
      enum: ['Open', 'In Review', 'Resolved'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

complaintSchema.index({ user: 1 });

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
