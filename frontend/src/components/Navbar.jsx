import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import ThemeSwitcher from './ThemeSwitcher';
import {
  Menu,
  X,
  Car,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  CalendarCheck,
  Phone,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Vehicles', path: '/vehicles' },
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
  ];

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 backdrop-blur-md border-b border-black/5 shadow-xs'
          : 'bg-transparent backdrop-blur-md border-b border-black/5'
      }`}
    >
      <div className="container-fluid">
        <div className="flex items-center justify-between h-14 sm:h-15">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ scale: 1.08 }}
              className="w-8 h-8 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-xs"
            >
              <Car className="w-4 h-4 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight text-[#151515] group-hover:text-brand-primary transition-colors leading-tight">
                Car Rental
              </span>
              <span className="text-[9px] text-[#777777] font-semibold -mt-0.5 tracking-wider uppercase">
                RideVista Mobility
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links with Animated Pill */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `relative px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                    isActive
                      ? 'text-brand-primary font-bold'
                      : 'text-[#151515] hover:text-brand-primary'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute inset-0 bg-brand-primaryLight rounded-lg -z-10"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span>{link.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right: Theme Switcher / Phone / User / Action */}
          <div className="hidden md:flex items-center gap-2.5 lg:gap-3">
            {/* Theme Switcher */}
            <ThemeSwitcher compact />

            {/* Phone Call Pill */}
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="tel:+5375476401"
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-brand-primaryLight hover:bg-brand-primaryLightHover transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-white shadow-xs">
                <Phone className="w-3 h-3 fill-current" />
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[9px] text-[#777777] font-bold block uppercase tracking-wider leading-none">
                  Need Help?
                </span>
                <span className="text-xs font-bold text-[#151515] leading-tight">
                  +537 547-6401
                </span>
              </div>
            </motion.a>

            {/* User Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAEAEA] hover:border-brand-primary transition-all bg-white shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#151515] max-w-[100px] truncate">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.96 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-52 bg-white border border-[#EAEAEA] rounded-2xl shadow-xl py-2 z-50 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-[#EAEAEA]">
                        <p className="text-[11px] text-[#777777]">Signed in as</p>
                        <p className="text-xs font-bold text-[#151515] truncate">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-brand-primaryLight text-brand-primary font-bold uppercase">
                          {user?.role}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-primaryLight transition-colors"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        to="/my-account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-[#151515] hover:bg-[#F8F8FA] transition-colors"
                      >
                        <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
                        My Bookings
                      </Link>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-[#EAEAEA] mt-1 transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-xs font-semibold text-[#151515] hover:text-brand-primary px-2 py-1.5 transition-colors"
              >
                Sign In
              </Link>
            )}

            {/* Book Your Car button */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/vehicles"
                className="px-3.5 py-1.5 rounded-lg btn-theme-gradient shine-sweep text-white text-xs font-bold tracking-wide transition-all shadow-primary-glow inline-block"
              >
                Book Your Car
              </Link>
            </motion.div>
          </div>

          {/* Mobile menu button and quick theme switcher */}
          <div className="flex items-center gap-1.5 md:hidden">
            <ThemeSwitcher compact />
            <Link
              to="/vehicles"
              className="px-2.5 py-1 rounded-md btn-theme-gradient text-white text-xs font-bold shadow-xs"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden bg-white border-b border-[#EAEAEA] px-4 pt-3 pb-6 space-y-3 overflow-hidden"
          >
            {/* Mobile Theme Switcher Bar */}
            <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-brand-primaryLight border border-brand-primaryBorder">
              <span className="text-xs font-bold text-[#151515]">Theme Color</span>
              <ThemeSwitcher />
            </div>

            <nav className="space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                      isActive
                        ? 'text-brand-primary bg-brand-primaryLight font-bold'
                        : 'text-[#151515] hover:bg-[#F8F8FA]'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#EAEAEA] space-y-2">
              <a
                href="tel:+5375476401"
                className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-brand-primaryLight text-xs font-bold text-brand-primary"
              >
                <Phone className="w-4 h-4" />
                <span>Need Help? +537 547-6401</span>
              </a>

              {isAuthenticated ? (
                <div className="space-y-1">
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-xs font-semibold text-brand-primary bg-brand-primaryLight rounded-lg"
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/my-account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center py-2 text-xs font-semibold text-brand-primary border border-brand-primary rounded-xl hover:bg-brand-primaryLight"
                >
                  Sign In / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
