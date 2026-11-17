import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vehicleService } from '../services/vehicleService';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/formatters';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Users,
  Fuel,
  Gauge,
  Wind,
  ShieldCheck,
  Check,
  ArrowRight,
  Radio,
  Navigation,
  Key,
  Flame,
  ChevronDown,
  User,
  Car,
  Clock,
  Sparkles,
  Calendar,
  AlertCircle,
  UserPlus,
  Lock,
} from 'lucide-react';

const TIME_OPTIONS = [
  '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM', '10:00 PM', '11:00 PM',
  '12:00 AM', '01:00 AM', '02:00 AM', '03:00 AM', '04:00 AM', '05:00 AM'
];

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { setSelectedVehicle } = useBooking();

  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch vehicle details on mount or ID change
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const response = await vehicleService.getVehicleById(id);
        if (response.success && response.vehicle) {
          setVehicle(response.vehicle);
          setSimilarVehicles(response.similarVehicles || []);
          setActiveImageIndex(0);
        }
      } catch (err) {
        console.error('Failed to load vehicle details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
    window.scrollTo(0, 0);
  }, [id]);

  // Rental Category & Auto-Shown Custom Date State
  const [rentalCategory, setRentalCategory] = useState('self_drive'); // 'self_drive' | 'with_driver'

  const formatLocalDate = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getTodayStr = () => formatLocalDate(new Date());
  const getTomorrowStr = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return formatLocalDate(d);
  };

  const [pickupDate, setPickupDate] = useState(getTodayStr());
  const [pickupTime, setPickupTime] = useState('10:00 AM');
  const [returnDate, setReturnDate] = useState(getTomorrowStr());
  const [returnTime, setReturnTime] = useState('10:00 AM');
  const [dateError, setDateError] = useState('');

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

  // Live calculation of duration and price from custom dates based on vehicle daily rate
  const computeTripDetails = () => {
    const dayRate = Number(vehicle?.pricePerDay) || 1800;
    const fourHourRate = vehicle?.pricePerHour > 0 ? vehicle.pricePerHour * 4 : Math.round(dayRate * 0.45);
    const eightHourRate = vehicle?.pricePerHour > 0 ? vehicle.pricePerHour * 8 : Math.round(dayRate * 0.70);

    const pDt = parseDateTime(pickupDate, pickupTime);
    const rDt = parseDateTime(returnDate, returnTime);
    const diffMs = rDt.getTime() - pDt.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    let price = dayRate;
    let durationLabel = '1 Day (24 Hours)';
    let isUnderMin = false;

    if (diffHours < 3.99) {
      isUnderMin = true;
      price = fourHourRate;
      durationLabel = `${Math.max(1, Math.round(diffHours))}h (Below 4h min)`;
    } else if (diffHours <= 4) {
      price = fourHourRate;
      durationLabel = '4 Hours (Minimum)';
    } else if (diffHours <= 8) {
      price = eightHourRate;
      durationLabel = '8 Hours';
    } else if (diffHours <= 24) {
      price = dayRate;
      durationLabel = '1 Day (24 Hours)';
    } else {
      const days = Math.ceil(diffHours / 24);
      price = days * dayRate;
      durationLabel = `${days} Days (${Math.round(diffHours)}h)`;
    }

    return { diffHours, isUnderMin, price, durationLabel };
  };

  const tripDetails = computeTripDetails();

  // Quick chips handler (+4h, +8h, +1 Day, +2 Days, +5 Days)
  const handleQuickAdd = (type, val) => {
    const pDt = parseDateTime(pickupDate, pickupTime);
    if (type === 'hours') {
      const newRDt = new Date(pDt.getTime() + val * 60 * 60 * 1000);
      setReturnDate(formatLocalDate(newRDt));
      const rh = newRDt.getHours();
      const rm = newRDt.getMinutes().toString().padStart(2, '0');
      const rmer = rh >= 12 ? 'PM' : 'AM';
      const disph = rh % 12 === 0 ? 12 : rh % 12;
      setReturnTime(`${disph.toString().padStart(2, '0')}:${rm} ${rmer}`);
      setDateError('');
    } else if (type === 'days') {
      const newRDt = new Date(pDt.getTime() + val * 24 * 60 * 60 * 1000);
      setReturnDate(formatLocalDate(newRDt));
      setReturnTime(pickupTime);
      setDateError('');
    }
  };

  const handlePickupDateChange = (val) => {
    setPickupDate(val);
    const pDt = parseDateTime(val, pickupTime);
    const rDt = parseDateTime(returnDate, returnTime);
    if (pDt.getTime() >= rDt.getTime()) {
      const nextDay = new Date(pDt.getTime() + 24 * 60 * 60 * 1000);
      setReturnDate(formatLocalDate(nextDay));
      setReturnTime(pickupTime);
    }
  };

  const handleBookNow = () => {
    if (tripDetails.isUnderMin) {
      alert('Minimum rental duration is 4 hours. Please choose a return time at least 4 hours after pickup.');
      return;
    }
    setSelectedVehicle(vehicle);

    const checkoutUrl = `/booking/checkout?vehicleId=${vehicle._id}&category=${rentalCategory}&pickupDate=${pickupDate}&pickupTime=${encodeURIComponent(
      pickupTime
    )}&returnDate=${returnDate}&returnTime=${encodeURIComponent(returnTime)}`;

    // Before booking, user must register or login
    if (!isAuthenticated) {
      navigate('/register', {
        state: {
          from: checkoutUrl,
          message: 'Please create an account or sign in before completing your booking.',
        },
      });
      return;
    }

    navigate(checkoutUrl);
  };

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
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <Link
          to="/vehicles"
          className="inline-block px-6 py-3 rounded-xl bg-brand-primary text-white font-bold text-sm"
        >
          Return to Vehicle Catalog
        </Link>
      </div>
    );
  }

  const isCar = vehicle?.vehicleType === 'car';

  // Spec items for the 3x2 grid
  const techSpecs = [
    { label: 'Gear Box', value: vehicle?.transmission || 'Automatic', icon: Gauge },
    { label: 'Fuel', value: vehicle?.fuelType || 'Petrol', icon: Fuel },
    { label: 'Doors', value: isCar ? '4 Doors' : 'N/A', icon: Key },
    { label: 'Air Conditioner', value: vehicle?.ac ? 'Yes' : 'No', icon: Wind },
    { label: 'Seats', value: `${vehicle?.seatingCapacity || (isCar ? '5' : '2')} Seats`, icon: Users },
    { label: 'Mileage', value: vehicle?.mileage || '16.9 km/l', icon: Flame },
  ];

  const equipmentList = [
    'Air conditioning',
    'Bluetooth connectivity',
    'GPS Navigation',
    'Anti-lock brakes (ABS)',
    'Dual Airbags',
    'Comfortable leather seats',
    'Power Windows',
    'FM & USB Audio',
  ];

  return (
    <div className="bg-white min-h-screen text-[#151515] pb-12 w-full">
      {/* ==================== FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-6 sm:py-7 mb-6 rounded-none">
        <div className="container-fluid flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
              {vehicle.brand || 'Luxury Fleet'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading mt-0.5">
              {vehicle.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {/* Two-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start mb-8">
          {/* Left Column: Big Vehicle Photo & Gallery Thumbnails */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="w-full h-72 sm:h-96 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] p-6 flex items-center justify-center overflow-hidden relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  src={vehicle.images?.[activeImageIndex] || vehicle.images?.[0]}
                  alt={vehicle.name}
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-contain"
                />
              </AnimatePresence>
            </div>

            {/* Thumbnail Row */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {vehicle.images.map((imgUrl, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`h-20 sm:h-24 rounded-xl bg-[#F8F8FA] border p-2 flex items-center justify-center overflow-hidden transition-all ${
                      activeImageIndex === idx
                        ? 'border-brand-primary shadow-md ring-2 ring-brand-primary/20'
                        : 'border-[#EAEAEA] hover:border-gray-400 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={imgUrl}
                      alt={`Thumbnail ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </motion.button>
                ))}
              </div>
            )}

            {/* Description Blurb */}
            {vehicle.description && (
              <div className="pt-2 text-xs sm:text-sm text-[#777777] leading-relaxed">
                <p>{vehicle.description}</p>
              </div>
            )}

            {/* Technical Specification Grid (Moved to Left Side) */}
            <div className="pt-4 border-t border-[#EAEAEA]">
              <h3 className="text-sm font-bold text-[#151515] uppercase tracking-wider mb-4 flex items-center gap-2">
                <Gauge className="w-4 h-4 text-brand-primary" />
                Technical Specification
              </h3>

              {/* 3x2 Grid of Spec Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
                {techSpecs.map((spec, idx) => {
                  const Icon = spec.icon;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -4, boxShadow: '0 8px 16px rgba(0,0,0,0.06)' }}
                      transition={{ type: 'spring', stiffness: 350 }}
                      className="p-3.5 rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] text-center flex flex-col items-center justify-center transition-colors hover:border-brand-primary/40 cursor-default"
                    >
                      <Icon className="w-4 h-4 text-brand-primary mb-1.5" />
                      <span className="text-[10px] text-[#777777] font-medium block">
                        {spec.label}
                      </span>
                      <strong className="text-xs font-bold text-[#151515] mt-0.5 truncate max-w-full">
                        {spec.value}
                      </strong>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Rental Options, Rent Now Button & Car Equipment */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 space-y-6"
          >
            {/* ==================== RENTAL MODE & AUTO-SHOWN CUSTOM DATE SELECTION CARD ==================== */}
            <div className="p-5 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-[#151515] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-primary" />
                  Select Rental Option & Dates
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  ₹0 Deposit
                </span>
              </div>

              {/* Category Dropdown / Switcher Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRentalCategory('self_drive')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left cursor-pointer ${
                    rentalCategory === 'self_drive'
                      ? 'border-brand-primary bg-white shadow-xs text-brand-primary'
                      : 'border-gray-200 bg-white/70 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <Key className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">Self Drive</span>
                    <span className="text-[9px] text-gray-500 font-medium">
                      {formatCurrency(vehicle?.pricePerDay || 1800)}/day • Min 4h
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setRentalCategory('with_driver')}
                  className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 text-left cursor-pointer ${
                    rentalCategory === 'with_driver'
                      ? 'border-indigo-600 bg-white shadow-xs text-indigo-700'
                      : 'border-gray-200 bg-white/70 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <User className="w-4 h-4 shrink-0" />
                  <div>
                    <span className="text-xs font-bold block leading-tight">With Driver</span>
                    <span className="text-[9px] text-gray-500 font-medium">
                      {formatCurrency(vehicle?.pricePerDay || 1800)}/day • Min 4h
                    </span>
                  </div>
                </button>
              </div>

              {/* AUTO-SHOWN CUSTOM DATES & TIME */}
              <div className="pt-2 border-t border-gray-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                    Custom Rental Dates:
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Min 4 Hours
                  </span>
                </div>

                {/* Pickup Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Pickup Date
                    </label>
                    <input
                      type="date"
                      value={pickupDate}
                      min={getTodayStr()}
                      onChange={(e) => handlePickupDateChange(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Pickup Time
                    </label>
                    <select
                      value={pickupTime}
                      onChange={(e) => setPickupTime(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      {!TIME_OPTIONS.includes(pickupTime) && (
                        <option value={pickupTime}>{pickupTime}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Return Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      min={pickupDate || getTodayStr()}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                      Return Time
                    </label>
                    <select
                      value={returnTime}
                      onChange={(e) => setReturnTime(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer"
                    >
                      {TIME_OPTIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                      {!TIME_OPTIONS.includes(returnTime) && (
                        <option value={returnTime}>{returnTime}</option>
                      )}
                    </select>
                  </div>
                </div>

                {/* Quick Add Helper Chips */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-gray-400 font-semibold mr-1">Quick extend:</span>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd('hours', 4)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                      tripDetails.diffHours >= 3.99 && tripDetails.diffHours <= 4.01
                        ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    +4 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd('hours', 8)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                      tripDetails.diffHours >= 7.99 && tripDetails.diffHours <= 8.01
                        ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    +8 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd('days', 1)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                      tripDetails.diffHours >= 23.99 && tripDetails.diffHours <= 24.01
                        ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    +1 Day
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd('days', 2)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                      tripDetails.diffHours >= 47.99 && tripDetails.diffHours <= 48.01
                        ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    +2 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickAdd('days', 5)}
                    className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition-colors cursor-pointer ${
                      tripDetails.diffHours >= 119.99 && tripDetails.diffHours <= 120.01
                        ? 'bg-brand-primary text-white border-brand-primary shadow-2xs'
                        : 'bg-white border-gray-200 hover:border-brand-primary text-gray-700 hover:text-brand-primary'
                    }`}
                  >
                    +5 Days
                  </button>
                </div>

                {/* Minimum 4 Hours Warning */}
                {tripDetails.isUnderMin && (
                  <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
                    <span>Minimum rental duration is 4 hours. Please select a later return time.</span>
                  </div>
                )}

                {/* Live Auto-Calculated Duration & Total Price */}
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Duration</span>
                    <strong className="text-xs font-extrabold text-[#151515]">
                      {tripDetails.durationLabel}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-gray-500 block">Total Rental Price</span>
                    <strong className="text-lg font-black text-brand-primary">
                      {formatCurrency(tripDetails.price)}
                    </strong>
                  </div>
                </div>
              </div>

              {/* No Deposit & Transparent Summary */}
              <div className="pt-2 border-t border-gray-200/80 flex items-center justify-between text-xs">
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  100% No Security Deposit (₹0)
                </span>
                <span className="text-[11px] text-gray-400 font-medium">Taxes included</span>
              </div>
            </div>

            {/* Auth Required Notice for Unauthenticated Users */}
            {!isAuthenticated && (
              <div className="pt-1">
                <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-amber-950 shadow-xs">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <UserPlus className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-tight text-amber-950">
                        Registration / Login Required
                      </p>
                      <p className="text-[11px] text-amber-800 font-medium mt-0.5 leading-snug">
                        You must register or log in before booking. Your vehicle selection and rental dates will be saved.
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs">
                        <Link
                          to="/register"
                          state={{
                            from: `/booking/checkout?vehicleId=${vehicle._id}&category=${rentalCategory}&pickupDate=${pickupDate}&pickupTime=${encodeURIComponent(
                              pickupTime
                            )}&returnDate=${returnDate}&returnTime=${encodeURIComponent(returnTime)}`,
                            message: 'Please create an account to proceed with your booking.',
                          }}
                          className="font-bold text-brand-primary hover:underline flex items-center gap-1"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Sign Up</span>
                        </Link>
                        <span className="text-amber-300">|</span>
                        <Link
                          to="/login"
                          state={{
                            from: `/booking/checkout?vehicleId=${vehicle._id}&category=${rentalCategory}&pickupDate=${pickupDate}&pickupTime=${encodeURIComponent(
                              pickupTime
                            )}&returnDate=${returnDate}&returnTime=${encodeURIComponent(returnTime)}`,
                            message: 'Please sign in to proceed with your booking.',
                          }}
                          className="font-semibold text-gray-700 hover:text-brand-primary"
                        >
                          Sign In
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rent Now Action Button */}
            <div className="pt-1">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBookNow}
                disabled={tripDetails.isUnderMin}
                className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer ${
                  tripDetails.isUnderMin
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-brand-primary hover:bg-brand-primaryHover text-white'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {!isAuthenticated ? (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Sign Up to Book ({formatCurrency(tripDetails.price)})</span>
                    </>
                  ) : (
                    <span>Rent now ({formatCurrency(tripDetails.price)})</span>
                  )}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {!tripDetails.isUnderMin && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                )}
              </motion.button>
            </div>

            {/* Car Equipment Section */}
            <div className="pt-4 border-t border-[#EAEAEA]">
              <h3 className="text-sm font-bold text-[#151515] uppercase tracking-wider mb-4">
                Car Equipment
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {equipmentList.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-2 text-xs text-[#777777]"
                  >
                    <Check className="w-3.5 h-3.5 text-brand-primary shrink-0 stroke-[2.5]" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Similar Vehicles Carousel / Grid */}
        {similarVehicles.length > 0 && (
          <div className="pt-8 border-t border-[#EAEAEA] mt-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                  Explore More
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#151515] mt-0.5">
                  Similar Vehicles in Fleet
                </h3>
              </div>
              <Link
                to="/vehicles"
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-1"
              >
                <span>View All Fleet</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarVehicles.map((simVehicle) => (
                <VehicleCard key={simVehicle._id} vehicle={simVehicle} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleDetails;
