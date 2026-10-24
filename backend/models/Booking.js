import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
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
      required: true,
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
      days: { type: Number, required: true },
      hours: { type: Number, default: 0 },
    },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      drivingLicenseNumber: { type: String, default: '' },
      additionalNotes: { type: String, default: '' },
    },
    priceBreakdown: {
      dailyRate: { type: Number, required: true },
      rentalDays: { type: Number, required: true },
      baseRental: { type: Number, required: true },
      securityDeposit: { type: Number, default: 0 },
      deliveryFee: { type: Number, default: 0 },
      taxAmount: { type: Number, default: 0 }, // GST 18%
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
      enum: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    paymentMethod: {
      type: String,
      enum: ['Razorpay', 'Cash', 'Pay at Pickup'],
      default: 'Razorpay',
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

// Compound index for quick vehicle availability queries
bookingSchema.index({ vehicle: 1, pickupDate: 1, returnDate: 1, bookingStatus: 1 });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
