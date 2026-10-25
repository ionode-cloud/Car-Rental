import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  X,
  CheckCircle2,
  ChevronDown,
  Quote,
  Phone,
  ArrowRight,
  ShieldCheck,
  Award,
  Users,
} from 'lucide-react';

const FAQ_ITEMS = [
  {
    q: 'How does it work?',
    a: 'Choose your desired vehicle, select your pickup date and time, complete our quick online verification, and pick up your keys from any hub or opt for doorstep delivery.',
  },
  {
    q: 'Can I rent a car without a credit card?',
    a: 'Yes, we accept debit cards, UPI, net banking, and verified digital payment options along with a refundable security deposit.',
  },
  {
    q: 'What are the requirements for renting a car?',
    a: 'You must be at least 21 years old and hold a valid, non-provisional Driving License and a government-issued photo ID (Passport/Aadhaar/National ID).',
  },
  {
    q: 'Does car rental allow me to travel outside the city?',
    a: 'Absolutely! All our rentals feature all-India interstate tourist permits so you can drive freely across borders without hassle.',
  },
  {
    q: 'Can I rent a car for multiple days?',
    a: 'Yes, we provide hourly, daily, weekly, and monthly long-term subscription packages with discounted tier rates.',
  },
];

const REVIEWS = [
  {
    name: 'Emanuel Raps',
    car: 'BMW 3 Series',
    text: 'Ut aliquet sapien et sapien pellentesque dictum turpis. Ut pellentesque turpis viverra a id laoreet tortor. Amazing ride quality and spotless vehicle condition!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    name: 'Peter Evans',
    car: 'Mercedes C-Class',
    text: 'Faucibus facilisis pellentesque dictum turpis. Ut pellentesque turpis viverra a id laoreet tortor. Effortless booking and key pickup at the airport!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
  {
    name: 'Ryder Malone',
    car: 'Porsche Taycan',
    text: 'Quam neque odio urna euismod felis. Eget feugiat magna in quisque fermentum tellus morbi egestas. Exceptional customer service and road safety.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop',
    rating: 5,
  },
];

const AboutUs = () => {
  const [openFaq, setOpenFaq] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-white text-[#151515] w-full">
      {/* ==================== 1. FULL WIDTH HEADER ==================== */}
      <div className="w-full bg-[#F8F8FA] border-b border-[#EAEAEA] py-10 mb-12 rounded-none">
        <div className="container-fluid text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151515] font-heading">
            About Us
          </h1>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            <Link to="/" className="hover:text-brand-primary">Home</Link> / About Us
          </p>
        </div>
      </div>

      {/* Two-Column Intro */}
      <section className="container-fluid mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start"
        >
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#151515] font-heading leading-tight">
              Where every drive feels extraordinary
            </h2>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm text-[#777777]">
            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <h3 className="text-sm sm:text-base font-bold text-[#151515] mb-1.5">Variety Brands</h3>
              <p className="leading-relaxed">
                Extensive collection of world-class automobiles, executive luxury sedans, rugged off-road SUVs, and nimble electric city scooties.
              </p>
            </motion.div>

            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <h3 className="text-sm sm:text-base font-bold text-[#151515] mb-1.5">Awesome Support</h3>
              <p className="leading-relaxed">
                Dedicated 24/7 concierge assistance, roadside mechanical support, and replacement vehicle guarantees anywhere across your itinerary.
              </p>
            </motion.div>

            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <h3 className="text-sm sm:text-base font-bold text-[#151515] mb-1.5">Maximum Freedom</h3>
              <p className="leading-relaxed">
                Self-drive independence with transparent unlimited kilometer options, zero paperwork roadblocks, and instant app verification.
              </p>
            </motion.div>

            <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 300 }}>
              <h3 className="text-sm sm:text-base font-bold text-[#151515] mb-1.5">Flexibility On The Go</h3>
              <p className="leading-relaxed">
                Modify travel dates, alter pickup points, or extend rental durations effortlessly through our modern web and mobile platform.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ==================== 2. FULL WIDTH VIDEO SECTION ==================== */}
      <section className="w-full mb-16 overflow-hidden rounded-none shadow-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden aspect-[21/9] sm:aspect-[16/7] bg-gray-900 group rounded-none"
        >
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1600&auto=format&fit=crop"
            alt="Car on Highway"
            className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
          />

          {/* Centered Play Button with Pulsing Radar Rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-brand-primary"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.35, 0, 0.35] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
                className="absolute inset-0 rounded-full bg-brand-primary"
              />
              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.92 }}
                onClick={() => setVideoModalOpen(true)}
                className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-brand-primary hover:bg-brand-primaryHover text-white flex items-center justify-center shadow-2xl transition-all ring-8 ring-white/30"
                aria-label="Play Video"
              >
                <Play className="w-8 h-8 sm:w-10 sm:h-10 fill-current ml-1" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Video Modal with Framer Motion AnimatePresence */}
      <AnimatePresence>
        {videoModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              <button
                onClick={() => setVideoModalOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/40 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <div className="aspect-video">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                  title="Car Rental Experience Reel"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==================== 3. STATISTICS ==================== */}
      <section className="container-fluid mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-10 border-y border-[#EAEAEA]"
        >
          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-primary">
              20k+
            </span>
            <p className="text-xs sm:text-sm text-[#777777] font-semibold mt-1 uppercase tracking-wider">
              Happy customers
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-primary">
              540+
            </span>
            <p className="text-xs sm:text-sm text-[#777777] font-semibold mt-1 uppercase tracking-wider">
              Count of cars
            </p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
            <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-primary">
              25+
            </span>
            <p className="text-xs sm:text-sm text-[#777777] font-semibold mt-1 uppercase tracking-wider">
              Years of experience
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== 4. BENEFITS SECTION ==================== */}
      <section className="container-fluid mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-6"
          >
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#151515] font-heading leading-tight">
              Unlock unforgettable memories on the road
            </h2>
            <p className="text-sm sm:text-base text-[#777777] leading-relaxed">
              We empower drivers with meticulously maintained vehicles, transparent all-inclusive quotes, and effortless smartphone booking.
            </p>

            <div className="space-y-3.5 pt-2">
              {[
                'Pristine safety inspections before every departure',
                'Instant key pickup at terminals and train hubs',
                'Zero hidden extras, honest fuel replacement rules',
                '24/7 dedicated support phone line',
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ x: 6 }}
                  className="flex items-center gap-3 cursor-default"
                >
                  <div className="w-5 h-5 rounded-full bg-brand-primary text-white flex items-center justify-center shrink-0 shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-[#151515]">
                    {benefit}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6"
          >
            <div className="rounded-3xl overflow-hidden aspect-[16/10] bg-gray-100 shadow-xl group">
              <img
                src="https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=1400&auto=format&fit=crop"
                alt="Driving Experience"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== 6. CUSTOMER REVIEWS ==================== */}
      <section className="container-fluid mb-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading">
            Reviews from our customers
          </h2>
          <p className="text-xs sm:text-sm text-[#777777] mt-1">
            Real stories from travelers who explored the roads with RideVista
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {REVIEWS.map((rev, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: '0 20px 30px -10px rgba(0,0,0,0.08)' }}
              className="p-6 sm:p-8 rounded-2xl bg-[#F8F8FA] border border-[#EAEAEA] flex flex-col justify-between shadow-sm transition-colors hover:border-brand-primary/30"
            >
              <div>
                <Quote className="w-8 h-8 text-brand-primary mb-3 opacity-60" />
                <p className="text-xs sm:text-sm text-[#777777] leading-relaxed mb-6">
                  "{rev.text}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-[#EAEAEA]">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-primary"
                />
                <div>
                  <h4 className="text-sm font-bold text-[#151515]">{rev.name}</h4>
                  <p className="text-xs text-[#777777]">{rev.car}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ==================== 7. TOP CAR RENTAL FAQ WITH ANIMATED ACCORDION ==================== */}
      <section className="container-fluid mb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#151515] font-heading">
              Top Car Rental Questions
            </h2>
            <p className="text-xs sm:text-sm text-[#777777] mt-1">
              Everything you need to know before booking your ride
            </p>
          </div>

          <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-[#EAEAEA] bg-white overflow-hidden transition-all shadow-sm hover:border-brand-primary/40"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#151515] hover:text-brand-primary transition-colors"
                  >
                    <span>{item.q}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown
                        className={`w-4 h-4 transition-colors ${
                          isOpen ? 'text-brand-primary' : 'text-gray-500'
                        }`}
                      />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#777777] leading-relaxed border-t border-gray-100 pt-3">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== 8. FULL WIDTH CTA BANNER ==================== */}
      <section className="w-full bg-brand-primary text-white py-12 lg:py-16 rounded-none shadow-xl relative overflow-hidden">
        <div className="container-fluid flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="space-y-3">
            <h3 className="text-2xl sm:text-4xl font-extrabold font-heading">
              Looking for a car?
            </h3>
            <p className="text-base sm:text-lg font-bold text-white/90">
              +537 547-6401
            </p>
            <p className="text-xs sm:text-sm text-white/80 max-w-lg leading-relaxed">
              Speak directly with our concierge team or book instantly through our self-service portal.
            </p>

            <div className="pt-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                <Link
                  to="/vehicles"
                  className="inline-block px-7 py-3.5 rounded-xl bg-white text-brand-primary hover:bg-gray-100 font-bold text-xs sm:text-sm tracking-wide shadow-md transition-all"
                >
                  Book Now
                </Link>
              </motion.div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="shrink-0 max-w-md"
          >
            <img
              src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=600&auto=format&fit=crop"
              alt="Call to action car"
              className="w-full object-contain drop-shadow-xl"
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
