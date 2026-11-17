import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rentalCategory: {
      type: String,
      enum: ['self_drive', 'with_driver'],
      default: 'self_drive',
      index: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true,
    },
    vehicleType: {
      type: String,
      enum: ['car', 'scooty', 'bike'],
      required: true,
    },
    pickupLocation: {
      type: String,
      required: true,
    },
    returnLocation: {
      type: String,
      default: '',
    },
    dropLocation: {
      type: String,
      default: '',
    },
    pickupDate: {
      type: Date,
      required: true,
    },
    pickupTime: {
      type: String,
      default: '10:00 AM',
    },
    returnDate: {
      type: Date,
      required: true,
    },
    returnTime: {
      type: String,
      default: '10:00 AM',
    },
    rentalDuration: {
      tier: { type: String, default: '24 Hours' },
      days: { type: Number, default: 1 },
      hours: { type: Number, default: 0 },
    },
    driverIncluded: {
      type: Boolean,
      default: false,
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      aadhaarNumber: { type: String, default: '' },
      aadhaarDocument: { type: String, default: '' },
      drivingLicenseNumber: { type: String, default: '' },
      drivingLicenseDocument: { type: String, default: '' },
      additionalNotes: { type: String, default: '' },
    },
    priceBreakdown: {
      dailyRate: { type: Number, default: 0 },
      rentalDays: { type: Number, default: 1 },
      baseRental: { type: Number, required: true },
      securityDeposit: { type: Number, default: 0 }, // 100% No Deposit Policy
      deliveryFee: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 },
      discountAmount: { type: Number, default: 0 },
      couponCode: { type: String, default: '' },
      finalAmount: { type: Number, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Paid', 'Failed', 'Refunded', 'Partially Refunded'],
      default: 'Pending',
      index: true,
    },
    bookingStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Ongoing', 'Active', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'Cash', 'Pay at Pickup'],
      default: 'Pay at Pickup',
    },
    paymentTransaction: {
      razorpayOrderId: { type: String, default: '' },
      razorpayPaymentId: { type: String, default: '' },
      razorpaySignature: { type: String, default: '' },
      paidAt: { type: Date },
    },
    cancellationReason: {
      type: String,
      default: '',
    },
    cancellationRefund: {
      type: Number,
      default: 0,
    },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        updatedBy: { type: String, default: 'System' },
        note: { type: String, default: '' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Compound index for vehicle availability queries
bookingSchema.index({ vehicle: 1, pickupDate: 1, returnDate: 1, bookingStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
