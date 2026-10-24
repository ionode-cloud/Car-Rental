import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useBooking } from '../context/BookingContext';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Car,
  Clock,
  Zap,
} from 'lucide-react';

const categories = ['All', 'Daily', 'Weekend', 'Weekly', 'Monthly', 'Outstation'];

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const { setSelectedPackage } = useBooking();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        if (response.packages) {
          setPackages(response.packages);
        }
      } catch (err) {
        console.error('Failed to load packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const filteredPackages =
    selectedCategory === 'All'
      ? packages
      : packages.filter((p) => p.category.toLowerCase() === selectedCategory.toLowerCase());

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    navigate(`/car-rental?packageId=${pkg._id}`);
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-20">
      {/* Header Banner */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-primary text-xs font-bold uppercase tracking-widest">
            Value Bundles
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-white mt-2 mb-4">
            Rental Packages & Passes
          </h1>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
            Maximize your mileage and savings. All packages include pre-allocated kilometers,
            comprehensive damage insurance, and zero surge pricing.
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-primary text-white shadow-primary-glow'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Package Cards Grid */}
      <section className="py-12 container-fluid">
        {loading ? (
          <LoadingSpinner />
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg">No packages found for category "{selectedCategory}".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map((pkg) => (
              <div
                key={pkg._id}
                className="glass-panel glass-panel-hover rounded-3xl p-7 flex flex-col justify-between border border-white/10 hover:border-brand-primary/50 relative overflow-hidden"
              >
                {pkg.discount > 0 && (
                  <div className="absolute top-4 right-4 bg-brand-primary text-white text-[11px] font-black px-3 py-1 rounded-full shadow-primary-glow uppercase">
                    Save {pkg.discount}%
                  </div>
                )}

                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-xs text-brand-primary font-bold uppercase mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.duration}</span>
                  </div>

                  <h3 className="text-2xl font-black text-white">{pkg.name}</h3>
                  <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="my-6 p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">
                        {formatCurrency(pkg.price)}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">/{pkg.duration}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10 text-xs">
                      <span className="text-gray-400">Included Distance:</span>
                      <span className="text-brand-primary font-bold">
                        {pkg.includedKilometers} km
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1 text-xs">
                      <span className="text-gray-400">Extra km rate:</span>
                      <span className="text-gray-200 font-semibold">
                        ₹{pkg.extraKilometerPrice || 12}/km
                      </span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                      Included Services:
                    </p>
                    <ul className="space-y-2 text-xs text-gray-300">
                      {pkg.features?.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-brand-primary shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Terms */}
                  {pkg.terms && pkg.terms.length > 0 && (
                    <div className="p-3 rounded-xl bg-brand-dark/50 border border-white/5 text-[11px] text-gray-400 mb-6">
                      <p className="font-semibold text-gray-300 mb-1 flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3 text-amber-400" />
                        Terms & Conditions:
                      </p>
                      <ul className="list-disc list-inside space-y-0.5">
                        {pkg.terms.slice(0, 2).map((term, i) => (
                          <li key={i} className="truncate">
                            {term}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleSelectPackage(pkg)}
                  className="orange-gradient-btn w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <span>Select & View Vehicles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Packages;
