import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Car,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  HeartHandshake,
  BadgePercent,
  CheckCircle2,
  ArrowRight,
  Search,
  Volume2,
  VolumeX,
  Sparkles,
} from 'lucide-react';

const HOME_CATEGORIES = [
  'All Vehicles',
  'SUV',
  'Sedan',
  'Hatchback',
  'Bikes',
  'Scooties',
];

const Home = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Vehicles');
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = React.useRef(null);
  const navigate = useNavigate();

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    carType: 'All Types',
    pickupLocation: 'Airport Terminal 1 & 3',
    dropoffLocation: 'Airport Terminal 1 & 3',
    pickupDate: new Date().toISOString().split('T')[0],
    pickupTime: '10:00',
    returnDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    returnTime: '10:00',
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await vehicleService.getAllVehicles({ limit: 60 });
        if (res.success && res.vehicles?.length > 0) {
          setVehicles(res.vehicles);
        } else {
          const featuredRes = await vehicleService.getFeaturedVehicles();
          if (featuredRes.success) {
            setVehicles([...(featuredRes.cars || []), ...(featuredRes.scooties || [])].slice(0, 60));
          }
        }
      } catch (err) {
        console.error('Failed to load vehicles for home:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  const handleFormChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleFindCar = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      type: bookingForm.carType !== 'All Types' ? bookingForm.carType : '',
      pickup: bookingForm.pickupLocation,
      dropoff: bookingForm.dropoffLocation,
      from: bookingForm.pickupDate,
      to: bookingForm.returnDate,
    }).toString();
    navigate(`/vehicles?${query}`);
  };

  // Filter vehicles on Home by category tab
  const displayedVehicles = vehicles.filter((v) => {
    if (activeCategory === 'All Vehicles') return true;
    if (activeCategory === 'Scooties') return v.vehicleType === 'scooty' || v.category === 'Scooties';
    if (activeCategory === 'Bikes') return v.vehicleType === 'bike' || v.category === 'Bikes';
    if (activeCategory === 'Electric') return v.fuelType === 'Electric';
    return (
      v.category?.toLowerCase() === activeCategory.toLowerCase() ||
      v.vehicleType?.toLowerCase() === activeCategory.toLowerCase() ||
      v.model?.toLowerCase().includes(activeCategory.toLowerCase())
    );
  });

  return (
    <div className="bg-white text-[#151515] overflow-hidden w-full">
      {/* ========================================================
          1. HERO SECTION (Full-Width Edge-to-Edge with Background Video)
          ======================================================== */}
      <section className="relative w-full bg-[#1a0847] text-white overflow-hidden shadow-xl rounded-none">
        {/* Background Video Player */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
            className="w-full h-full object-cover object-center scale-105 transition-all duration-700"
          >
            <source src="/videos/hero-car.mp4" type="video/mp4" />
            <source src="https://res.cloudinary.com/demo/video/upload/blue_sports_car.mp4" type="video/mp4" />
          </video>
          {/* Rich Gradient Overlays for High Contrast and Brand Styling */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/70 to-black/80" />
          <div className="absolute inset-0 opacity-70 theme-hero-gradient mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/25 backdrop-blur-[0.5px]" />
        </div>

        {/* Subtle Background Glow Circles & Overlay */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-brand-primary/30 rounded-full blur-2xl pointer-events-none" />

        {/* Video Audio Control Pill */}
        <button
          type="button"
          onClick={() => setIsMuted(!isMuted)}
          className="absolute bottom-4 left-4 sm:left-8 lg:left-12 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md border border-white/20 text-white text-xs font-medium transition-all shadow-lg"
          title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-gray-300" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span className="text-[11px] font-semibold">{isMuted ? 'Muted' : 'Sound On'}</span>
        </button>

        {/* Inner Content Grid with Responsive Container Spacing */}
        <div className="container-fluid py-12 sm:py-16 lg:py-20 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* AI Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-xs font-semibold shadow-sm w-fit">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI-Powered Smart Fleet • Instant Booking</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.12] text-white font-heading">
                Experience the road like never before
              </h1>

              <p className="text-white/90 text-sm sm:text-base lg:text-lg max-w-2xl leading-relaxed font-normal">
                Discover your perfect ride and enjoy every journey with comfort, flexibility, and convenience. Premium cars and scooties tailored for every destination.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5 pt-2">
                <Link
                  to="/vehicles"
                  className="px-6 py-3.5 rounded-xl bg-white text-brand-primary hover:bg-gray-100 font-bold text-sm tracking-wide shadow-md transition-all hover:scale-105"
                >
                  Explore Vehicles
                </Link>
                <a
                  href="#booking-form"
                  className="px-6 py-3.5 rounded-xl border border-white/40 text-white hover:bg-white/10 font-semibold text-sm tracking-wide transition-all"
                >
                  Book Your Car
                </a>
              </div>

              {/* Feature Highlights Pills over the video */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span className="font-semibold">Comprehensive Insurance</span>
                </div>
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span className="font-semibold">Instant Digital Keys 24/7</span>
                </div>
              </div>
            </div>

            {/* Right: White Booking Form Card */}
            <div id="booking-form" className="lg:col-span-5 flex justify-end">
              <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-[#151515] shadow-2xl border border-white/30 w-full max-w-lg">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#151515] mb-5 tracking-tight">
                  Book your car
                </h3>

                <form onSubmit={handleFindCar} className="space-y-3.5 text-xs">
                  {/* Car Type Dropdown */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Car type
                    </label>
                    <div className="relative">
                      <select
                        name="carType"
                        value={bookingForm.carType}
                        onChange={handleFormChange}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      >
                        <option value="All Types">All Types</option>
                        <option value="Luxury">Luxury</option>
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Scooty">Scooty / Two-Wheeler</option>
                        <option value="Electric">Electric (EV)</option>
                      </select>
                    </div>
                  </div>

                  {/* Pickup Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Pick-up location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-brand-primary absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="pickupLocation"
                        value={bookingForm.pickupLocation}
                        onChange={handleFormChange}
                        placeholder="Enter City or Airport"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Drop-off Location */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                      Drop-off location
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-brand-primary absolute left-3 top-3 pointer-events-none" />
                      <input
                        type="text"
                        name="dropoffLocation"
                        value={bookingForm.dropoffLocation}
                        onChange={handleFormChange}
                        placeholder="Enter City or Airport"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  {/* Pickup Date & Time */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Pick-up date
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary absolute left-2.5 top-3 pointer-events-none" />
                        <input
                          type="date"
                          name="pickupDate"
                          value={bookingForm.pickupDate}
                          onChange={handleFormChange}
                          className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Pick-up time
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-brand-primary absolute left-2.5 top-3 pointer-events-none" />
                        <input
                          type="time"
                          name="pickupTime"
                          value={bookingForm.pickupTime}
                          onChange={handleFormChange}
                          className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Return Date & Time */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Return date
                      </label>
                      <div className="relative">
                        <Calendar className="w-3.5 h-3.5 text-brand-primary absolute left-2.5 top-3 pointer-events-none" />
                        <input
                          type="date"
                          name="returnDate"
                          value={bookingForm.returnDate}
                          onChange={handleFormChange}
                          className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
                        Return time
                      </label>
                      <div className="relative">
                        <Clock className="w-3.5 h-3.5 text-brand-primary absolute left-2.5 top-3 pointer-events-none" />
                        <input
                          type="time"
                          name="returnTime"
                          value={bookingForm.returnTime}
                          onChange={handleFormChange}
                          className="w-full pl-8 pr-2 py-2 rounded-xl border border-[#EAEAEA] bg-[#F8F8FA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm tracking-wide shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Search className="w-4 h-4" />
                      <span>Find your car</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. FEATURES SECTION (Screenshot 1: 3 Clean Feature Cards)
          ======================================================== */}
      <section className="container-fluid py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {/* Feature 1: Availability */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] hover:border-brand-primary/40 transition-all hover:shadow-md">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-primaryLight text-brand-primary flex items-center justify-center mb-3">
              <Car className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#151515] mb-1.5 font-heading">Availability</h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-sm">
              Wide selection of vehicles ready for immediate pickup across airport hubs and city stations.
            </p>
          </div>

          {/* Feature 2: Comfort */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] hover:border-brand-primary/40 transition-all hover:shadow-md">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-primaryLight text-brand-primary flex items-center justify-center mb-3">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#151515] mb-1.5 font-heading">Comfort</h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-sm">
              Pristine sanitization, executive seats, climate control, and smooth automatic transmissions.
            </p>
          </div>

          {/* Feature 3: Savings */}
          <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] hover:border-brand-primary/40 transition-all hover:shadow-md">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-brand-primaryLight text-brand-primary flex items-center justify-center mb-3">
              <BadgePercent className="w-7 h-7 sm:w-8 sm:h-8" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#151515] mb-1.5 font-heading">Savings</h3>
            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-sm">
              Transparent daily pricing, zero hidden fees, flexible packages, and complimentary insurance.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. ABOUT PREVIEW SECTION (Screenshot 1: 2-Column About)
          ======================================================== */}
      <section className="container-fluid pt-4 pb-6 sm:pt-6 sm:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left: Large Rounded Image */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/10] bg-gray-100">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1400&auto=format&fit=crop"
                alt="About Car Rental"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </div>

          {/* Right: Content with Checklist */}
          <div className="lg:col-span-6 space-y-5">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-brand-primary bg-brand-primaryLight px-3.5 py-1 rounded-full">
              About company
            </span>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#151515] leading-snug font-heading">
              Feel the best experience with our luxury car rental
            </h2>

            <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
              We provide you with the most comfortable and reliable self-drive and chauffeur vehicles. Whether you're heading for a weekend getaway, business conference, or city commute, our seamless digital bookings make it effortless.
            </p>

            {/* 4 Feature Items */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#151515]">Best of service</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#151515]">Convenient booking</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#151515]">Affordable pricing</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-[#151515]">Comfortable vehicles</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about-us"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-bold tracking-wide transition-all shadow-md"
              >
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. CHOOSE YOUR VEHICLE WITH TIGHT TABS SPACING
          ======================================================== */}
      <section className="container-fluid pt-2 pb-6 sm:pt-4 sm:pb-8">
        {/* Heading & View All */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-2 sm:mb-3">
          <div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading">
              Choose the car that suits you
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-0.5 font-medium">
              Explore our hand-picked collection of premium cars and scooties
            </p>
          </div>

          <Link
            to="/vehicles"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand-primary hover:text-brand-primaryHover transition-colors self-start sm:self-auto"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Category Tabs: Tight gap to the vehicle grid */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          {HOME_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-sm'
                    : 'bg-[#F8F8FA] text-[#777777] hover:bg-gray-200 hover:text-[#151515]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Vehicle Grid */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : displayedVehicles.length === 0 ? (
          <div className="text-center py-12 bg-[#F8F8FA] rounded-2xl border border-[#EAEAEA]">
            <p className="text-xs sm:text-sm text-gray-500 font-semibold mb-2">
              No vehicles available in this category currently.
            </p>
            <button
              onClick={() => setActiveCategory('All Vehicles')}
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              View all vehicles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedVehicles.slice(0, 9).map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </section>


      {/* ========================================================
          6. PROMOTIONAL BANNER (Full-Width Edge-to-Edge)
          ======================================================== */}
      <section className="w-full bg-brand-primary text-white py-12 lg:py-16 relative overflow-hidden shadow-xl rounded-none">
        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white font-heading">
                Enjoy every mile with adorable companionship.
              </h2>
              <p className="text-white/85 text-xs sm:text-base max-w-xl">
                Discover uncompromised road trips, verified safety inspections, and seamless 24/7 customer support.
              </p>

              {/* Input + Search Button */}
              <form onSubmit={handleFindCar} className="flex max-w-md items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Enter your destination or car name..."
                  className="w-full px-4 py-3 rounded-xl bg-white text-[#151515] text-xs font-medium focus:outline-none placeholder-gray-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-brand-primary font-bold text-xs shrink-0 transition-all shadow-md hover:shadow-lg"
                >
                  Search
                </button>
              </form>
            </div>

            <div className="md:col-span-4 flex justify-end">
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop"
                alt="Car Promotion"
                className="w-full max-w-sm object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
