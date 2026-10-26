import React, { useState, useEffect } from 'react';
import { vehicleService } from '../services/vehicleService';
import { useBooking } from '../context/BookingContext';
import VehicleCard from '../components/VehicleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Bike,
  Sparkles,
  Zap,
  HardHat,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const scootyCategories = ['All', 'Electric Scooty', 'Premium Scooty', 'Standard Scooty'];
const fuelTypes = ['All', 'Electric', 'Petrol'];

const ScootyRental = () => {
  const { searchFilters } = useBooking();

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [fuelType, setFuelType] = useState('All');
  const [maxPrice, setMaxPrice] = useState(2000);
  const [sort, setSort] = useState('popular');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const fetchScooties = async () => {
    setLoading(true);
    try {
      const params = {
        vehicleType: 'scooty',
        page,
        limit: 9,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'All') params.category = category;
      if (fuelType !== 'All') params.fuelType = fuelType;
      if (maxPrice < 2000) params.maxPrice = maxPrice;

      if (searchFilters.pickupDate && searchFilters.returnDate) {
        params.pickupDate = searchFilters.pickupDate;
        params.returnDate = searchFilters.returnDate;
      }

      const response = await vehicleService.getVehicles(params);
      if (response.success) {
        setVehicles(response.vehicles || []);
        setTotalPages(response.totalPages || 1);
        setTotalCount(response.total || 0);
      }
    } catch (err) {
      console.error('Failed to fetch scooties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScooties();
  }, [category, fuelType, maxPrice, sort, page]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchScooties();
  };

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setFuelType('All');
    setMaxPrice(2000);
    setSort('popular');
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-20">
      {/* Header Banner */}
      <section className="relative py-14 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Urban Two-Wheeler Fleet
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-3">
            Explore More with Scooty Rentals
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Enjoy convenient and affordable two-wheeler rentals for your everyday journeys and
            urban adventures. Sanitized helmets and mobile phone mounts included free.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-fluid py-10">
        {/* Search & Top Action Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search scooties (Ather, Ola, Vespa, Activa)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-brand-dark/90 border border-white/15 rounded-2xl pl-11 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary/60"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-brand-primary text-white text-xs font-bold"
            >
              Search
            </button>
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <button
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-xs font-bold text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
              <span>Filters</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 whitespace-nowrap">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="bg-brand-dark border border-white/15 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="newest">Recently Added</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter Sidebar */}
          <aside
            className={`lg:block ${
              mobileFilterOpen ? 'block' : 'hidden'
            } lg:col-span-1 space-y-6 glass-panel p-6 rounded-3xl border border-white/10 h-fit`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-primary" />
                Filter Options
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-gray-400 hover:text-brand-primary flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Scooty Category
              </label>
              <div className="flex flex-col gap-1.5">
                {scootyCategories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setCategory(c);
                      setPage(1);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all ${
                      category === c
                        ? 'bg-brand-primary text-white shadow-primary-glow'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Max Daily Rate
                </label>
                <span className="text-xs font-bold text-brand-primary">₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="400"
                max="2000"
                step="50"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(Number(e.target.value));
                  setPage(1);
                }}
                className="w-full accent-brand-primary cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>₹400</span>
                <span>₹2,000</span>
              </div>
            </div>

            {/* Fuel Type */}
            <div>
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-2">
                Power Source
              </label>
              <div className="flex gap-2">
                {fuelTypes.map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => {
                      setFuelType(f);
                      setPage(1);
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                      fuelType === f
                        ? 'bg-brand-primary text-white'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Inclusions badge */}
            <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 text-xs text-gray-300 space-y-2">
              <p className="font-bold text-white flex items-center gap-1.5">
                <HardHat className="w-4 h-4 text-brand-primary" />
                Included with All Scooties:
              </p>
              <p className="text-[11px] leading-relaxed text-gray-400">
                1 ISI-certified sanitized helmet, fast charging kit, and complimentary roadside
                assistance within municipal limits.
              </p>
            </div>
          </aside>

          {/* Vehicle Grid Column */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-gray-400">
                Showing <strong className="text-white">{vehicles.length}</strong> of{' '}
                <strong className="text-white">{totalCount}</strong> available scooties
              </span>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : vehicles.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
                <Bike className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Scooties Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-5">
                  Try adjusting your filter options to view available two-wheelers.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="orange-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
                {vehicles.map((scooty) => (
                  <VehicleCard key={scooty._id} vehicle={scooty} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === i + 1
                        ? 'bg-brand-primary text-white shadow-primary-glow'
                        : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScootyRental;
