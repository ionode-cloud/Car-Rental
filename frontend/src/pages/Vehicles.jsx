import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vehicleService } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import BrandMarquee from '../components/BrandMarquee';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

const CATEGORIES = [
  'All Vehicles',
  'Toyota',
  'Ford',
  'Mercedes-Benz',
  'Jeep',
  'BMW',
  'Audi',
  'SUV',
  'Sedan',
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
    // Category & Brand filtering
    if (selectedCategory !== 'All Vehicles') {
      if (selectedCategory === 'Scooties') {
        if (v.vehicleType !== 'scooty' && v.category !== 'Scooties') return false;
      } else if (selectedCategory === 'Bikes') {
        if (v.vehicleType !== 'bike' && v.category !== 'Bikes') return false;
      } else if (selectedCategory === 'Electric') {
        if (v.fuelType !== 'Electric') return false;
      } else if (v.brand?.toLowerCase() === selectedCategory.toLowerCase()) {
        // Direct brand match (Toyota, Ford, Mercedes-Benz, Jeep, BMW, Audi)
        return true;
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
        {/* Category Tabs with Animated Sliding Pill */}
        <div className="flex items-center justify-center flex-wrap gap-2 sm:gap-2.5 mb-6 sm:mb-8">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`relative px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'bg-[#F8F8FA] text-[#777777] hover:bg-gray-200 hover:text-[#151515]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeVehiclesCategoryPill"
                    className="absolute inset-0 bg-brand-primary rounded-full shadow-md -z-0"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{cat}</span>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-[#F8F8FA] rounded-2xl border border-[#EAEAEA]"
          >
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
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5 sm:gap-5 items-stretch"
          >
            <AnimatePresence mode="popLayout">
              {sortedVehicles.map((vehicle, index) => (
                <motion.div
                  key={vehicle._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.35, delay: Math.min(index * 0.05, 0.4) }}
                  className="h-full"
                >
                  <VehicleCard vehicle={vehicle} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Dual Direction Brand Marquee */}
      <div id="brands" className="mt-16">
        <BrandMarquee onSelectBrand={(brand) => handleCategoryClick(brand)} />
      </div>
    </div>
  );
};
export default Vehicles;
