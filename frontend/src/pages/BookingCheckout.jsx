import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { formatCurrency, calculateDaysBetween, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CreditCard,
  ShieldCheck,
  Calendar,
  MapPin,
  Clock,
  Car,
  Tag,
  ArrowRight,
  AlertCircle,
  Banknote,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const BookingCheckout = () => {
  const [searchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { searchFilters, selectedVehicle, setSelectedVehicle } = useBooking();

  const [vehicle, setVehicle] = useState(selectedVehicle);
  const [loading, setLoading] = useState(!selectedVehicle);

  // Customer Form Data
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [drivingLicense, setDrivingLicense] = useState(user?.drivingLicense?.number || '');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Trip Data
  const [pickupLocation, setPickupLocation] = useState(searchFilters.pickupLocation || 'Airport Terminal 1 & 3');
  const [returnLocation, setReturnLocation] = useState(searchFilters.returnLocation || 'Airport Terminal 1 & 3');
  const [pickupDate, setPickupDate] = useState(searchFilters.pickupDate);
  const [pickupTime, setPickupTime] = useState(searchFilters.pickupTime || '10:00 AM');
  const [returnDate, setReturnDate] = useState(searchFilters.returnDate);
  const [returnTime, setReturnTime] = useState(searchFilters.returnTime || '10:00 AM');

  // Payment & Coupon
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch vehicle if loaded via direct URL
  useEffect(() => {
    if (!vehicle && vehicleIdParam) {
      const loadVehicle = async () => {
        try {
          const res = await vehicleService.getVehicleById(vehicleIdParam);
          if (res.success && res.vehicle) {
            setVehicle(res.vehicle);
            setSelectedVehicle(res.vehicle);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadVehicle();
    } else {
      setLoading(false);
    }
  }, [vehicleIdParam, vehicle]);

  // Synchronize user fields if loaded after mount
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!email) setEmail(user.email);
      if (!phone) setPhone(user.phone);
      if (!drivingLicense && user.drivingLicense?.number) {
        setDrivingLicense(user.drivingLicense.number);
      }
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-28 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-white text-[#151515] py-32 text-center px-4">
        <h2 className="text-2xl font-bold mb-3">No Vehicle Selected</h2>
        <p className="text-xs text-[#777777] mb-6">
          Please select a vehicle from our fleet before proceeding to checkout.
        </p>
        <Link to="/vehicles" className="px-6 py-2.5 rounded-xl bg-brand-primary text-white text-xs font-bold">
          Browse Vehicles
        </Link>
      </div>
    );
  }

  // Live Price Calculation
  const rentalDays = calculateDaysBetween(pickupDate, returnDate);
  const dailyRate = vehicle.pricePerDay || 0;
  const baseRental = dailyRate * rentalDays;
  const taxAmount = Math.round(baseRental * 0.18);
  const securityDeposit = vehicle.securityDeposit || 0;

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountAmount = Math.round((baseRental * appliedCoupon.discountValue) / 100);
      if (appliedCoupon.maximumDiscount && discountAmount > appliedCoupon.maximumDiscount) {
        discountAmount = appliedCoupon.maximumDiscount;
      }
    } else {
      discountAmount = Math.min(appliedCoupon.discountValue, baseRental);
    }
  }

  const subtotal = baseRental + taxAmount + securityDeposit;
  const finalPayable = Math.max(0, subtotal - discountAmount);

  // Coupon Application
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'RIDEVISTA10' || code === 'FIRSTTRIP' || code === 'WELCOME20') {
      setAppliedCoupon({
        code,
        discountType: 'percentage',
        discountValue: 20,
        maximumDiscount: 2500,
      });
    } else {
      setCouponError('Invalid promo code. Try "RIDEVISTA10" or "WELCOME20".');
    }
  };

  // Booking Placement
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    try {
      const bookingPayload = {
        vehicleId: vehicle._id,
        pickupLocation,
        returnLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        customerName,
        email,
        phone,
        drivingLicenseNumber: drivingLicense,
        additionalNotes,
        couponCode: appliedCoupon?.code || '',
        paymentMethod,
      };

      const bookingRes = await bookingService.createBooking(bookingPayload);
      if (!bookingRes.success || !bookingRes.booking) {
        throw new Error(bookingRes.message || 'Failed to place booking.');
      }

      const createdBooking = bookingRes.booking;

      if (paymentMethod === 'Cash' || paymentMethod === 'Pay at Pickup') {
        navigate(`/booking/success/${createdBooking._id}`);
        return;
      }

      // Razorpay / Simulator Flow
      const orderRes = await bookingService.createPaymentOrder(createdBooking._id);

      if (window.Razorpay && orderRes.key && orderRes.key !== 'rzp_test_devmode') {
        const options = {
          key: orderRes.key,
          amount: orderRes.order.amount,
          currency: 'INR',
          name: 'Car Rental',
          description: `Booking Reference ${createdBooking.bookingReference}`,
          order_id: orderRes.order.id,
          handler: async function (response) {
            try {
              const verifyRes = await bookingService.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                bookingId: createdBooking._id,
              });

              if (verifyRes.success) {
                navigate(`/booking/success/${createdBooking._id}`);
              }
            } catch (verErr) {
              setErrorMessage('Payment verification failed.');
            }
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Dev Mode Auto-simulator
        const verifyRes = await bookingService.verifyPayment({
          razorpay_order_id: orderRes.order?.id || `dev_order_${Date.now()}`,
          razorpay_payment_id: `pay_dev_${Date.now()}`,
          razorpay_signature: 'dev_signature_verified',
          bookingId: createdBooking._id,
        });

        if (verifyRes.success) {
          navigate(`/booking/success/${createdBooking._id}`);
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Booking process failed. Please check your details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#151515] pb-12 w-full">
      {/* ==================== FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-8 mb-8 rounded-none">
        <div className="container-fluid">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
            Checkout • Final Step
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading mt-1">
            Complete Your Reservation
          </h1>
        </div>
      </div>

      <div className="container-fluid">

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Details & Payment Selection */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleBookingSubmit} id="checkout-form" className="space-y-6">
              {/* Primary Driver Information */}
              <div className="bg-[#F8F8FA] rounded-2xl p-6 sm:p-8 border border-[#EAEAEA] space-y-4">
                <h3 className="text-xs font-bold text-[#151515] uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-primary" />
                  Primary Driver Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Full Legal Name
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="As per Government ID"
                      className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Email Address (For Invoice)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Driving License Number
                    </label>
                    <input
                      type="text"
                      value={drivingLicense}
                      onChange={(e) => setDrivingLicense(e.target.value)}
                      required
                      placeholder="DL-0420210087654"
                      className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Trip Schedule & Location Confirmation */}
              <div className="bg-[#F8F8FA] rounded-2xl p-6 sm:p-8 border border-[#EAEAEA] space-y-4">
                <h3 className="text-xs font-bold text-[#151515] uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  Rental Schedule & Pick-up Hub
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Pick-up Hub
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-brand-primary absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAEAEA] bg-white text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#777777] uppercase block mb-1">
                      Return Hub
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-brand-primary absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={returnLocation}
                        onChange={(e) => setReturnLocation(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAEAEA] bg-white text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Pickup Date</label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => setPickupDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#EAEAEA] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Pickup Time</label>
                    <input
                      type="time"
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#EAEAEA] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Return Date</label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#EAEAEA] bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#777777] uppercase block mb-1">Return Time</label>
                    <input
                      type="time"
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full p-2 rounded-xl border border-[#EAEAEA] bg-white text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="bg-[#F8F8FA] rounded-2xl p-6 sm:p-8 border border-[#EAEAEA] space-y-4">
                <h3 className="text-xs font-bold text-[#151515] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-primary" />
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'Razorpay'
                        ? 'border-brand-primary bg-brand-primaryLight text-brand-primary'
                        : 'border-[#EAEAEA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mb-2" />
                    <span className="text-xs font-bold">Online UPI / Card</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Razorpay Secured</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('Pay at Pickup')}
                    className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'Pay at Pickup'
                        ? 'border-brand-primary bg-brand-primaryLight text-brand-primary'
                        : 'border-[#EAEAEA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-2" />
                    <span className="text-xs font-bold">Pay at Pickup</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Card / UPI at Hub</span>
                  </label>

                  <label
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-4 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'Cash'
                        ? 'border-brand-primary bg-brand-primaryLight text-brand-primary'
                        : 'border-[#EAEAEA] bg-white hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mb-2" />
                    <span className="text-xs font-bold">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Direct Curbside</span>
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm tracking-wide transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{submitting ? 'Processing Reservation...' : `Confirm & Pay ${formatCurrency(finalPayable)}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Vehicle Summary & Cost Breakdown */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#F8F8FA] rounded-2xl p-6 border border-[#EAEAEA] space-y-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#151515] pb-2 border-b border-[#EAEAEA]">
                Vehicle Summary
              </h3>

              <div className="flex gap-4 items-center">
                <img
                  src={vehicle.images?.[0]}
                  alt={vehicle.name}
                  className="w-24 h-16 object-contain rounded-xl bg-white p-1 border border-gray-100"
                />
                <div>
                  <span className="text-[10px] font-bold uppercase text-brand-primary">
                    {vehicle.brand}
                  </span>
                  <h4 className="text-sm font-bold text-[#151515]">{vehicle.name}</h4>
                  <p className="text-xs text-[#777777]">{vehicle.transmission} • {vehicle.fuelType}</p>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#EAEAEA] text-xs">
                <div className="flex justify-between text-[#777777]">
                  <span>Daily Rate</span>
                  <span>{formatCurrency(dailyRate)} / day</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Duration</span>
                  <span>{rentalDays} {rentalDays === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex justify-between font-semibold text-[#151515]">
                  <span>Base Rental</span>
                  <span>{formatCurrency(baseRental)}</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>GST & Highway Cess (18%)</span>
                  <span>{formatCurrency(taxAmount)}</span>
                </div>
                <div className="flex justify-between text-[#777777]">
                  <span>Refundable Deposit</span>
                  <span>{formatCurrency(securityDeposit)}</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-[#EAEAEA] flex justify-between items-baseline">
                  <span className="text-sm font-extrabold text-[#151515]">Total Payable</span>
                  <span className="text-xl font-extrabold text-brand-primary">
                    {formatCurrency(finalPayable)}
                  </span>
                </div>
              </div>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-[#EAEAEA] flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. WELCOME20)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 text-xs font-bold text-gray-800 transition-colors"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
