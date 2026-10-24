import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

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
    <header className="sticky top-0 left-0 right-0 z-50 bg-white border-b border-[#EAEAEA] shadow-sm">
      <div className="container-fluid">
        <div className="flex items-center justify-between h-20">
          {/* Left: Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#151515]">
                Car Rental
              </span>
              <span className="text-[10px] text-[#777777] font-semibold -mt-1 tracking-wider uppercase">
                RideVista Mobility
              </span>
            </div>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-semibold rounded-lg transition-all ${
                    isActive
                      ? 'text-brand-primary bg-brand-primaryLight'
                      : 'text-[#151515] hover:text-brand-primary hover:bg-[#F8F8FA]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right: Theme Switcher / Phone / User / Action */}
          <div className="hidden md:flex items-center gap-3 lg:gap-4">
            {/* Theme Switcher */}
            <ThemeSwitcher compact />

            {/* Phone Call Pill */}
            <a
              href="tel:+5375476401"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-brand-primaryLight hover:bg-brand-primaryLightHover transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center text-white">
                <Phone className="w-3.5 h-3.5 fill-current" />
              </div>
              <div className="text-left hidden lg:block">
                <span className="text-[10px] text-[#777777] font-bold block uppercase tracking-wider leading-none">
                  Need Help?
                </span>
                <span className="text-xs font-bold text-[#151515] leading-tight">
                  +537 547-6401
                </span>
              </div>
            </a>

            {/* User Dropdown or Login */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#EAEAEA] hover:border-brand-primary transition-all bg-white"
                >
                  <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-[#151515] max-w-[100px] truncate">
                    {user?.name || 'Account'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white border border-[#EAEAEA] rounded-xl shadow-xl py-2 z-50">
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
                        className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-brand-primary hover:bg-brand-primaryLight"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/my-account"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-xs text-[#151515] hover:bg-[#F8F8FA]"
                    >
                      <CalendarCheck className="w-3.5 h-3.5 text-gray-400" />
                      My Bookings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 text-left border-t border-[#EAEAEA] mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
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
            <Link
              to="/vehicles"
              className="px-4 py-2 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white text-xs font-semibold tracking-wide transition-all shadow-sm"
            >
              Book Your Car
            </Link>
          </div>

          {/* Mobile menu button and quick theme switcher */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeSwitcher compact />
            <Link
              to="/vehicles"
              className="px-3 py-1.5 rounded-lg bg-brand-primary text-white text-xs font-semibold"
            >
              Book
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-700 hover:text-black hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#EAEAEA] px-4 pt-3 pb-6 space-y-3">
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
                  `block px-3 py-2 text-sm font-semibold rounded-lg ${
                    isActive
                      ? 'text-brand-primary bg-brand-primaryLight'
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
        </div>
      )}
    </header>
  );
};

export default Navbar;
