import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { vehicleService } from '../services/vehicleService';
import VehicleCard from '../components/VehicleCard';
import BrandMarquee from '../components/BrandMarquee';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Car,
  Fuel,
  Gauge,
  Sparkles,
  ShieldCheck,
  IndianRupee,
} from 'lucide-react';

const VEHICLE_TYPES = [
  { label: 'All Categories', value: 'all' },
  { label: 'Cars', value: 'cars' },
  { label: 'Bikes', value: 'bikes' },
  { label: 'Scooties', value: 'scooties' },
  { label: 'SUVs', value: 'suv' },
  { label: 'Sedans', value: 'sedan' },
  { label: 'Hatchbacks', value: 'hatchback' },
  { label: 'Electric (EV)', value: 'electric' },
];

const BRANDS = [
  'All Brands',
  'Toyota',
  'Hyundai',
  'Mahindra',
  'Tata',
  'Honda',
  'Maruti Suzuki',
  'Ford',
  'Royal Enfield',
  'Yamaha',
];

const TRANSMISSIONS = [
  { label: 'All Transmissions', value: 'all' },
  { label: 'Automatic', value: 'automatic' },
  { label: 'Manual', value: 'manual' },
];

const FUEL_TYPES = [
  { label: 'All Fuel Types', value: 'all' },
  { label: 'Petrol', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Electric', value: 'electric' },
];

const RENTAL_MODES = [
  { label: 'All Rental Modes', value: 'all' },
  { label: 'Self Drive (₹0 Deposit)', value: 'self_drive' },
  { label: 'Driving with Driver', value: 'with_driver' },
];

const Vehicles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('All Brands');
  const [selectedTransmission, setSelectedTransmission] = useState('all');
  const [selectedFuelType, setSelectedFuelType] = useState('all');
  const [selectedRentalMode, setSelectedRentalMode] = useState('all');

  // Price Filter State
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(5000);

  // Sort State
  const [sortBy, setSortBy] = useState('popular');

  // Mobile drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Sync state with URL parameters (brand, category, type, search)
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('type');
    const brand = searchParams.get('brand');
    const q = searchParams.get('search');

    if (brand) {
      const matchBrand = BRANDS.find((b) => b.toLowerCase() === brand.toLowerCase());
      if (matchBrand) setSelectedBrand(matchBrand);
    }

    if (cat) {
      const matchType = VEHICLE_TYPES.find((t) => t.value.toLowerCase() === cat.toLowerCase());
      if (matchType) {
        setSelectedType(matchType.value);
      } else {
        // Could be brand as category fallback
        const matchBrand = BRANDS.find((b) => b.toLowerCase() === cat.toLowerCase());
        if (matchBrand) setSelectedBrand(matchBrand);
      }
    }

    if (q !== null) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  // Fetch all vehicles
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

  // Filter vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((v) => {
      // 1. Vehicle Type / Category
      if (selectedType !== 'all') {
        const t = selectedType.toLowerCase();
        const vType = (v.vehicleType || '').toLowerCase();
        const vCat = (v.category || '').toLowerCase();
        const vFuel = (v.fuelType || '').toLowerCase();

        if (t === 'cars' && vType !== 'car') return false;
        if (t === 'bikes' && vType !== 'bike' && vCat !== 'bikes') return false;
        if (t === 'scooties' && vType !== 'scooty' && vCat !== 'scooties') return false;
        if (t === 'suv' && vCat !== 'suv') return false;
        if (t === 'sedan' && vCat !== 'sedan') return false;
        if (t === 'hatchback' && vCat !== 'hatchback') return false;
        if (t === 'electric' && vFuel !== 'electric' && vCat !== 'electric') return false;
      }

      // 2. Brand
      if (selectedBrand !== 'All Brands') {
        if ((v.brand || '').toLowerCase() !== selectedBrand.toLowerCase()) return false;
      }

      // 3. Transmission
      if (selectedTransmission !== 'all') {
        if ((v.transmission || '').toLowerCase() !== selectedTransmission.toLowerCase()) return false;
      }

      // 4. Fuel Type
      if (selectedFuelType !== 'all') {
        if ((v.fuelType || '').toLowerCase() !== selectedFuelType.toLowerCase()) return false;
      }

      // 5. Price Filter (minPrice & maxPrice)
      const price = Number(v.pricePerDay) || 0;
      if (minPrice && price < Number(minPrice)) return false;
      if (maxPrice && price > Number(maxPrice)) return false;

      // 6. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matches =
          (v.name || '').toLowerCase().includes(q) ||
          (v.brand || '').toLowerCase().includes(q) ||
          (v.category || '').toLowerCase().includes(q) ||
          (v.model || '').toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [
    vehicles,
    selectedType,
    selectedBrand,
    selectedTransmission,
    selectedFuelType,
    minPrice,
    maxPrice,
    searchTerm,
  ]);

  // Sort vehicles
  const sortedVehicles = useMemo(() => {
    const list = [...filteredVehicles];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => (a.pricePerDay || 0) - (b.pricePerDay || 0));
    }
    if (sortBy === 'price-high') {
      return list.sort((a, b) => (b.pricePerDay || 0) - (a.pricePerDay || 0));
    }
    if (sortBy === 'rating') {
      return list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    return list; // default
  }, [filteredVehicles, sortBy]);

  // ==================== PAGINATION (16 cards per section) ====================
  const ITEMS_PER_PAGE = 16;
  const [currentPage, setCurrentPage] = useState(1);

  // Automatically reset to page 1 whenever filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedType,
    selectedBrand,
    selectedTransmission,
    selectedFuelType,
    selectedRentalMode,
    minPrice,
    maxPrice,
    searchTerm,
    sortBy,
  ]);

  const totalPages = Math.ceil(sortedVehicles.length / ITEMS_PER_PAGE) || 1;

  // Sliced vehicles for the active page
  const paginatedVehicles = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedVehicles.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [sortedVehicles, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      const target = document.getElementById('vehicles-top-anchor');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 200, behavior: 'smooth' });
      }
    }
  };

  // Check active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedType !== 'all') count++;
    if (selectedBrand !== 'All Brands') count++;
    if (selectedTransmission !== 'all') count++;
    if (selectedFuelType !== 'all') count++;
    if (selectedRentalMode !== 'all') count++;
    if (minPrice > 0 || maxPrice < 5000) count++;
    if (searchTerm.trim()) count++;
    return count;
  }, [
    selectedType,
    selectedBrand,
    selectedTransmission,
    selectedFuelType,
    selectedRentalMode,
    minPrice,
    maxPrice,
    searchTerm,
  ]);

  // Reset all filters
  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedBrand('All Brands');
    setSelectedTransmission('all');
    setSelectedFuelType('all');
    setSelectedRentalMode('all');
    setMinPrice(0);
    setMaxPrice(5000);
    setSearchTerm('');
    setSortBy('popular');
    setSearchParams({});
  };

  const handleBrandSelectFromMarquee = (brandName) => {
    setSelectedBrand(brandName);
    window.scrollTo({ top: 220, behavior: 'smooth' });
  };

  return (
    <div className="bg-white min-h-screen text-[#151515] pb-14 w-full">
      {/* ==================== FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-4 sm:mb-8 rounded-none">
        <div className="container-fluid text-center">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading tracking-tight">
            Explore All Vehicles
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1 max-w-lg mx-auto">
            Self Drive or Driving with Driver — filter by brand, transmission, fuel.
          </p>
        </div>
      </div>

      <div className="container-fluid">
        {/* Mobile Filter Toggle & Quick Search Row */}
        <div className="lg:hidden flex items-center justify-between gap-2 mb-4">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] font-bold text-xs text-[#151515] shadow-xs active:scale-95 transition-all"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
            <span>Filters & Price {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-[#EAEAEA] rounded-xl px-3 py-2.5 text-xs font-bold text-[#151515] shadow-xs"
          >
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>

        {/* ==================== TWO-COLUMN LAYOUT ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ========================================================
              LEFT SIDE: DROPDOWNS & PRICE FILTER SIDEBAR (lg:col-span-3)
              ======================================================== */}
          <aside
            className={`lg:col-span-3 space-y-4 ${
              mobileFilterOpen ? 'block' : 'hidden lg:block'
            } lg:sticky lg:top-20 z-10`}
          >
            <div className="bg-[#F8F8FA] border border-[#EAEAEA] rounded-2xl p-4 sm:p-5 shadow-xs space-y-5">
              {/* Filter Card Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EAEAEA]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-primary" />
                  <h2 className="text-sm font-extrabold text-[#151515] uppercase tracking-wider font-heading">
                    Filters & Pricing
                  </h2>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[11px] font-bold text-brand-primary hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    Reset ({activeFiltersCount})
                  </button>
                )}
              </div>

              {/* 1. Keyword Search Input */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider block">
                  Search Model
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={searchTerm}
                    placeholder="e.g. Fortuner, Creta, Thar..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl pl-8 pr-7 py-2 text-xs font-semibold text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary shadow-2xs"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. PRICE FILTER (Prise Filter Slider & Min/Max Inputs) */}
              <div className="space-y-3 pt-1 border-t border-[#EAEAEA]/80">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1">
                    <span>Daily Rental Price</span>
                  </label>
                  <span className="text-xs font-black text-brand-primary">
                    Up to {formatCurrency(maxPrice)}
                  </span>
                </div>

                {/* Price Range Slider */}
                <div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="100"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-[#FF6600] cursor-pointer h-1.5 bg-gray-200 rounded-lg appearance-none"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
                    <span>₹500</span>
                    <span>₹2,500</span>
                    <span>₹5,000</span>
                  </div>
                </div>

                {/* Min & Max Inputs Row */}
                <div className="grid grid-cols-2 gap-2 pt-0.5">
                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Min Price</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        max={maxPrice}
                        step="100"
                        value={minPrice}
                        onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-white border border-[#EAEAEA] rounded-lg pl-6 pr-2 py-1.5 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase block mb-0.5">Max Price</span>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">₹</span>
                      <input
                        type="number"
                        min={minPrice}
                        max="10000"
                        step="100"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(Math.max(minPrice, Number(e.target.value)))}
                        className="w-full bg-white border border-[#EAEAEA] rounded-lg pl-6 pr-2 py-1.5 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Quick Price Preset Buttons */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => { setMinPrice(0); setMaxPrice(1000); }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                      maxPrice === 1000 && minPrice === 0
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary'
                    }`}
                  >
                    &lt; ₹1,000
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(1000); setMaxPrice(2000); }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                      minPrice === 1000 && maxPrice === 2000
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary'
                    }`}
                  >
                    ₹1,000 - ₹2,000
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMinPrice(0); setMaxPrice(5000); }}
                    className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors ${
                      minPrice === 0 && maxPrice === 5000
                        ? 'bg-brand-primary text-white border-brand-primary'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-brand-primary'
                    }`}
                  >
                    Any Price
                  </button>
                </div>
              </div>

              {/* 3. CATEGORY / VEHICLE TYPE DROPDOWN */}
              <div className="space-y-1.5 pt-1 border-t border-[#EAEAEA]/80">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Vehicle Category</span>
                  <span className="text-[10px] text-gray-400 font-normal">Cars, Bikes, SUVs</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer appearance-none pr-8"
                  >
                    {VEHICLE_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 4. BRAND DROPDOWN */}
              <div className="space-y-1.5 pt-1 border-t border-[#EAEAEA]/80">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Make / Brand</span>
                  <span className="text-[10px] text-gray-400 font-normal">Toyota, Hyundai...</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer appearance-none pr-8"
                  >
                    {BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 5. TRANSMISSION DROPDOWN */}
              <div className="space-y-1.5 pt-1 border-t border-[#EAEAEA]/80">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Transmission</span>
                  <span className="text-[10px] text-gray-400 font-normal">Auto / Manual</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedTransmission}
                    onChange={(e) => setSelectedTransmission(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer appearance-none pr-8"
                  >
                    {TRANSMISSIONS.map((tr) => (
                      <option key={tr.value} value={tr.value}>
                        {tr.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 6. FUEL TYPE DROPDOWN */}
              <div className="space-y-1.5 pt-1 border-t border-[#EAEAEA]/80">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Fuel Type</span>
                  <span className="text-[10px] text-gray-400 font-normal">Petrol, Diesel, EV</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedFuelType}
                    onChange={(e) => setSelectedFuelType(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer appearance-none pr-8"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f.value} value={f.value}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 7. RENTAL MODE (Self Drive vs Driving with Driver) */}
              <div className="space-y-1.5 pt-1 border-t border-[#EAEAEA]/80">
                <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center justify-between">
                  <span>Rental Mode</span>
                  <span className="text-[10px] text-emerald-600 font-bold">₹0 Deposit</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedRentalMode}
                    onChange={(e) => setSelectedRentalMode(e.target.value)}
                    className="w-full bg-white border border-[#EAEAEA] rounded-xl px-3 py-2 text-xs font-bold text-[#151515] focus:outline-none focus:border-brand-primary shadow-2xs cursor-pointer appearance-none pr-8"
                  >
                    {RENTAL_MODES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* No Deposit Assurance Badge */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% No Security Deposit Required for all rentals.</span>
              </div>
            </div>
          </aside>

          {/* ========================================================
              RIGHT SIDE: VEHICLE CARDS SHOWCASE (lg:col-span-9)
              ======================================================== */}
          <main id="vehicles-top-anchor" className="lg:col-span-9 space-y-4">
            {/* Desktop Top Control & Stats Bar */}
            <div className="bg-[#F8F8FA] border border-[#EAEAEA] rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Left: Result Count & Active Filter Tags */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold text-[#151515]">
                  Showing <span className="text-brand-primary">{paginatedVehicles.length}</span> of {sortedVehicles.length} Vehicles
                  <span className="text-gray-400 font-semibold ml-1 text-[11px]">(16 per page)</span>
                </span>

                {/* Active Filter Tags */}
                {selectedType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-300 text-gray-700">
                    Type: {VEHICLE_TYPES.find((t) => t.value === selectedType)?.label}
                    <X
                      className="w-3 h-3 hover:text-red-500 cursor-pointer"
                      onClick={() => setSelectedType('all')}
                    />
                  </span>
                )}

                {selectedBrand !== 'All Brands' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-300 text-gray-700">
                    {selectedBrand}
                    <X
                      className="w-3 h-3 hover:text-red-500 cursor-pointer"
                      onClick={() => setSelectedBrand('All Brands')}
                    />
                  </span>
                )}

                {selectedTransmission !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-300 text-gray-700">
                    {selectedTransmission === 'automatic' ? 'Automatic' : 'Manual'}
                    <X
                      className="w-3 h-3 hover:text-red-500 cursor-pointer"
                      onClick={() => setSelectedTransmission('all')}
                    />
                  </span>
                )}

                {selectedFuelType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-300 text-gray-700">
                    {selectedFuelType}
                    <X
                      className="w-3 h-3 hover:text-red-500 cursor-pointer"
                      onClick={() => setSelectedFuelType('all')}
                    />
                  </span>
                )}

                {(minPrice > 0 || maxPrice < 5000) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white border border-gray-300 text-gray-700">
                    ₹{minPrice} - ₹{maxPrice}
                    <X
                      className="w-3 h-3 hover:text-red-500 cursor-pointer"
                      onClick={() => { setMinPrice(0); setMaxPrice(5000); }}
                    />
                  </span>
                )}
              </div>

              {/* Right: Sort By Dropdown (Desktop) */}
              <div className="hidden sm:flex items-center gap-2 shrink-0">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                  <ArrowUpDown className="w-3 h-3 text-gray-400" />
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#EAEAEA] rounded-xl px-3 py-1.5 text-xs font-bold text-[#151515] shadow-2xs cursor-pointer focus:outline-none focus:border-brand-primary"
                >
                  <option value="popular">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
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
                className="text-center py-20 bg-[#F8F8FA] rounded-2xl border border-[#EAEAEA] p-6 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-orange-100 text-brand-primary flex items-center justify-center mx-auto">
                  <Filter className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#151515]">
                  No vehicles match your active filters
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Try widening your price range, clearing brand or category filters to view available vehicles.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-bold transition-all shadow-sm"
                >
                  Reset All Filters
                </button>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <motion.div
                  layout
                  className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 sm:gap-3.5 items-stretch"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedVehicles.map((vehicle, index) => (
                      <motion.div
                        key={vehicle._id}
                        layout
                        initial={{ opacity: 0, scale: 0.94, y: 15 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.88 }}
                        transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.3) }}
                        className="h-full"
                      >
                        <VehicleCard vehicle={vehicle} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* ==================== PAGINATION BAR (16 CARDS PER SECTION) ==================== */}
                {sortedVehicles.length > 0 && (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 pb-2 border-t border-[#EAEAEA]">
                    {/* Items range display */}
                    <div className="text-xs text-gray-500 font-semibold">
                      Showing{' '}
                      <span className="text-[#151515] font-extrabold">
                        {(currentPage - 1) * ITEMS_PER_PAGE + 1}
                      </span>{' '}
                      -{' '}
                      <span className="text-[#151515] font-extrabold">
                        {Math.min(currentPage * ITEMS_PER_PAGE, sortedVehicles.length)}
                      </span>{' '}
                      of{' '}
                      <span className="text-[#151515] font-extrabold">
                        {sortedVehicles.length}
                      </span>{' '}
                      vehicles
                      <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F0F0F4] text-gray-700">
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    {/* Pagination Buttons (Prev, Pages, Next) */}
                    <div className="flex items-center gap-1.5">
                      {/* Prev Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          currentPage === 1
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:text-brand-primary border-gray-200 hover:border-brand-primary shadow-xs cursor-pointer'
                        }`}
                        aria-label="Previous Page"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span>Prev</span>
                      </button>

                      {/* Numeric Page Buttons */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                        const isActive = pageNum === currentPage;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 rounded-xl text-xs font-black transition-all flex items-center justify-center border cursor-pointer ${
                              isActive
                                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/25 scale-105'
                                : 'bg-white text-gray-700 hover:text-brand-primary border-gray-200 hover:border-brand-primary shadow-2xs'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {/* Next Button */}
                      <button
                        type="button"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                          currentPage === totalPages
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                            : 'bg-white text-gray-700 hover:text-brand-primary border-gray-200 hover:border-brand-primary shadow-xs cursor-pointer'
                        }`}
                        aria-label="Next Page"
                      >
                        <span>Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Brand Marquee at Bottom */}
      <div id="brands" className="mt-12">
        <BrandMarquee onSelectBrand={handleBrandSelectFromMarquee} />
      </div>
    </div>
  );
};

export default Vehicles;
