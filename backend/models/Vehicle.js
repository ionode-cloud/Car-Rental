import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vehicle name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model name is required'],
      trim: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required (car, scooty, or bike)'],
      enum: ['car', 'scooty', 'bike'],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    images: {
      type: [String],
      validate: {
        validator: function (v) {
          return v && v.length > 0;
        },
        message: 'A vehicle must have at least one image',
      },
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price must be positive'],
    },
    pricePerHour: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 3000,
    },
    includedKilometers: {
      type: Number,
      default: 250, // per day
    },
    extraKilometerPrice: {
      type: Number,
      default: 12, // per km
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
      default: 'Petrol',
    },
    transmission: {
      type: String,
      enum: ['Automatic', 'Manual'],
      default: 'Manual',
    },
    seatingCapacity: {
      type: Number,
      default: 4,
    },
    engineCapacity: {
      type: String,
      default: '1200cc',
    },
    mileage: {
      type: String,
      default: '18 km/l',
    },
    registrationYear: {
      type: Number,
      default: new Date().getFullYear(),
    },
    ac: {
      type: Boolean,
      default: true,
    },
    helmetAvailable: {
      type: Boolean,
      default: false,
    },
    pickupLocation: {
      type: [String],
      default: ['Airport Terminal 1', 'City Center Hub', 'Railway Station', 'Downtown Hub'],
    },
    availability: {
      type: Boolean,
      default: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 4.8,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 12,
    },
  },
  {
    timestamps: true,
  }
);

// Search indexes
vehicleSchema.index({ name: 'text', brand: 'text', category: 'text' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
