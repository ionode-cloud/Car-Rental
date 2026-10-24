import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import {
  Users,
  Gauge,
  Wind,
  ArrowRight,
} from 'lucide-react';

const VehicleCard = ({ vehicle }) => {
  const navigate = useNavigate();

  if (!vehicle) return null;

  const isCar = vehicle.vehicleType === 'car';

  const handleCardClick = () => {
    navigate(`/vehicles/${vehicle._id}`);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    navigate(`/vehicles/${vehicle._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-[#F8F8FA] hover:bg-white border border-[#EAEAEA] hover:border-brand-primary/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl cursor-pointer group"
    >
      {/* Vehicle Image Container */}
      <div className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden flex items-center justify-center mb-4 bg-white/60">
        <img
          src={vehicle.images?.[0] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'}
          alt={vehicle.name}
          className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Category Pill Tag */}
        <span className="absolute top-2.5 left-2.5 text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full bg-white/90 text-gray-700 shadow-sm border border-gray-100">
          {vehicle.category || (isCar ? 'Car' : vehicle.vehicleType === 'bike' ? 'Bike' : 'Scooty')}
        </span>
      </div>

      {/* Title & Price Row */}
      <div className="flex items-start justify-between gap-2 mb-1">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#151515] group-hover:text-brand-primary transition-colors leading-snug">
            {vehicle.name}
          </h3>
          <p className="text-xs text-[#777777] font-medium">
            {vehicle.brand || 'Premium'}
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-lg sm:text-xl font-extrabold text-brand-primary">
            {formatCurrency(vehicle.pricePerDay)}
          </span>
          <span className="text-[11px] text-[#777777] block font-medium">/per day</span>
        </div>
      </div>

      {/* Specifications Row */}
      <div className="grid grid-cols-3 gap-1 py-3 my-2 border-y border-[#EAEAEA] text-xs text-[#777777]">
        <div className="flex items-center gap-1.5 truncate">
          <Gauge className="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span className="truncate">{vehicle.transmission || 'Manual'}</span>
        </div>
        <div className="flex items-center gap-1.5 justify-center truncate">
          <Users className="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span className="truncate">{vehicle.seatingCapacity || (isCar ? '5' : '2')} Seats</span>
        </div>
        <div className="flex items-center gap-1.5 justify-end truncate">
          <Wind className="w-3.5 h-3.5 text-brand-primary shrink-0" />
          <span className="truncate">{vehicle.ac ? 'Air Cond.' : (isCar ? 'Non-AC' : 'Helmet Incl.')}</span>
        </div>
      </div>

      {/* Action Button: View Details opens Vehicle Details Page without requiring login! */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handleViewDetails}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 group-hover:bg-brand-primaryHover"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
