import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Coupon from '../models/Coupon.js';
import { calculateBookingPrice } from '../utils/calculateBookingPrice.js';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';
import { generateInvoicePDF } from '../utils/invoiceGenerator.js';

/**
 * @desc    Create a new vehicle booking
 * @route   POST /api/bookings
 * @access  Private (Authenticated Customer)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      vehicleId,
      pickupLocation,
      returnLocation,
      pickupDate,
      pickupTime,
      returnDate,
      returnTime,
      customerName,
      phone,
      email,
      drivingLicenseNumber,
      additionalNotes,
      couponCode,
      paymentMethod = 'Razorpay',
    } = req.body;

    if (!vehicleId || !pickupLocation || !returnLocation || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required booking details (vehicle, dates, and locations).',
      });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'The selected vehicle is currently not available for rental.',
      });
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);

    if (pDate >= rDate) {
      return res.status(400).json({
        success: false,
        message: 'Return date must be strictly after pickup date.',
      });
    }

    // Availability check — prevent overlapping confirmed/active/pending bookings
    const existingConflict = await Booking.findOne({
      vehicle: vehicleId,
      bookingStatus: { $in: ['Confirmed', 'Active', 'Pending'] },
      $or: [
        {
          pickupDate: { $lte: rDate },
          returnDate: { $gte: pDate },
        },
      ],
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message: 'This vehicle is already reserved for the selected dates. Please choose another vehicle or timeframe.',
      });
    }

    // Check optional coupon
    let coupon = null;
    if (couponCode && couponCode.trim()) {
      coupon = await Coupon.findOne({
        code: couponCode.trim().toUpperCase(),
        status: 'active',
        validUntil: { $gte: new Date() },
      });
      if (coupon) {
        coupon.usedCount += 1;
        await coupon.save();
      }
    }

    // Re-calculate price on server side
    const priceBreakdown = calculateBookingPrice({
      vehicle,
      pickupDate: pDate,
      returnDate: rDate,
      coupon,
    });

    // Generate unique booking reference
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `RV-${timestamp}-${randomSuffix}`;

    const newBooking = await Booking.create({
      bookingReference,
      customer: req.user._id,
      vehicle: vehicle._id,
      vehicleType: vehicle.vehicleType,
      pickupLocation,
      returnLocation,
      pickupDate: pDate,
      pickupTime: pickupTime || '10:00 AM',
      returnDate: rDate,
      returnTime: returnTime || '10:00 AM',
      rentalDuration: {
        days: priceBreakdown.rentalDays,
        hours: 0,
      },
      customerDetails: {
        name: customerName || req.user.name,
        email: email || req.user.email,
        phone: phone || req.user.phone,
        drivingLicenseNumber: drivingLicenseNumber || '',
        additionalNotes: additionalNotes || '',
      },
      priceBreakdown,
      totalAmount: priceBreakdown.finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash' || paymentMethod === 'Pay at Pickup' ? 'Pending' : 'Pending',
      bookingStatus: 'Confirmed', // Mark confirmed on booking placement
      statusHistory: [
        {
          status: 'Confirmed',
          note: `Booking placed with ${paymentMethod} payment method.`,
          updatedBy: req.user.name,
        },
      ],
    });

    // Fire & forget confirmation email
    sendBookingConfirmationEmail(newBooking, req.user, vehicle).catch((err) =>
      console.warn('Booking email notification log:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Booking placed successfully!',
      booking: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create booking',
    });
  }
};

/**
 * @desc    Get bookings of current customer
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customer: req.user._id })
      .populate('vehicle', 'name brand model images vehicleType category pricePerDay fuelType transmission seatingCapacity registrationNumber features')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get booking details by ID
 * @route   GET /api/bookings/:id
 * @access  Private (Owner or Admin)
 */
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('customer', 'name email phone profileImage');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Access check: User must be either the owner or an admin
    if (
      booking.customer._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this booking record.',
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/bookings/:id/cancel
 * @access  Private (Customer or Admin)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { reason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (
      booking.customer.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking.',
      });
    }

    if (booking.bookingStatus === 'Completed') {
      return res.status(400).json({
        success: false,
        message: 'Completed bookings cannot be cancelled.',
      });
    }

    if (booking.bookingStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking has already been cancelled.',
      });
    }

    // Cancellation policy: 90% refund if >24 hours before pickup, 50% if within 24 hours
    const now = new Date();
    const pickup = new Date(booking.pickupDate);
    const hoursBeforePickup = (pickup.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = 0;
    if (booking.paymentStatus === 'Paid') {
      if (hoursBeforePickup > 24) {
        refundAmount = Math.round(booking.totalAmount * 0.9);
      } else if (hoursBeforePickup > 0) {
        refundAmount = Math.round(booking.totalAmount * 0.5);
      }
    }

    booking.bookingStatus = 'Cancelled';
    booking.cancellationReason = reason || 'Customer requested cancellation';
    booking.cancellationRefund = refundAmount;

    if (refundAmount > 0) {
      booking.paymentStatus = 'Refunded';
    }

    booking.statusHistory.push({
      status: 'Cancelled',
      note: `Cancelled by ${req.user.name}. Reason: ${booking.cancellationReason}. Refund: ₹${refundAmount}`,
      updatedBy: req.user.name,
      timestamp: new Date(),
    });

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully.',
      booking,
      refundAmount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Download booking PDF invoice
 * @route   GET /api/bookings/:id/invoice
 * @access  Private (Owner or Admin)
 */
export const downloadInvoice = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('vehicle')
      .populate('customer', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const customerId = booking.customer?._id?.toString() || booking.customer?.toString();
    const isOwner = customerId && req.user && customerId === req.user._id.toString();
    const isAdmin = req.user && req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to download this invoice.',
      });
    }

    generateInvoicePDF(booking, res);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
