import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
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
} from 'lucide-react';

const VehicleDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setSelectedVehicle } = useBooking();

  const [vehicle, setVehicle] = useState(null);
  const [similarVehicles, setSimilarVehicles] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

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

  const isCar = vehicle.vehicleType === 'car';

  const handleBookNow = () => {
    setSelectedVehicle(vehicle);
    navigate(`/booking/checkout?vehicleId=${vehicle._id}`);
  };

  // Spec items for the 3x2 grid
  const techSpecs = [
    { label: 'Gear Box', value: vehicle.transmission || 'Automatic', icon: Gauge },
    { label: 'Fuel', value: vehicle.fuelType || 'Petrol', icon: Fuel },
    { label: 'Doors', value: isCar ? '4 Doors' : 'N/A', icon: Key },
    { label: 'Air Conditioner', value: vehicle.ac ? 'Yes' : 'No', icon: Wind },
    { label: 'Seats', value: `${vehicle.seatingCapacity || (isCar ? '5' : '2')} Seats`, icon: Users },
    { label: 'Mileage', value: vehicle.mileage || '16.9 km/l', icon: Flame },
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
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-8 mb-8 rounded-none">
        <div className="container-fluid flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#777777]">
              {vehicle.brand || 'Luxury Fleet'}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading mt-1">
              {vehicle.name}
            </h1>
          </div>

          <div className="text-left sm:text-right">
            <div className="flex items-baseline sm:justify-end gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-brand-primary">
                {formatCurrency(vehicle.pricePerDay)}
              </span>
              <span className="text-sm font-semibold text-[#777777]">~ /day</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">Taxes & insurance included</p>
          </div>
        </div>
      </div>

      <div className="container-fluid">
        {/* Two-Column Main Layout (Screenshot 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
          {/* Left Column: Big Vehicle Photo & Gallery Thumbnails */}
          <div className="lg:col-span-7 space-y-4">
            <div className="w-full h-72 sm:h-96 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] p-6 flex items-center justify-center overflow-hidden">
              <img
                src={vehicle.images?.[activeImageIndex] || vehicle.images?.[0]}
                alt={vehicle.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Thumbnail Row */}
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {vehicle.images.map((imgUrl, idx) => (
                  <button
                    key={idx}
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
                  </button>
                ))}
              </div>
            )}

            {/* Description Blurb */}
            {vehicle.description && (
              <div className="pt-4 text-xs sm:text-sm text-[#777777] leading-relaxed">
                <p>{vehicle.description}</p>
              </div>
            )}
          </div>

          {/* Right Column: Technical Specification & Car Equipment */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h3 className="text-sm font-bold text-[#151515] uppercase tracking-wider mb-4">
                Technical Specification
              </h3>

              {/* 3x2 Grid of Spec Cards */}
              <div className="grid grid-cols-3 gap-3">
                {techSpecs.map((spec, idx) => {
                  const Icon = spec.icon;
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] text-center flex flex-col items-center justify-center"
                    >
                      <Icon className="w-4 h-4 text-brand-primary mb-1.5" />
                      <span className="text-[10px] text-[#777777] font-medium block">
                        {spec.label}
                      </span>
                      <strong className="text-xs font-bold text-[#151515] mt-0.5 truncate max-w-full">
                        {spec.value}
                      </strong>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rent Now Action Button */}
            <div className="pt-2">
              <button
                onClick={handleBookNow}
                className="w-full py-4 px-6 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <span>Rent now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Car Equipment Section */}
            <div className="pt-4 border-t border-[#EAEAEA]">
              <h3 className="text-sm font-bold text-[#151515] uppercase tracking-wider mb-4">
                Car Equipment
              </h3>

              <div className="grid grid-cols-2 gap-3">
                {equipmentList.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-brand-primaryLight text-brand-primary flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* "Other cars" Section (Screenshot 3) */}
        <div className="pt-12 border-t border-[#EAEAEA]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-extrabold text-[#151515] font-heading">
              Other cars
            </h2>
            <Link
              to="/vehicles"
              className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(similarVehicles.length > 0 ? similarVehicles : []).slice(0, 3).map((car) => (
              <VehicleCard key={car._id} vehicle={car} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;
