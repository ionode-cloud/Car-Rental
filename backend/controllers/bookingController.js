import Booking from '../models/Booking.js';
import Vehicle from '../models/Vehicle.js';
import Coupon from '../models/Coupon.js';
import { calculateBookingPrice } from '../utils/calculateBookingPrice.js';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';
import { generateInvoicePDF } from '../utils/invoiceGenerator.js';

/**
 * Helper to compute return datetime from pickup date, pickup time, and duration
 */
const computeReturnDateTime = (pickupDateStr, pickupTimeStr, durationTier, estimatedHours, customDays) => {
  const pDate = new Date(pickupDateStr);
  let [timePart, meridiem] = (pickupTimeStr || '10:00 AM').split(' ');
  let [hours, minutes] = (timePart || '10:00').split(':').map(Number);
  if (meridiem && meridiem.toUpperCase() === 'PM' && hours < 12) hours += 12;
  if (meridiem && meridiem.toUpperCase() === 'AM' && hours === 12) hours = 0;

  pDate.setHours(hours, minutes || 0, 0, 0);

  let durationHours = 24;

  const daysMatch = String(durationTier).match(/^(\d+)\s*Days?$/i);
  if (customDays && Number(customDays) > 0) {
    durationHours = Number(customDays) * 24;
  } else if (daysMatch) {
    durationHours = Number(daysMatch[1]) * 24;
  } else if (durationTier === '4 Hours') {
    durationHours = 4;
  } else if (durationTier === '8 Hours') {
    durationHours = 8;
  } else if (durationTier === '12 Hours') {
    durationHours = 12;
  } else if (durationTier === '24 Hours' || durationTier === '1 Day') {
    durationHours = 24;
  } else if (estimatedHours && Number(estimatedHours) > 0) {
    durationHours = Math.max(4, Number(estimatedHours));
  }

  const rDate = new Date(pDate.getTime() + durationHours * 60 * 60 * 1000);

  // Return formatted time string
  const rHours = rDate.getHours();
  const rMinutes = rDate.getMinutes().toString().padStart(2, '0');
  const rMeridiem = rHours >= 12 ? 'PM' : 'AM';
  const displayHours = rHours % 12 === 0 ? 12 : rHours % 12;
  const returnTimeStr = `${displayHours}:${rMinutes} ${rMeridiem}`;

  return {
    startDateTime: pDate,
    endDateTime: rDate,
    returnTimeStr,
    durationHours,
  };
};

/**
 * @desc    Create a new vehicle booking (Self Drive or Driving with Driver)
 * @route   POST /api/bookings
 * @access  Private (Authenticated Customer)
 */
export const createBooking = async (req, res) => {
  try {
    const {
      rentalCategory = 'self_drive', // 'self_drive' or 'with_driver'
      vehicleId,
      pickupLocation,
      dropLocation,
      returnLocation,
      pickupDate,
      pickupTime = '10:00 AM',
      returnDate: clientReturnDate,
      returnTime: clientReturnTime,
      durationTier = '24 Hours',
      estimatedHours = 0,
      customDays = 0,
      customerName,
      phone,
      email,
      aadhaarNumber,
      aadhaarDocument,
      drivingLicenseNumber,
      drivingLicenseDocument,
      additionalNotes,
      couponCode,
      paymentMethod = 'Pay at Pickup',
    } = req.body;

    // Basic validation
    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a vehicle to proceed with booking.',
      });
    }

    if (!pickupLocation || !pickupDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide pickup location and pickup date & time.',
      });
    }

    if (!customerName || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name and WhatsApp mobile number.',
      });
    }

    // Category-specific validations
    if (rentalCategory === 'self_drive') {
      if (!drivingLicenseNumber || !drivingLicenseNumber.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Driving Licence Number is required for Self Drive booking.',
        });
      }
    } else if (rentalCategory === 'with_driver') {
      if (!dropLocation || !dropLocation.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Drop Location is required for Driving with Driver booking.',
        });
      }
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'The selected vehicle is currently not available for rental.',
      });
    }

    // Compute dates and timeframe from custom dates
    let startDateTime;
    let endDateTime;
    let computedReturnTime = clientReturnTime || '10:00 AM';

    if (clientReturnDate) {
      let [pTimePart, pMer] = (pickupTime || '10:00 AM').split(' ');
      let [pH, pM] = (pTimePart || '10:00').split(':').map(Number);
      if (pMer && pMer.toUpperCase() === 'PM' && pH < 12) pH += 12;
      if (pMer && pMer.toUpperCase() === 'AM' && pH === 12) pH = 0;
      startDateTime = new Date(pickupDate);
      startDateTime.setHours(pH, pM || 0, 0, 0);

      let [rTimePart, rMer] = (clientReturnTime || '10:00 AM').split(' ');
      let [rH, rM] = (rTimePart || '10:00').split(':').map(Number);
      if (rMer && rMer.toUpperCase() === 'PM' && rH < 12) rH += 12;
      if (rMer && rMer.toUpperCase() === 'AM' && rH === 12) rH = 0;
      endDateTime = new Date(clientReturnDate);
      endDateTime.setHours(rH, rM || 0, 0, 0);
      computedReturnTime = clientReturnTime || '10:00 AM';
    } else {
      const computed = computeReturnDateTime(pickupDate, pickupTime, durationTier, estimatedHours, customDays);
      startDateTime = computed.startDateTime;
      endDateTime = computed.endDateTime;
      computedReturnTime = computed.returnTimeStr;
    }

    if (startDateTime >= endDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Return date/time must be strictly after pickup date/time.',
      });
    }

    // Minimum rental duration check (minimum 4 hours)
    const diffHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
    if (diffHours < 3.99) {
      return res.status(400).json({
        success: false,
        message: 'Minimum rental duration is 4 hours.',
      });
    }

    // Double Booking Prevention: Check overlapping bookings
    const existingConflict = await Booking.findOne({
      vehicle: vehicleId,
      bookingStatus: { $in: ['Pending', 'Confirmed', 'Ongoing', 'Active'] },
      $or: [
        {
          pickupDate: { $lt: endDateTime },
          returnDate: { $gt: startDateTime },
        },
      ],
    });

    if (existingConflict) {
      return res.status(400).json({
        success: false,
        message:
          'This vehicle is already reserved for the selected dates and time slot. Please choose another vehicle or timeframe.',
      });
    }

    // Optional Coupon Check
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

    // Calculate Price Breakdown
    const priceBreakdown = calculateBookingPrice({
      vehicle,
      rentalCategory,
      durationTier,
      estimatedHours,
      customDays,
      pickupDate: startDateTime,
      returnDate: endDateTime,
      coupon,
    });

    // Generate unique reference ID
    const prefix = rentalCategory === 'with_driver' ? 'RV-DR' : 'RV-SD';
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `${prefix}-${timestamp}-${randomSuffix}`;

    const effectiveReturnLocation = dropLocation || returnLocation || pickupLocation;

    const newBooking = await Booking.create({
      bookingReference,
      rentalCategory,
      customer: req.user._id,
      vehicle: vehicle._id,
      vehicleType: vehicle.vehicleType || 'car',
      pickupLocation,
      dropLocation: effectiveReturnLocation,
      returnLocation: effectiveReturnLocation,
      pickupDate: startDateTime,
      pickupTime: pickupTime || '10:00 AM',
      returnDate: endDateTime,
      returnTime: computedReturnTime,
      rentalDuration: {
        tier: durationTier || `${priceBreakdown.rentalDays * 24} Hours`,
        days: priceBreakdown.rentalDays,
        hours: priceBreakdown.hours,
      },
      driverIncluded: rentalCategory === 'with_driver',
      customerDetails: {
        name: customerName || req.user.name,
        email: email || req.user.email,
        phone: phone || req.user.phone,
        aadhaarNumber: aadhaarNumber || '',
        aadhaarDocument: aadhaarDocument || '',
        drivingLicenseNumber: drivingLicenseNumber || '',
        drivingLicenseDocument: drivingLicenseDocument || '',
        additionalNotes: additionalNotes || '',
      },
      priceBreakdown,
      totalAmount: priceBreakdown.finalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'Cash' || paymentMethod === 'Pay at Pickup' ? 'Pending' : 'Pending',
      bookingStatus: 'Confirmed', // Confirmed on booking
      statusHistory: [
        {
          status: 'Confirmed',
          note: `Booking placed successfully for ${rentalCategory === 'with_driver' ? 'Driving with Driver' : 'Self Drive'} (${durationTier}).`,
          updatedBy: req.user.name || 'Customer',
        },
      ],
    });

    // Populate vehicle for response
    await newBooking.populate('vehicle', 'name brand model images vehicleType category pricePerDay');

    // Build direct WhatsApp confirmation message
    const cleanPhone = (phone || req.user.phone || '').replace(/\D/g, '');
    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
    const categoryName = rentalCategory === 'with_driver' ? 'Driving with Driver' : 'Self Drive';
    const formattedDate = new Date(startDateTime).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const whatsappMessage = `🚗 *Booking Confirmed - RideVista Mobility*
━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${bookingReference}
🚘 *Category:* ${categoryName}
🚙 *Vehicle:* ${vehicle.brand} ${vehicle.name}
📍 *Pickup:* ${pickupLocation}
${rentalCategory === 'with_driver' ? `🏁 *Drop:* ${effectiveReturnLocation}\n` : ''}📅 *Date & Time:* ${formattedDate} at ${pickupTime}
⏱ *Duration:* ${durationTier}
💰 *Total Fare:* ₹${priceBreakdown.finalAmount.toLocaleString('en-IN')}
🛡️ *Security Deposit:* ₹0 (100% No Deposit)
━━━━━━━━━━━━━━━━━━━━
Thank you for booking with us! Have a safe journey!`;

    const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(whatsappMessage)}`;

    // Fire confirmation email in background
    sendBookingConfirmationEmail(newBooking, req.user, vehicle).catch((err) =>
      console.warn('Booking email notification log:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Booking placed successfully!',
      booking: newBooking,
      whatsappUrl,
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
      .populate(
        'vehicle',
        'name brand model images vehicleType category pricePerDay fuelType transmission seatingCapacity registrationNumber features'
      )
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
    const customerId = booking.customer?._id?.toString() || booking.customer?.toString();
    if (customerId !== req.user._id.toString() && req.user.role !== 'admin') {
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
