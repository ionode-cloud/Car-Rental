import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import {
  MapPin,
  Calendar,
  Clock,
  Car,
  Search,
  Bike,
  Sparkles,
} from 'lucide-react';

const locations = [
  'Aerocity Hub',
  'Connaught Place Hub',
  'Cyber City Hub',
  'Railway Station Hub',
  'Metro Station Hub',
  'Downtown Hub',
];

const timeSlots = [
  '08:00 AM',
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '04:00 PM',
  '06:00 PM',
  '08:00 PM',
  '10:00 PM',
];

const SearchBar = ({ initialType = 'all', compact = false }) => {
  const { searchFilters, updateSearchFilters } = useBooking();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    pickupLocation: searchFilters.pickupLocation || locations[0],
    returnLocation: searchFilters.returnLocation || locations[0],
    pickupDate: searchFilters.pickupDate,
    pickupTime: searchFilters.pickupTime || '10:00 AM',
    returnDate: searchFilters.returnDate,
    returnTime: searchFilters.returnTime || '10:00 AM',
    vehicleType: initialType !== 'all' ? initialType : searchFilters.vehicleType || 'all',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTypeSelect = (type) => {
    setFormData((prev) => ({ ...prev, vehicleType: type }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateSearchFilters(formData);

    if (formData.vehicleType === 'scooty') {
      navigate('/scooty-rental');
    } else if (formData.vehicleType === 'car') {
      navigate('/car-rental');
    } else {
      navigate('/car-rental');
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full glass-panel rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/15">
      {/* Type Switcher Tabs */}
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
        <button
          type="button"
          onClick={() => handleTypeSelect('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            formData.vehicleType === 'all'
              ? 'bg-brand-primary text-white shadow-primary-glow'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          All Fleet
        </button>

        <button
          type="button"
          onClick={() => handleTypeSelect('car')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            formData.vehicleType === 'car'
              ? 'bg-brand-primary text-white shadow-primary-glow'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Car className="w-4 h-4" />
          Cars
        </button>

        <button
          type="button"
          onClick={() => handleTypeSelect('scooty')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            formData.vehicleType === 'scooty'
              ? 'bg-brand-primary text-white shadow-primary-glow'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Bike className="w-4 h-4" />
          Scooties
        </button>
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Pickup Location */}
        <div className="bg-brand-dark/80 border border-white/10 rounded-2xl p-3 focus-within:border-brand-primary/60 transition-colors">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            Pickup Location
          </label>
          <select
            name="pickupLocation"
            value={formData.pickupLocation}
            onChange={handleChange}
            className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-brand-dark text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Pickup Date & Time */}
        <div className="bg-brand-dark/80 border border-white/10 rounded-2xl p-3 focus-within:border-brand-primary/60 transition-colors">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            Pickup Date & Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="pickupDate"
              min={todayStr}
              value={formData.pickupDate}
              onChange={handleChange}
              className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none"
              required
            />
            <select
              name="pickupTime"
              value={formData.pickupTime}
              onChange={handleChange}
              className="bg-transparent text-xs text-gray-300 font-semibold focus:outline-none cursor-pointer"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t} className="bg-brand-dark text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Return Date & Time */}
        <div className="bg-brand-dark/80 border border-white/10 rounded-2xl p-3 focus-within:border-brand-primary/60 transition-colors">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            Return Date & Time
          </label>
          <div className="flex items-center gap-2">
            <input
              type="date"
              name="returnDate"
              min={formData.pickupDate || todayStr}
              value={formData.returnDate}
              onChange={handleChange}
              className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none"
              required
            />
            <select
              name="returnTime"
              value={formData.returnTime}
              onChange={handleChange}
              className="bg-transparent text-xs text-gray-300 font-semibold focus:outline-none cursor-pointer"
            >
              {timeSlots.map((t) => (
                <option key={t} value={t} className="bg-brand-dark text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Return Location / Dropoff */}
        <div className="bg-brand-dark/80 border border-white/10 rounded-2xl p-3 focus-within:border-brand-primary/60 transition-colors">
          <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-brand-primary" />
            Dropoff Location
          </label>
          <select
            name="returnLocation"
            value={formData.returnLocation}
            onChange={handleChange}
            className="w-full bg-transparent text-white text-sm font-semibold focus:outline-none cursor-pointer"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="bg-brand-dark text-white">
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Find Ride Submit Button */}
        <div className="flex items-center">
          <button
            type="submit"
            className="orange-gradient-btn w-full h-[58px] rounded-2xl text-white font-bold text-base tracking-wide flex items-center justify-center gap-2 shadow-lg hover:scale-[1.02] transition-transform"
          >
            <Search className="w-5 h-5" />
            <span>Find Your Ride</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
