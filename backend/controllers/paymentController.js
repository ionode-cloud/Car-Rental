import razorpayInstance from '../config/razorpay.js';
import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';

/**
 * @desc    Create Razorpay Order for a booking
 * @route   POST /api/payments/create-order
 * @access  Private
 */
export const createOrder = async (req, res) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    const amountInPaise = Math.round(booking.totalAmount * 100);

    if (razorpayInstance) {
      const options = {
        amount: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingReference,
        notes: {
          bookingId: booking._id.toString(),
          customerEmail: booking.customerDetails.email,
        },
      };

      const order = await razorpayInstance.orders.create(options);
      booking.paymentTransaction.razorpayOrderId = order.id;
      await booking.save();

      return res.json({
        success: true,
        order,
        key: process.env.RAZORPAY_KEY_ID,
      });
    } else {
      // Development mode simulator order
      const mockOrder = {
        id: `order_dev_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: booking.bookingReference,
        status: 'created',
      };

      booking.paymentTransaction.razorpayOrderId = mockOrder.id;
      await booking.save();

      return res.json({
        success: true,
        isDevMode: true,
        order: mockOrder,
        key: 'rzp_test_devmode',
        message: 'Running in development payment simulator mode.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Payment order creation failed',
    });
  }
};

/**
 * @desc    Verify Razorpay payment signature
 * @route   POST /api/payments/verify
 * @access  Private
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
    } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found for payment verification.',
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (secret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', secret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature. Verification failed.',
        });
      }
    }

    // Update booking status
    booking.paymentStatus = 'Paid';
    booking.bookingStatus = 'Confirmed';
    booking.paymentTransaction = {
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id || `pay_dev_${Date.now()}`,
      razorpaySignature: razorpay_signature || 'dev_verified',
      paidAt: new Date(),
    };

    booking.statusHistory.push({
      status: 'Paid',
      note: `Online payment received (Txn: ${booking.paymentTransaction.razorpayPaymentId})`,
      updatedBy: 'Razorpay Gateway',
      timestamp: new Date(),
    });

    await booking.save();

    // Record in Payment collection
    const paymentRecord = await Payment.create({
      booking: booking._id,
      customer: req.user._id,
      transactionId: booking.paymentTransaction.razorpayPaymentId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: booking.paymentTransaction.razorpayPaymentId,
      amount: booking.totalAmount,
      currency: 'INR',
      paymentMethod: 'Razorpay',
      status: 'Paid',
    });

    res.json({
      success: true,
      message: 'Payment verified and booking confirmed successfully!',
      booking,
      payment: paymentRecord,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed',
    });
  }
};

/**
 * @desc    Get current user's payments
 * @route   GET /api/payments/my-payments
 * @access  Private
 */
export const getMyPayments = async (req, res) => {
  try {
    const payments = await Payment.find({ customer: req.user._id })
      .populate('booking', 'bookingReference pickupDate returnDate vehicleType')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
