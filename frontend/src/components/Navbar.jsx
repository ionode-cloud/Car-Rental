import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
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
  Home,
  Info,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogIn,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState('');
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

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    await logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const handleMobileSearch = (e) => {
    e.preventDefault();
    if (mobileSearch.trim()) {
      navigate(`/vehicles?search=${encodeURIComponent(mobileSearch.trim())}`);
      setMobileSearch('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Vehicles', path: '/vehicles', icon: Car },
    { name: 'About Us', path: '/about-us', icon: Info },
    { name: 'Contact Us', path: '/contact-us', icon: Phone },
  ];

  return (
    <>
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/90 backdrop-blur-md border-b border-black/5 shadow-xs'
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

            {/* Right: Theme Switcher / Phone / User / Action (Desktop) */}
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

            {/* Mobile: Quick CTA + 3-Bar Hamburger Button */}
            <div className="flex items-center gap-2 md:hidden">
              <Link
                to="/vehicles"
                className="px-3 py-1.5 rounded-xl btn-theme-gradient text-white text-xs font-bold shadow-xs"
              >
                Book Car
              </Link>

              {/* 3-Bar Hamburger Trigger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#151515] transition-colors"
                aria-label="Open mobile menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          SLIDE-IN SIDEBAR DRAWER (RIGHT TO LEFT - WHITE BACKGROUND)
          ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Dimmed Blurred Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* White Floating Sidebar Drawer sliding in Right-to-Left */}
            <motion.aside
              initial={{ x: '100%', opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 290 }}
              className="relative z-10 w-[295px] max-w-[85vw] h-[calc(100vh-24px)] my-auto mr-3 bg-white text-[#151515] rounded-3xl border border-black/10 shadow-2xl flex flex-col p-4 overflow-hidden"
            >
              {/* Top Header: Brand Icon, Name, Subtitle, and Round Collapse Button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/30 shrink-0 font-black">
                    <Car className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-black text-[#151515] tracking-tight leading-tight truncate font-heading">
                      {isAuthenticated ? user?.name || 'Customer' : 'Car Rental'}
                    </h2>
                    <p className="text-[11px] text-gray-500 font-medium truncate mt-0.5">
                      {isAuthenticated ? user?.email || 'RideVista Member' : 'RideVista Mobility'}
                    </p>
                  </div>
                </div>

                {/* Round Chevron Collapse Button matching Reference Image (closes to the right) */}
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors shrink-0"
                  aria-label="Close sidebar"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar matching Reference Image with White Theme */}
              <form onSubmit={handleMobileSearch} className="mb-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={mobileSearch}
                    onChange={(e) => setMobileSearch(e.target.value)}
                    className="w-full bg-[#F5F6F8] border border-gray-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all font-medium"
                  />
                </div>
              </form>

              {/* Navigation Items List with Active Highlights */}
              <nav className="flex-1 space-y-1.5 overflow-y-auto no-scrollbar py-1">
                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/25 font-bold'
                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}

                {/* Account / Dashboard Links */}
                {isAuthenticated && (
                  <>
                    <div className="pt-2 pb-1">
                      <div className="h-[1px] bg-gray-100" />
                    </div>

                    <NavLink
                      to="/my-account"
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/25'
                            : 'text-gray-600 hover:text-black hover:bg-gray-100'
                        }`
                      }
                    >
                      <CalendarCheck className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>My Bookings</span>
                    </NavLink>

                    {isAdmin && (
                      <NavLink
                        to="/admin/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition-all ${
                            isActive
                              ? 'bg-brand-primary text-white font-bold shadow-md shadow-brand-primary/25'
                              : 'text-gray-600 hover:text-black hover:bg-gray-100'
                          }`
                        }
                      >
                        <LayoutDashboard className="w-4 h-4 shrink-0 text-amber-600" />
                        <span>Admin Dashboard</span>
                      </NavLink>
                    )}
                  </>
                )}
              </nav>

              {/* Bottom Section: Logout + Theme Mode Switch */}
              <div className="pt-3 border-t border-gray-100 space-y-2.5 mt-auto">
                {isAuthenticated ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-brand-primary hover:bg-brand-primaryLight w-full transition-colors"
                  >
                    <LogIn className="w-4 h-4 shrink-0" />
                    <span>Sign In / Register</span>
                  </Link>
                )}

                {/* Theme Mode Toggle with White Theme styling */}
                <div
                  onClick={() => setTheme(theme === 'orange' ? 'purple' : 'orange')}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-[#F5F6F8] hover:bg-gray-100 border border-gray-200 cursor-pointer transition-colors select-none"
                  title="Toggle App Theme"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-xs border border-gray-200 flex items-center justify-center text-amber-500">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      {theme === 'orange' ? 'Orange Theme' : 'Purple Theme'}
                    </span>
                  </div>

                  {/* Toggle Pill Switch */}
                  <div
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-300 flex items-center ${
                      theme === 'purple' ? 'bg-[#5935E8]' : 'bg-[#FF6600]'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`w-5 h-5 rounded-full bg-white shadow-md ${
                        theme === 'purple' ? 'ml-auto' : 'mr-auto'
                      }`}
                    />
                  </div>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
