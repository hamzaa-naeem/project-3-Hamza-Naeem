import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      required: [true, 'Origin city is required'],
      trim: true,
    },
    to: {
      type: String,
      required: [true, 'Destination city is required'],
      trim: true,
    },
    fromCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    toCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    dep: {
      type: String,
      required: [true, 'Departure time is required'],
    },
    arr: {
      type: String,
      required: [true, 'Arrival time is required'],
    },
    dur: {
      type: String,
      required: true,
    },
    dist: {
      type: String,
      required: true,
    },
    fareAC: {
      type: Number,
      required: [true, 'AC fare is required'],
      min: 0,
    },
    fareNAC: {
      type: Number,
      required: [true, 'Non-AC fare is required'],
      min: 0,
    },
    type: {
      type: String,
      enum: ['AC', 'Non-AC'],
      default: 'AC',
    },
    busType: {
      type: String,
      required: true,
    },
    available: {
      type: Number,
      default: 40,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

// Index for fast route search
routeSchema.index({ from: 1, to: 1 });

const Route = mongoose.model('Route', routeSchema);
export default Route;
