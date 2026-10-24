import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Package name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      required: true,
      enum: ['Daily', 'Weekend', 'Weekly', 'Monthly', 'Outstation', 'Corporate'],
      default: 'Daily',
    },
    vehicleCategory: {
      type: String,
      default: 'All Vehicles',
    },
    duration: {
      type: String,
      required: true, // e.g. "24 Hours", "Weekend (3 Days)", "7 Days", "30 Days"
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    includedKilometers: {
      type: Number,
      required: true,
    },
    extraKilometerPrice: {
      type: Number,
      default: 12,
    },
    discount: {
      type: Number,
      default: 0, // percentage or fixed
    },
    image: {
      type: String,
      default: '',
    },
    features: {
      type: [String],
      default: [],
    },
    terms: {
      type: [String],
      default: [
        'Valid Government ID & Driving License required',
        'Fuel charges borne by customer',
        'Standard security deposit applicable',
      ],
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model('Package', packageSchema);
export default Package;
