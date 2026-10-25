import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-[#EAEAEA] text-[#777777]">
      {/* Top Contact Strip */}
      <div className="border-b border-[#EAEAEA] py-4 sm:py-5">
        <div className="container-fluid">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Address */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                <MapPin className="w-4 h-4 fill-white/20" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#151515] block uppercase tracking-wider">
                  Address
                </span>
                <p className="text-xs sm:text-sm text-[#777777]">
                  Oxford Ave. Cary, NC 27511
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                <Mail className="w-4 h-4 fill-white/20" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#151515] block uppercase tracking-wider">
                  Email
                </span>
                <a
                  href="mailto:support@carrental.com"
                  className="text-xs sm:text-sm text-[#777777] hover:text-brand-primary transition-colors"
                >
                  support@carrental.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                <Phone className="w-4 h-4 fill-white/20" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#151515] block uppercase tracking-wider">
                  Phone
                </span>
                <a
                  href="tel:+5375476401"
                  className="text-xs sm:text-sm text-[#777777] hover:text-brand-primary transition-colors"
                >
                  +537 547-6401
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-fluid py-8 lg:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
          {/* Col 1: Logo & Company Description */}
          <div className="md:col-span-6 lg:col-span-6 space-y-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-xs">
                <Car className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-xl font-extrabold text-[#151515] tracking-tight">
                Car Rental
              </span>
            </Link>

            <p className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-sm">
              Faucibus facilisis pellentesque dictum turpis. Ut pellentesque turpis viverra a id laoreet tortor. Experience the finest cars and scooties on the road.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-1">
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
                href="#"
                className="w-8 h-8 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-3.5 h-3.5 fill-current" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
                href="#"
                className="w-8 h-8 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-3.5 h-3.5 fill-current" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
                href="#"
                className="w-8 h-8 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5" />
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400 }}
                href="#"
                className="w-8 h-8 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-3.5 h-3.5 fill-current" />
              </motion.a>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#151515] uppercase tracking-wider">
              Useful links
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/about-us" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vehicles */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3">
            <h4 className="text-xs sm:text-sm font-bold text-[#151515] uppercase tracking-wider">
              Vehicles
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/vehicles?type=Sedan" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Sedan
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Cabriolet" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Cabriolet
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Pickup" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Pickup
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Minivan" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  Minivan
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=SUV" className="inline-block hover:text-brand-primary hover:translate-x-1 transition-all">
                  SUV
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-[#EAEAEA] py-3.5 sm:py-4 text-center text-xs text-[#777777]">
        <div className="container-fluid flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <p>© Copyright Car Rental 2026. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs">
            <Link to="/about-us" className="hover:text-brand-primary">
              Privacy Policy
            </Link>
            <Link to="/contact-us" className="hover:text-brand-primary">
              Terms of Service
            </Link>
            <Link to="/contact-us" className="hover:text-brand-primary">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
