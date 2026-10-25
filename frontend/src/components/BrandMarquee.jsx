import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

// Reliable Vector Logos for Toyota, Ford, Mercedes-Benz, Jeep, BMW, Audi
const BRAND_ICONS = {
  Toyota: (
    <svg viewBox="0 0 48 36" className="w-full h-full fill-current" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 0C10.74 0 0 7.83 0 17.5s10.74 17.5 24 17.5 24-7.83 24-17.5S37.26 0 24 0zm0 3.2c11.2 0 20.4 6.2 20.4 14.3 0 8.1-9.2 14.3-20.4 14.3S3.6 25.6 3.6 17.5C3.6 9.4 12.8 3.2 24 3.2zm0 3.3c-6.8 0-12.3 5-12.3 11s5.5 11 12.3 11 12.3-5 12.3-11-5.5-11-12.3-11zm0 2.8c4.9 0 8.8 3.7 8.8 8.2s-3.9 8.2-8.8 8.2-8.8-3.7-8.8-8.2 3.9-8.2 8.8-8.2zm-4.2 2.6c-1.5 0-2.8 2.5-2.8 5.6s1.3 5.6 2.8 5.6 2.8-2.5 2.8-5.6-1.3-5.6-2.8-5.6zm8.4 0c-1.5 0-2.8 2.5-2.8 5.6s1.3 5.6 2.8 5.6 2.8-2.5 2.8-5.6-1.3-5.6-2.8-5.6z" />
    </svg>
  ),
  Ford: (
    <svg viewBox="0 0 60 28" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="30" cy="14" rx="28" ry="12" fill="#002C6C" stroke="#A4B8D1" strokeWidth="1.5" />
      <text x="30" y="19" fill="#FFFFFF" fontSize="13" fontWeight="900" fontStyle="italic" fontFamily="serif" textAnchor="middle">Ford</text>
    </svg>
  ),
  'Mercedes-Benz': (
    <svg viewBox="0 0 40 40" className="w-full h-full text-current" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M20 3 L22 18 L35 29 L20 20 L5 29 L18 18 Z" fill="currentColor" />
    </svg>
  ),
  Jeep: (
    <svg viewBox="0 0 54 22" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <text x="27" y="17" fill="currentColor" fontSize="17" fontWeight="900" fontFamily="sans-serif" letterSpacing="0.5" textAnchor="middle">Jeep</text>
    </svg>
  ),
  BMW: (
    <svg viewBox="0 0 40 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="20" cy="20" r="19" fill="#1A1A1A" stroke="#888" strokeWidth="1" />
      <circle cx="20" cy="20" r="13" fill="#FFFFFF" />
      <path d="M20 7 A13 13 0 0 1 33 20 L20 20 Z" fill="#0066B1" />
      <path d="M20 33 A13 13 0 0 1 7 20 L20 20 Z" fill="#0066B1" />
      <text x="20" y="6" fill="#FFFFFF" fontSize="4.2" fontWeight="bold" textAnchor="middle">BMW</text>
    </svg>
  ),
  Audi: (
    <svg viewBox="0 0 64 24" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="13" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="25" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="37" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <circle cx="49" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  ),
};

const ROW_ONE_BRANDS = [
  { name: 'Toyota' },
  { name: 'Ford' },
  { name: 'Mercedes-Benz' },
  { name: 'Jeep' },
  { name: 'BMW' },
  { name: 'Audi' },
];

const ROW_TWO_BRANDS = [
  { name: 'Audi' },
  { name: 'BMW' },
  { name: 'Jeep' },
  { name: 'Mercedes-Benz' },
  { name: 'Ford' },
  { name: 'Toyota' },
];

// Clean Brand Card: Shows ONLY Brand Logo and Brand Name
const BrandCard = ({ brand, onClick }) => (
  <div
    onClick={() => onClick(brand.name)}
    className="group relative flex items-center gap-2.5 px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-xl bg-white border border-[#EAEAEA] hover:border-brand-primary shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer min-w-[125px] sm:min-w-[140px] select-none shrink-0"
  >
    {/* Subtle Hover Ambient Glow */}
    <div className="absolute inset-0 rounded-xl bg-brand-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

    {/* Brand Logo Container */}
    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#F8F8FA] border border-[#ECECF2] flex items-center justify-center p-1 group-hover:scale-110 group-hover:bg-white text-gray-800 group-hover:text-brand-primary transition-all duration-300 shrink-0">
      {BRAND_ICONS[brand.name]}
    </div>

    {/* Brand Name Only */}
    <span className="text-xs sm:text-sm font-black text-[#151515] group-hover:text-brand-primary transition-colors tracking-tight whitespace-nowrap">
      {brand.name}
    </span>
  </div>
);

const BrandMarquee = ({ onSelectBrand }) => {
  const navigate = useNavigate();

  const handleBrandClick = (brandName) => {
    if (onSelectBrand) {
      onSelectBrand(brandName);
    } else {
      navigate(`/vehicles?brand=${encodeURIComponent(brandName)}`);
    }
  };

  // Duplicate arrays to create continuous infinite loops
  const rowOneItems = [...ROW_ONE_BRANDS, ...ROW_ONE_BRANDS, ...ROW_ONE_BRANDS, ...ROW_ONE_BRANDS];
  const rowTwoItems = [...ROW_TWO_BRANDS, ...ROW_TWO_BRANDS, ...ROW_TWO_BRANDS, ...ROW_TWO_BRANDS];

  return (
    <section className="w-full py-5 sm:py-6 bg-[#FAFAFC] border-y border-[#ECECF2] overflow-hidden relative">
      {/* Edge Gradient Fades for Smooth Infinite Illusion */}
      <div className="absolute top-0 bottom-0 left-0 w-12 sm:w-24 bg-gradient-to-r from-[#FAFAFC] to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-12 sm:w-24 bg-gradient-to-l from-[#FAFAFC] to-transparent z-10 pointer-events-none" />

      {/* Header Info */}
      <div className="container-fluid mb-3.5 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary text-[11px] font-bold uppercase tracking-wider mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Premier Automotive Fleet</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-[#151515] font-heading">
          Featured Global Automakers
        </h3>
        <p className="text-[11px] text-[#777777] mt-0.5">
          Select any brand to instantly explore world-class engineering & self-drive rentals
        </p>
      </div>

      {/* ==================== LINE 1: GOES RIGHT TO LEFT (←) ==================== */}
      <div className="overflow-hidden mb-2.5 flex">
        <div className="animate-marquee-rtl flex items-center gap-2.5">
          {rowOneItems.map((brand, idx) => (
            <BrandCard
              key={`row1-${brand.name}-${idx}`}
              brand={brand}
              onClick={handleBrandClick}
            />
          ))}
        </div>
      </div>

      {/* ==================== LINE 2: GOES LEFT TO RIGHT (→) ==================== */}
      <div className="overflow-hidden flex">
        <div className="animate-marquee-ltr flex items-center gap-2.5">
          {rowTwoItems.map((brand, idx) => (
            <BrandCard
              key={`row2-${brand.name}-${idx}`}
              brand={brand}
              onClick={handleBrandClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandMarquee;
