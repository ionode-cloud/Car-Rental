import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import {
  Users,
  Gauge,
  Wind,
  ArrowRight,
  Heart,
  Fuel,
  Zap,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();
  const [isLiked, setIsLiked] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vehicle) return null;

  const isCar = vehicle.vehicleType === 'car';
  const isElectric = vehicle.fuelType?.toLowerCase() === 'electric';
  const displayImage =
    vehicle.images?.[activeImageIndex] ||
    vehicle.images?.[0] ||
    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop';

  const handleCardClick = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/vehicles/${vehicle._id}`);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      className="card-animated-premium p-3.5 sm:p-4 flex flex-col justify-between cursor-pointer group select-none h-full"
    >
      {/* Top Ambient Glow Line on Hover */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />

      <div>
        {/* ==================== 1. VEHICLE SHOWCASE STAGE ==================== */}
        <div className="card-spotlight rounded-2xl relative w-full h-38 sm:h-44 overflow-hidden flex items-center justify-center mb-3 border border-black/[0.04]">
          {/* Subtle Ambient Radial Highlight */}
          <div className="absolute inset-0 bg-radial-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Top Stage Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-auto">
            {/* Live Availability & Category Badge */}
            <div className="flex items-center gap-1.5">
              <span className="badge-glass text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2.5 py-1 rounded-full text-gray-800 flex items-center gap-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>{vehicle.category || (isCar ? 'Car' : 'Scooty')}</span>
              </span>

              {vehicle.featured && (
                <span className="badge-glass text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-full text-brand-primary hidden sm:inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  Popular
                </span>
              )}
            </div>

            {/* Interactive Wishlist Heart */}
            <button
              type="button"
              onClick={handleToggleWishlist}
              className={`w-8 h-8 rounded-full badge-glass flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${
                isLiked
                  ? 'text-rose-500 bg-rose-50/90 shadow-rose-200'
                  : 'text-gray-400 hover:text-rose-500'
              }`}
              title={isLiked ? 'Remove from favorites' : 'Save to favorites'}
            >
              <Heart
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked ? 'fill-rose-500 text-rose-500 scale-110' : ''
                }`}
              />
            </button>
          </div>

          {/* Vehicle Image with Smooth Hover Float */}
          <img
            src={displayImage}
            alt={vehicle.name}
            className="w-full h-full object-contain p-3 relative z-[2] transform transition-all duration-500 ease-out group-hover:scale-110 group-hover:-translate-y-2 drop-shadow-sm group-hover:drop-shadow-md"
            loading="lazy"
          />

          {/* Dynamic Ground Shadow that responds to hover lift */}
          <div className="absolute bottom-2.5 w-3/5 h-2.5 bg-black/15 rounded-[100%] blur-sm transform transition-all duration-500 ease-out group-hover:scale-90 group-hover:opacity-40 z-[1] pointer-events-none" />

          {/* Multi-Image Hover Carousel Dots */}
          {vehicle.images && vehicle.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full">
              {vehicle.images.slice(0, 4).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onMouseEnter={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    activeImageIndex === idx
                      ? 'w-3.5 bg-white'
                      : 'w-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Preview angle ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* ==================== 2. VEHICLE INFO & PRICING ==================== */}
        <div className="space-y-1 mb-3">
          {/* Brand & Status Row (Ratings Removed) */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
              {vehicle.brand || 'RideVista Fleet'}
            </span>

            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Instant Key
            </span>
          </div>

          {/* Vehicle Name & Daily Rate Row */}
          <div className="flex items-start justify-between gap-2 pt-0.5">
            <h3 className="text-base sm:text-lg font-black text-[#151515] group-hover:text-brand-primary transition-colors leading-snug tracking-tight">
              {vehicle.name}
            </h3>

            <div className="text-right shrink-0">
              <div className="text-lg sm:text-xl font-black text-brand-primary tracking-tight">
                {formatCurrency(vehicle.pricePerDay)}
              </div>
              <span className="text-[10px] text-gray-500 block font-semibold -mt-0.5">
                /per day
              </span>
            </div>
          </div>
        </div>

        {/* ==================== 3. ANIMATED SPECS GRID ==================== */}
        <div className="grid grid-cols-3 gap-1.5 py-2.5 my-2 border-y border-[#ECECF2] text-xs">
          {/* Transmission */}
          <div className="spec-pill rounded-xl p-2 flex items-center justify-center gap-1.5 truncate">
            <Gauge className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="font-semibold text-gray-700 truncate text-[11px]">
              {vehicle.transmission || 'Manual'}
            </span>
          </div>

          {/* Capacity */}
          <div className="spec-pill rounded-xl p-2 flex items-center justify-center gap-1.5 truncate">
            <Users className="w-3.5 h-3.5 text-brand-primary shrink-0" />
            <span className="font-semibold text-gray-700 truncate text-[11px]">
              {vehicle.seatingCapacity || (isCar ? '5' : '2')} Seats
            </span>
          </div>

          {/* Fuel / Climate */}
          <div className="spec-pill rounded-xl p-2 flex items-center justify-center gap-1.5 truncate">
            {isElectric ? (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="font-semibold text-emerald-600 truncate text-[11px]">
                  Electric EV
                </span>
              </>
            ) : vehicle.ac ? (
              <>
                <Wind className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="font-semibold text-gray-700 truncate text-[11px]">
                  AC Climate
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                <span className="font-semibold text-gray-700 truncate text-[11px]">
                  {isCar ? 'Non-AC' : 'Helmets'}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ==================== 4. INTERACTIVE ANIMATED CTA BUTTON ==================== */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleViewDetails}
          className="btn-theme-gradient shine-sweep w-full py-2.5 px-3 rounded-xl text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 group/btn shadow-sm"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover/btn:translate-x-1 transition-transform duration-300 shrink-0" />
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
