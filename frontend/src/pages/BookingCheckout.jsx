import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { vehicleService } from '../services/vehicleService';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatDate } from '../utils/formatters';
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
  User,
  Key,
  Upload,
  Check,
  ChevronRight,
  FileText,
  X,
  Phone,
  HelpCircle,
  Navigation,
  ShieldAlert,
  Plus,
  Minus,
} from 'lucide-react';

const BookingCheckout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const vehicleIdParam = searchParams.get('vehicleId');
  const categoryParam = searchParams.get('category');
  const durationParam = searchParams.get('duration');
  const navigate = useNavigate();

  const { user, isAuthenticated } = useAuth();
  const { searchFilters, selectedVehicle, setSelectedVehicle } = useBooking();

  // Booking Category: 'self_drive' | 'with_driver'
  const [rentalCategory, setRentalCategory] = useState(
    categoryParam === 'with_driver' ? 'with_driver' : 'self_drive'
  );

  // Vehicle states
  const [vehicle, setVehicle] = useState(selectedVehicle);
  const [vehiclesList, setVehiclesList] = useState([]);
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('car'); // 'car' | 'bike'
  const [showVehiclePicker, setShowVehiclePicker] = useState(!selectedVehicle && !vehicleIdParam);
  const [loading, setLoading] = useState(true);

  // Common Customer Details
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [aadhaarBase64, setAadhaarBase64] = useState('');

  // Self Drive Specific Details
  const [drivingLicense, setDrivingLicense] = useState(user?.drivingLicense?.number || '');
  const [licenseFile, setLicenseFile] = useState(null);
  const [licenseBase64, setLicenseBase64] = useState('');

  // Driving with Driver Specific Details
  const [dropLocation, setDropLocation] = useState('');

  // Helper for today / tomorrow dates
  const getTodayStr = () => new Date().toISOString().split('T')[0];
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const pickupDateParam = searchParams.get('pickupDate');
  const pickupTimeParam = searchParams.get('pickupTime');
  const returnDateParam = searchParams.get('returnDate');
  const returnTimeParam = searchParams.get('returnTime');

  // Trip Schedule (Pickup & Return) - Auto-shown Custom Dates
  const [pickupLocation, setPickupLocation] = useState(
    searchFilters.pickupLocation || 'Aerocity Hub, New Delhi'
  );
  const [pickupDate, setPickupDate] = useState(
    pickupDateParam || searchFilters.pickupDate || getTodayStr()
  );
  const [pickupTime, setPickupTime] = useState(
    pickupTimeParam || searchFilters.pickupTime || '10:00 AM'
  );
  const [returnDate, setReturnDate] = useState(
    returnDateParam || getTomorrowStr()
  );
  const [returnTime, setReturnTime] = useState(
    returnTimeParam || '10:00 AM'
  );
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Payment & Coupon
  const [paymentMethod, setPaymentMethod] = useState('Pay at Pickup');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Helper to parse date and time into JavaScript Date
  const parseDateTime = (dateStr, timeStr) => {
    if (!dateStr) return new Date();
    const dt = new Date(`${dateStr}T00:00:00`);
    let [tp, mer] = (timeStr || '10:00 AM').trim().split(' ');
    let [h, m] = (tp || '10:00').split(':').map(Number);
    if (mer && mer.toUpperCase() === 'PM' && h < 12) h += 12;
    if (mer && mer.toUpperCase() === 'AM' && h === 12) h = 0;
    dt.setHours(h || 0, m || 0, 0, 0);
    return dt;
  };

  // Quick extend handler (+4h, +1 Day, +2 Days, +3 Days, +5 Days)
  const handleQuickExtend = (type, val) => {
    const pDt = parseDateTime(pickupDate, pickupTime);
    if (type === 'hours') {
      const newRDt = new Date(pDt.getTime() + val * 60 * 60 * 1000);
      setReturnDate(newRDt.toISOString().split('T')[0]);
      const rh = newRDt.getHours();
      const rm = newRDt.getMinutes().toString().padStart(2, '0');
      const rmer = rh >= 12 ? 'PM' : 'AM';
      const disph = rh % 12 === 0 ? 12 : rh % 12;
      setReturnTime(`${disph.toString().padStart(2, '0')}:${rm} ${rmer}`);
    } else if (type === 'days') {
      const newRDt = new Date(pDt.getTime() + val * 24 * 60 * 60 * 1000);
      setReturnDate(newRDt.toISOString().split('T')[0]);
    }
  };

  const handlePickupDateChange = (val) => {
    setPickupDate(val);
    if (val >= returnDate) {
      const nextDay = new Date(val);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay.toISOString().split('T')[0]);
    }
  };

  // Fetch all active vehicles for the vehicle selection drawer
  useEffect(() => {
    const fetchAllVehicles = async () => {
      try {
        const res = await vehicleService.getAllVehicles({ status: 'active' });
        if (res.success && res.vehicles) {
          setVehiclesList(res.vehicles);
          if (!vehicle && !vehicleIdParam && res.vehicles.length > 0) {
            setVehicle(res.vehicles[0]);
            setSelectedVehicle(res.vehicles[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load fleet:', err);
      }
    };
    fetchAllVehicles();
  }, []);

  // Fetch specific vehicle if provided via URL param
  useEffect(() => {
    if (categoryParam) {
      setRentalCategory(categoryParam === 'with_driver' ? 'with_driver' : 'self_drive');
    }
    if (durationParam) {
      setSelectedDuration(parseInitialDuration(durationParam));
    }
  }, [categoryParam, durationParam]);

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
  }, [vehicleIdParam]);

  // Synchronize user fields
  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name || '');
      if (!email) setEmail(user.email || '');
      if (!phone) setPhone(user.phone || '');
      if (!drivingLicense && user.drivingLicense?.number) {
        setDrivingLicense(user.drivingLicense.number);
      }
    }
  }, [user]);

  // Handle Aadhaar image upload
  const handleAadhaarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }
    setAadhaarFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setAadhaarBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handle Driving Licence image upload
  const handleLicenseUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB. Please choose a smaller image.');
      return;
    }
    setLicenseFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setLicenseBase64(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Calculate pricing dynamically according to customer-provided rate table:
  // 4 Hours: ₹800 | 8 Hours: ₹1,200 | 24 Hours (1 Day): ₹1,800 | Multi-Day: Days * ₹1,800
  const calculatePricing = () => {
    const dayRate = 1800;

    let baseAmount = dayRate;
    let durationLabel = '1 Day (24 Hours)';
    let diffHours = 24;
    let isUnderMin = false;

    if (pickupDate && returnDate) {
      const pDt = parseDateTime(pickupDate, pickupTime);
      const rDt = parseDateTime(returnDate, returnTime);
      const diffMs = rDt.getTime() - pDt.getTime();
      diffHours = diffMs / (1000 * 60 * 60);

      if (diffHours < 3.99) {
        isUnderMin = true;
        baseAmount = 800;
        durationLabel = `${Math.max(1, Math.round(diffHours))}h (Below 4h min)`;
      } else if (diffHours <= 4) {
        baseAmount = 800;
        durationLabel = '4 Hours (Minimum Slot)';
      } else if (diffHours <= 8) {
        baseAmount = 1200;
        durationLabel = '8 Hours';
      } else if (diffHours <= 24) {
        baseAmount = dayRate;
        durationLabel = '1 Day (24 Hours)';
      } else {
        const days = Math.ceil(diffHours / 24);
        baseAmount = days * dayRate;
        durationLabel = `${days} Days (${Math.round(diffHours)}h)`;
      }
    }

    // 100% No Security Deposit
    const securityDeposit = 0;

    let discountAmount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discountAmount = Math.round((baseAmount * appliedCoupon.discountValue) / 100);
        if (appliedCoupon.maximumDiscount && discountAmount > appliedCoupon.maximumDiscount) {
          discountAmount = appliedCoupon.maximumDiscount;
        }
      } else {
        discountAmount = Math.min(appliedCoupon.discountValue, baseAmount);
      }
    }

    const finalAmount = Math.max(0, baseAmount - discountAmount);

    return {
      baseAmount,
      durationLabel,
      diffHours,
      isUnderMin,
      securityDeposit: 0,
      discountAmount,
      finalAmount,
    };
  };

  const pricing = calculatePricing();

  // Coupon handler
  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    const code = couponCode.trim().toUpperCase();

    if (code === 'RIDEVISTA10' || code === 'FIRSTTRIP' || code === 'NODEPOSIT') {
      setAppliedCoupon({
        code,
        discountType: 'percentage',
        discountValue: 15,
        maximumDiscount: 1500,
      });
      setCouponSuccess('Promo coupon applied! 15% discount deducted.');
    } else if (code === 'SAVE200') {
      setAppliedCoupon({
        code,
        discountType: 'fixed',
        discountValue: 200,
      });
      setCouponSuccess('Flat ₹200 off applied!');
    } else {
      setCouponError('Invalid promo code. Try "NODEPOSIT" or "SAVE200".');
    }
  };

  // Submission handler
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (pricing.isUnderMin) {
      setErrorMessage(
        'Minimum rental duration is 4 hours. Please select a return time at least 4 hours after pickup.'
      );
      return;
    }

    if (!vehicle) {
      setErrorMessage('Please select a vehicle to proceed.');
      return;
    }

    // Validations
    if (!customerName.trim()) {
      setErrorMessage('Full Legal Name is required.');
      return;
    }
    if (!phone.trim()) {
      setErrorMessage('WhatsApp Mobile Number is required for booking confirmation.');
      return;
    }

    if (rentalCategory === 'self_drive') {
      if (!drivingLicense.trim()) {
        setErrorMessage('Driving Licence Number is required for Self Drive rentals.');
        return;
      }
    } else {
      if (!dropLocation.trim()) {
        setErrorMessage('Drop Location is required when booking with a driver.');
        return;
      }
    }

    setSubmitting(true);

    try {
      const payload = {
        rentalCategory,
        vehicleId: vehicle._id,
        pickupLocation,
        dropLocation: rentalCategory === 'with_driver' ? dropLocation : pickupLocation,
        returnLocation: rentalCategory === 'with_driver' ? dropLocation : pickupLocation,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        durationTier: pricing.durationLabel,
        customDays: pricing.diffHours > 24 ? Math.ceil(pricing.diffHours / 24) : 0,
        estimatedHours: pricing.diffHours <= 24 ? Math.round(pricing.diffHours) : 0,
        customerName: customerName.trim(),
        email: email.trim() || user?.email || 'customer@ridevista.com',
        phone: phone.trim(),
        aadhaarNumber: aadhaarNumber.trim(),
        aadhaarDocument: aadhaarBase64,
        drivingLicenseNumber: rentalCategory === 'self_drive' ? drivingLicense.trim() : '',
        drivingLicenseDocument: rentalCategory === 'self_drive' ? licenseBase64 : '',
        additionalNotes,
        couponCode: appliedCoupon?.code || '',
        paymentMethod,
      };

      const res = await bookingService.createBooking(payload);

      if (!res.success || !res.booking) {
        throw new Error(res.message || 'Failed to place booking.');
      }

      const createdBooking = res.booking;

      if (paymentMethod === 'Razorpay') {
        try {
          const orderRes = await bookingService.createPaymentOrder(createdBooking._id);
          if (window.Razorpay && orderRes.key && orderRes.key !== 'rzp_test_devmode') {
            const options = {
              key: orderRes.key,
              amount: orderRes.order.amount,
              currency: 'INR',
              name: 'Car Rental Mobility',
              description: `Booking Reference ${createdBooking.bookingReference}`,
              order_id: orderRes.order.id,
              handler: async function (response) {
                try {
                  await bookingService.verifyPayment({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    bookingId: createdBooking._id,
                  });
                  navigate(`/booking/success/${createdBooking._id}`);
                } catch {
                  navigate(`/booking/success/${createdBooking._id}`);
                }
              },
            };
            const rzp = new window.Razorpay(options);
            rzp.open();
            return;
          }
        } catch (payErr) {
          console.warn('Payment order fallback:', payErr.message);
        }
      }

      navigate(`/booking/success/${createdBooking._id}`);
    } catch (err) {
      setErrorMessage(
        err.message || 'Booking process failed. Please check your information or choose another vehicle.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const filteredVehicles = vehiclesList.filter((v) => {
    if (vehicleTypeFilter === 'car') return v.vehicleType === 'car';
    return v.vehicleType === 'bike' || v.vehicleType === 'scooty';
  });

  if (loading && !vehicle) {
    return (
      <div className="min-h-screen bg-white py-28 flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#151515] pb-16">
      {/* ==================== 1. TOP HEADER & NO DEPOSIT PROMISE BANNER ==================== */}
      <div className="bg-white border-b border-gray-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-brand-primary">
                Instant Reservation
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#151515] mt-1">
                Book Your Ride
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Choose between Self Drive or a Chauffeur Driven journey with custom dates & zero deposit.
              </p>
            </div>

            {/* Prominent No Deposit Badge */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-500/30 flex items-center gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">
                    100% No Security Deposit Required
                  </span>
                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-emerald-600 text-white uppercase">
                    ₹0 Deposit
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                  Book your ride without paying any deposit! Minimum booking duration is 4 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm font-semibold flex items-center gap-3 shadow-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ==================== 2. MAIN FORM & SUMMARY GRID ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleBookingSubmit} id="rental-booking-form" className="space-y-6">
              {/* SECTION A: Vehicle Selection */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-[#151515] uppercase tracking-wider flex items-center gap-2">
                    <Car className="w-4 h-4 text-brand-primary" />
                    Selected Vehicle
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowVehiclePicker(!showVehiclePicker)}
                    className="text-xs font-bold text-brand-primary hover:underline cursor-pointer"
                  >
                    {showVehiclePicker ? 'Close Catalog' : 'Change Vehicle'}
                  </button>
                </div>

                {vehicle && (
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={
                          vehicle.images?.[0] ||
                          'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop'
                        }
                        alt={vehicle.name}
                        className="w-20 h-14 object-contain rounded-xl bg-white p-1 border border-gray-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold text-brand-primary uppercase">
                          {vehicle.brand} • {vehicle.vehicleType === 'car' ? 'Car' : 'Bike / Scooty'}
                        </span>
                        <h4 className="text-sm font-black text-[#151515]">{vehicle.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          {vehicle.category} • {vehicle.fuelType} • {vehicle.seatingCapacity || 5} Seats
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end gap-1">
                      <span className="text-[10px] text-gray-400 uppercase font-bold">Rental Mode</span>
                      <div className="inline-flex p-1 bg-white border border-gray-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setRentalCategory('self_drive')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            rentalCategory === 'self_drive'
                              ? 'bg-brand-primary text-white shadow-xs'
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          Self Drive
                        </button>
                        <button
                          type="button"
                          onClick={() => setRentalCategory('with_driver')}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            rentalCategory === 'with_driver'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          With Driver
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Inline Vehicle Selection Drawer */}
                {showVehiclePicker && (
                  <div className="pt-3 border-t border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-600">Choose Fleet Vehicle:</span>
                      <div className="flex items-center gap-1.5 p-1 bg-gray-100 rounded-xl">
                        <button
                          type="button"
                          onClick={() => setVehicleTypeFilter('car')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            vehicleTypeFilter === 'car'
                              ? 'bg-white text-[#151515] shadow-xs'
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          Cars
                        </button>
                        <button
                          type="button"
                          onClick={() => setVehicleTypeFilter('bike')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            vehicleTypeFilter === 'bike'
                              ? 'bg-white text-[#151515] shadow-xs'
                              : 'text-gray-500 hover:text-black'
                          }`}
                        >
                          Bikes & Scooties
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-64 overflow-y-auto pr-1">
                      {filteredVehicles.map((v) => (
                        <div
                          key={v._id}
                          onClick={() => {
                            setVehicle(v);
                            setSelectedVehicle(v);
                            setShowVehiclePicker(false);
                          }}
                          className={`p-2.5 rounded-2xl border cursor-pointer transition-all ${
                            vehicle?._id === v._id
                              ? 'border-brand-primary bg-orange-50/50 shadow-xs ring-2 ring-brand-primary/20'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={v.images?.[0]}
                            alt={v.name}
                            className="w-full h-16 object-contain rounded-lg bg-gray-50 mb-1.5"
                          />
                          <p className="text-[11px] font-black text-[#151515] truncate">{v.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{v.brand}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION B: Customer Details & KYC Document Uploads */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-[#151515] uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-brand-primary" />
                  Customer Details & Verification
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Mobile Number (WhatsApp Enabled) *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-emerald-600 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="9876543210"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                      />
                    </div>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">
                      ✓ Instant confirmation link sent here via WhatsApp
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Email Address (For Tax Invoice)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  {/* Aadhaar Card Number */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Aadhaar Card Number
                    </label>
                    <input
                      type="text"
                      value={aadhaarNumber}
                      onChange={(e) => setAadhaarNumber(e.target.value)}
                      placeholder="XXXX-XXXX-XXXX"
                      maxLength={14}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs font-mono"
                    />
                  </div>
                </div>

                {/* Document Uploads: Aadhaar and Driving Licence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                  {/* Aadhaar Upload */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-gray-500 uppercase block">
                      Upload Aadhaar Card (Front/Back)
                    </label>
                    <label className="flex flex-col items-center justify-center p-3.5 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-white transition-all text-center">
                      <Upload className="w-4 h-4 text-gray-400 mb-1" />
                      <span className="text-[11px] font-bold text-[#151515]">
                        {aadhaarFile ? aadhaarFile.name : 'Select or Drop Aadhaar Image'}
                      </span>
                      <span className="text-[9px] text-gray-400">PNG, JPG, PDF up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleAadhaarUpload}
                        className="hidden"
                      />
                    </label>
                    {aadhaarBase64 && (
                      <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                        <Check className="w-3 h-3" />
                        <span>Aadhaar Document Attached</span>
                        <button
                          type="button"
                          onClick={() => {
                            setAadhaarFile(null);
                            setAadhaarBase64('');
                          }}
                          className="ml-auto text-gray-400 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Driving Licence (Only required if self_drive) */}
                  {rentalCategory === 'self_drive' ? (
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-gray-500 uppercase block">
                        Driving Licence Number & Document *
                      </label>
                      <input
                        type="text"
                        value={drivingLicense}
                        onChange={(e) => setDrivingLicense(e.target.value)}
                        required
                        placeholder="DL-XXXXXXXXXXXX"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs font-mono mb-2"
                      />

                      <label className="flex flex-col items-center justify-center p-2.5 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-white transition-all text-center">
                        <Upload className="w-4 h-4 text-gray-400 mb-0.5" />
                        <span className="text-[11px] font-bold text-[#151515]">
                          {licenseFile ? licenseFile.name : 'Upload Driving Licence'}
                        </span>
                        <input
                          type="file"
                          accept="image/*,application/pdf"
                          onChange={handleLicenseUpload}
                          className="hidden"
                        />
                      </label>
                      {licenseBase64 && (
                        <div className="flex items-center gap-2 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                          <Check className="w-3 h-3" />
                          <span>DL Document Attached</span>
                          <button
                            type="button"
                            onClick={() => {
                              setLicenseFile(null);
                              setLicenseBase64('');
                            }}
                            className="ml-auto text-gray-400 hover:text-red-500"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col justify-center p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-indigo-900">
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-black uppercase">No Driving Licence Required</span>
                      </div>
                      <p className="text-[11px] text-indigo-700">
                        Because a professional company driver is provided, you do not need to submit a driving licence.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* ==================== SECTION C: TRIP ITINERARY & AUTO-SHOWN CUSTOM DATES ==================== */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="text-xs font-black text-[#151515] uppercase tracking-wider flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      Trip Schedule & Custom Dates
                    </h3>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                      100% Flexible • Minimum rental duration: 4 Hours and above
                    </span>
                  </div>
                  <span className="text-[11px] font-black text-brand-primary self-start sm:self-auto">
                    Live Calculation
                  </span>
                </div>

                {/* Pickup & Drop Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Pickup Location *
                    </label>
                    <div className="relative">
                      <MapPin className="w-3.5 h-3.5 text-brand-primary absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        required
                        placeholder="e.g. Aerocity Terminal 3 Hub"
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Drop Location {rentalCategory === 'with_driver' ? '*' : '(Optional)'}
                    </label>
                    <div className="relative">
                      <Navigation className="w-3.5 h-3.5 text-indigo-600 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        value={dropLocation}
                        onChange={(e) => setDropLocation(e.target.value)}
                        required={rentalCategory === 'with_driver'}
                        placeholder={
                          rentalCategory === 'with_driver'
                            ? 'e.g. Connaught Place, New Delhi'
                            : 'Same as pickup hub'
                        }
                        className="w-full bg-gray-50/70 border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1 border-t border-gray-100">
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Pickup Date *
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      onChange={(e) => handlePickupDateChange(e.target.value)}
                      required
                      min={getTodayStr()}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Pickup Time *
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Return Date & Time (Custom Date Auto-Shown) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] font-bold text-gray-500 uppercase block">
                        Return / Drop Date *
                      </label>
                      <span className="text-[9px] text-brand-primary font-bold">Pick Any Date</span>
                    </div>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      required
                      min={pickupDate || getTodayStr()}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-gray-500 uppercase block mb-1">
                      Return / Drop Time *
                    </label>
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full bg-gray-50/70 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#151515] font-bold focus:outline-none focus:border-brand-primary focus:bg-white transition-all shadow-xs cursor-pointer"
                    >
                      <option value="08:00 AM">08:00 AM</option>
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:00 AM">11:00 AM</option>
                      <option value="12:00 PM">12:00 PM</option>
                      <option value="02:00 PM">02:00 PM</option>
                      <option value="04:00 PM">04:00 PM</option>
                      <option value="06:00 PM">06:00 PM</option>
                      <option value="08:00 PM">08:00 PM</option>
                      <option value="10:00 PM">10:00 PM</option>
                    </select>
                  </div>
                </div>

                {/* Quick Extend Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Quick extend:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickExtend('hours', 4)}
                    className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-primary text-[10px] font-bold text-gray-700 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    +4 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtend('days', 1)}
                    className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-primary text-[10px] font-bold text-gray-700 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    +1 Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtend('days', 2)}
                    className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-primary text-[10px] font-bold text-gray-700 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    +2 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtend('days', 3)}
                    className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-primary text-[10px] font-bold text-gray-700 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    +3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickExtend('days', 5)}
                    className="px-2.5 py-1 rounded-xl bg-gray-50 border border-gray-200 hover:border-brand-primary text-[10px] font-bold text-gray-700 hover:text-brand-primary transition-colors cursor-pointer"
                  >
                    +5 Days
                  </button>
                </div>

                {/* Minimum 4 Hours Warning */}
                {pricing.isUnderMin && (
                  <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>Minimum rental duration is 4 hours. Please select a later return time or date.</span>
                  </div>
                )}

                {/* Auto-Calculated Duration & Transparent Pricing Box */}
                <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Calculated Duration:
                      </span>
                      <strong className="text-sm font-black text-[#151515]">
                        {pricing.durationLabel}
                      </strong>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {rentalCategory === 'with_driver'
                        ? 'Includes verified chauffeur, fuel, and trip management'
                        : 'Pure self-drive freedom with 100% zero deposit'}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-auto">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Security Deposit</span>
                      <span className="text-xs font-bold text-emerald-700">₹0 (No Deposit)</span>
                    </div>
                    <div className="text-right pl-3 border-l border-orange-200">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block">Base Rental</span>
                      <span className="text-lg font-black text-brand-primary">{formatCurrency(pricing.baseAmount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION E: Payment Method Selection */}
              <div className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-xs space-y-4">
                <h3 className="text-xs font-black text-[#151515] uppercase tracking-wider flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-brand-primary" />
                  Select Payment Method
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod('Pay at Pickup')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center select-none ${
                      paymentMethod === 'Pay at Pickup'
                        ? 'border-brand-primary bg-orange-50/50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1.5 text-brand-primary" />
                    <span className="text-xs font-bold text-[#151515] block">Pay at Pickup</span>
                    <span className="text-[10px] text-gray-500">Pay when vehicle arrives</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Razorpay')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center select-none ${
                      paymentMethod === 'Razorpay'
                        ? 'border-brand-primary bg-orange-50/50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1.5 text-indigo-600" />
                    <span className="text-xs font-bold text-[#151515] block">UPI / Card / NetBanking</span>
                    <span className="text-[10px] text-gray-500">Razorpay 100% Secured</span>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('Cash')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all text-center select-none ${
                      paymentMethod === 'Cash'
                        ? 'border-brand-primary bg-orange-50/50 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1.5 text-emerald-600" />
                    <span className="text-xs font-bold text-[#151515] block">Cash on Delivery</span>
                    <span className="text-[10px] text-gray-500">Pay direct cash</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={submitting || pricing.isUnderMin}
                className={`w-full py-4 px-6 rounded-2xl font-black text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  pricing.isUnderMin
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                    : 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-orange-500/25'
                }`}
              >
                <span>
                  {submitting
                    ? 'Creating Reservation...'
                    : pricing.isUnderMin
                    ? 'Minimum 4 Hours Duration Required'
                    : `Confirm Booking • Pay ${formatCurrency(pricing.finalAmount)}`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Cost Summary & Highlights Sidebar Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Transparency Card */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#151515]">
                  Fare Summary & Guarantee
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  Zero Deposit Policy
                </span>
              </div>

              {/* Selected Vehicle Thumbnail */}
              {vehicle && (
                <div className="flex items-center gap-3.5 pb-4 border-b border-gray-100">
                  <img
                    src={vehicle.images?.[0]}
                    alt=""
                    className="w-20 h-14 object-contain rounded-xl bg-gray-50 p-1 border border-gray-200"
                  />
                  <div>
                    <span className="text-[10px] font-bold text-brand-primary uppercase">
                      {rentalCategory === 'with_driver' ? 'Chauffeur Driven' : 'Self Drive'}
                    </span>
                    <h4 className="text-sm font-black text-[#151515]">{vehicle.name}</h4>
                    <p className="text-[11px] text-gray-500">
                      {pricing.durationLabel} • {pickupLocation}
                    </p>
                  </div>
                </div>
              )}

              {/* Line Items */}
              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Base Rental ({pricing.durationLabel})</span>
                  <span className="font-bold text-[#151515]">{formatCurrency(pricing.baseAmount)}</span>
                </div>

                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Dates:</span>
                  <span className="font-medium text-[#151515]">
                    {pickupDate} to {returnDate}
                  </span>
                </div>

                {/* NO DEPOSIT HIGHLIGHT */}
                <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <div>
                    <span className="font-bold text-emerald-800 block text-xs">
                      Security Deposit:
                    </span>
                    <span className="text-[10px] text-emerald-600">
                      100% Zero Security Deposit Required
                    </span>
                  </div>
                  <span className="text-sm font-black text-emerald-700">₹0</span>
                </div>

                <div className="flex justify-between text-gray-500 text-[11px]">
                  <span>Hidden Fees & Charges</span>
                  <span className="font-bold text-emerald-600">₹0 (None)</span>
                </div>

                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount Coupon ({appliedCoupon?.code})</span>
                    <span>-{formatCurrency(pricing.discountAmount)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-black text-[#151515] block">Final Rental Price</span>
                    <span className="text-[10px] text-gray-400">All inclusive • Transparent</span>
                  </div>
                  <span className="text-2xl font-black text-brand-primary">
                    {formatCurrency(pricing.finalAmount)}
                  </span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-gray-100 flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon code (e.g. NODEPOSIT)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#151515] transition-colors cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </form>
              {couponError && <p className="text-[11px] text-red-500 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>}
            </div>

            {/* Why RideVista Guarantee Box */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-3.5">
              <h4 className="text-xs font-black uppercase tracking-wider text-gray-500">
                Customer Assurance
              </h4>
              <div className="space-y-2.5 text-xs text-gray-600">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Minimum 4 Hours:</strong> Flexible short trips to multi-week rentals.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>100% No Deposit:</strong> Keep your money in your pocket.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>Instant WhatsApp Confirmation:</strong> Booking receipt sent immediately.</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span><strong>24/7 Roadside Assistance:</strong> On-call support for your trip.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCheckout;
