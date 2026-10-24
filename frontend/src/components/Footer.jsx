import React from 'react';
import { Link } from 'react-router-dom';
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
      <div className="border-b border-[#EAEAEA] py-8">
        <div className="container-fluid">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Address */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                <MapPin className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#151515] block uppercase tracking-wider">
                  Address
                </span>
                <p className="text-sm text-[#777777]">
                  Oxford Ave. Cary, NC 27511
                </p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                <Mail className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#151515] block uppercase tracking-wider">
                  Email
                </span>
                <a
                  href="mailto:support@carrental.com"
                  className="text-sm text-[#777777] hover:text-brand-primary transition-colors"
                >
                  support@carrental.com
                </a>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                <Phone className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#151515] block uppercase tracking-wider">
                  Phone
                </span>
                <a
                  href="tel:+5375476401"
                  className="text-sm text-[#777777] hover:text-brand-primary transition-colors"
                >
                  +537 547-6401
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-fluid py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1: Logo & Company Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-[#151515] tracking-tight">
                Car Rental
              </span>
            </Link>

            <p className="text-sm text-[#777777] leading-relaxed max-w-sm">
              Faucibus facilisis pellentesque dictum turpis. Ut pellentesque turpis viverra a id laoreet tortor. Experience the finest cars and scooties on the road.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 fill-current" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4 fill-current" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#F8F8FA] border border-[#EAEAEA] flex items-center justify-center text-gray-600 hover:bg-brand-primary hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#151515] uppercase tracking-wider">
              Useful links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about-us" className="hover:text-brand-primary transition-colors">
                  About us
                </Link>
              </li>
              <li>
                <Link to="/contact-us" className="hover:text-brand-primary transition-colors">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/vehicles" className="hover:text-brand-primary transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="hover:text-brand-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Vehicles */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#151515] uppercase tracking-wider">
              Vehicles
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/vehicles?type=Sedan" className="hover:text-brand-primary transition-colors">
                  Sedan
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Cabriolet" className="hover:text-brand-primary transition-colors">
                  Cabriolet
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Pickup" className="hover:text-brand-primary transition-colors">
                  Pickup
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=Minivan" className="hover:text-brand-primary transition-colors">
                  Minivan
                </Link>
              </li>
              <li>
                <Link to="/vehicles?type=SUV" className="hover:text-brand-primary transition-colors">
                  SUV
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Download App */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#151515] uppercase tracking-wider">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              {/* App Store button */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors w-fit shadow-sm"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1 .08 2.03-.49 2.66-1.24z"/>
                </svg>
                <div className="text-left">
                  <span className="block text-[10px] leading-none uppercase text-gray-300">
                    Download on the
                  </span>
                  <span className="text-xs font-bold leading-tight">App Store</span>
                </div>
              </a>

              {/* Google Play button */}
              <a
                href="#"
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-black text-white hover:bg-gray-800 transition-colors w-fit shadow-sm"
              >
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a1.95 1.95 0 0 1-.22-.387V2.2c.067-.137.142-.267.22-.386zm11.3 11.302l2.304 2.304-12.06 6.848 9.756-9.152zm2.984-1.696c.607.348.987.979.987 1.68s-.38 1.332-.987 1.68l-2.072 1.177-2.6-2.6 2.6-2.6 2.072 1.177zM5.153 3.036l12.06 6.848-2.304 2.304-9.756-9.152z"/>
                </svg>
                <div className="text-left">
                  <span className="block text-[10px] leading-none uppercase text-gray-300">
                    Get it on
                  </span>
                  <span className="text-xs font-bold leading-tight">Google Play</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div className="border-t border-[#EAEAEA] py-6 text-center text-xs text-[#777777]">
        <div className="container-fluid flex flex-col sm:flex-row items-center justify-between gap-3">
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
