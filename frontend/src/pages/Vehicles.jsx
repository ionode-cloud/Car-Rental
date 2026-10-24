import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { vehicleService } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const BRANDS = [
  { name: 'Toyota', logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/Toyota_logo_%282020%29.svg' },
  { name: 'Ford', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Ford_logo_flat.svg' },
  { name: 'Mercedes-Benz', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg' },
  { name: 'Jeep', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Jeep_logo.svg' },
  { name: 'BMW', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg' },
  { name: 'Audi', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg' },
];

const CATEGORIES = [
  'All Vehicles',
  'SUV',
  'Sedan',
  'Hatchback',
  'MUV',
  'Bikes',
  'Scooties',
  'Luxury',
];

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get('category') || searchParams.get('type') || 'All Vehicles'
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await vehicleService.getAllVehicles({ limit: 100 });
        if (res.success && res.vehicles) {
          setVehicles(res.vehicles);
        }
      } catch (err) {
        console.error('Error fetching vehicles:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  // Filter vehicles based on active category and search
  const filteredVehicles = vehicles.filter((v) => {
    // Category filtering
    if (selectedCategory !== 'All Vehicles') {
      if (selectedCategory === 'Scooties') {
        if (v.vehicleType !== 'scooty' && v.category !== 'Scooties') return false;
      } else if (selectedCategory === 'Bikes') {
        if (v.vehicleType !== 'bike' && v.category !== 'Bikes') return false;
      } else if (selectedCategory === 'Electric') {
        if (v.fuelType !== 'Electric') return false;
      } else {
        const matchesCategory =
          v.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          v.vehicleType?.toLowerCase() === selectedCategory.toLowerCase() ||
          v.model?.toLowerCase().includes(selectedCategory.toLowerCase());
        if (!matchesCategory) return false;
      }
    }

    // Search query filtering
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        v.name?.toLowerCase().includes(q) ||
        v.brand?.toLowerCase().includes(q) ||
        v.category?.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    return true;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortBy === 'price-low') return a.pricePerDay - b.pricePerDay;
    if (sortBy === 'price-high') return b.pricePerDay - a.pricePerDay;
    if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
    return 0; // Default order
  });

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category === 'All Vehicles') {
      searchParams.delete('category');
      searchParams.delete('type');
    } else {
      searchParams.set('category', category);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="bg-white min-h-screen text-[#151515] pb-12 w-full">
      {/* ==================== FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-8 mb-8 rounded-none">
        <div className="container-fluid text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#151515] font-heading tracking-tight">
            Select a vehicle group
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 max-w-md mx-auto">
            Find the vehicle that best complements your travel aspirations.
          </p>
        </div>
      </div>

      <div className="container-fluid">

        {/* Category Tabs (Screenshot 2: Pill Buttons) */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-md'
                    : 'bg-[#F8F8FA] text-[#777777] hover:bg-gray-200 hover:text-[#151515]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Vehicle Cards Grid */}
        {loading ? (
          <div className="py-24 flex justify-center">
            <LoadingSpinner size="lg" />
          </div>
        ) : sortedVehicles.length === 0 ? (
          <div className="text-center py-20 bg-[#F8F8FA] rounded-2xl border border-[#EAEAEA]">
            <p className="text-sm font-semibold text-gray-500 mb-2">
              No vehicles matched your criteria.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All Vehicles');
                setSearchTerm('');
              }}
              className="text-xs font-bold text-brand-primary hover:underline"
            >
              Reset filters and view all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 sm:gap-8">
            {sortedVehicles.map((vehicle) => (
              <VehicleCard key={vehicle._id} vehicle={vehicle} />
            ))}
          </div>
        )}
      </div>

      {/* Brand Logos Full Width Strip */}
      <div id="brands" className="w-full bg-[#F8F8FA] border-t border-[#EAEAEA] py-12 mt-16 rounded-none">
        <div className="container-fluid">
          <div className="text-center mb-6">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#777777]">
              Trusted By Global Automotive Brands
            </span>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-6 sm:gap-8 items-center justify-items-center opacity-70 hover:opacity-100 transition-opacity">
            {BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex flex-col items-center justify-center p-3 grayscale hover:grayscale-0 transition-all hover:scale-105"
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-8 sm:h-10 w-auto object-contain max-w-[90px]"
                  onError={(e) => {
                    // Fallback to text if svg fails to load
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling.style.display = 'block';
                  }}
                />
                <span className="hidden text-sm font-extrabold tracking-wider text-gray-800">
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Vehicles;
