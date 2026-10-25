import React, { useState, useEffect } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import ThemeSwitcher from '../components/ThemeSwitcher';
import {
  LayoutDashboard,
  Car,
  PlusCircle,
  CalendarCheck,
  Users,
  CreditCard,
  Package,
  Wrench,
  Star,
  MessageSquare,
  BarChart3,
  Settings,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminSearch, setAdminSearch] = useState('');

  // Lock body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Vehicles', path: '/admin/vehicles', icon: Car },
    { name: 'Add Vehicle', path: '/admin/vehicles/add', icon: PlusCircle },
    { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Payments', path: '/admin/payments', icon: CreditCard },
    { name: 'Packages', path: '/admin/packages', icon: Package },
    { name: 'Services', path: '/admin/services', icon: Wrench },
    { name: 'Reviews', path: '/admin/reviews', icon: Star },
    { name: 'Contact Inquiries', path: '/admin/contacts', icon: MessageSquare },
    { name: 'Reports & Export', path: '/admin/reports', icon: BarChart3 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
    { name: 'Admin Profile', path: '/admin/profile', icon: ShieldCheck },
  ];

  const filteredMenuItems = adminSearch.trim()
    ? menuItems.filter((item) => item.name.toLowerCase().includes(adminSearch.toLowerCase()))
    : menuItems;

  return (
    <div className="min-h-screen bg-brand-black text-white flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-brand-dark border-r border-white/10 shrink-0 select-none">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl theme-hero-gradient flex items-center justify-center text-white shadow-primary-glow font-bold">
            <Car className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight">
              RIDE<span className="text-brand-primary">VISTA</span>
            </span>
            <span className="block text-[10px] font-bold text-gray-400 tracking-widest uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-brand-primary text-white shadow-primary-glow'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Logout & Live Site Link */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 w-full transition-colors"
          >
            <span>View Public Website</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 w-full text-left transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-14 sm:h-16 bg-brand-dark/90 backdrop-blur-md border-b border-white/10 px-3.5 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="min-w-0">
              <span className="hidden md:inline-block text-xs font-bold text-gray-400 uppercase tracking-widest truncate">
                Fleet Operations & Intelligence Console
              </span>
              <span className="inline-block md:hidden text-xs font-extrabold text-white truncate">
                Admin Console
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
            <ThemeSwitcher compact />
            <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-brand-primary font-bold text-xs shrink-0">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-brand-primary uppercase font-bold leading-none">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* ========================================================
            SLIDE-IN SIDEBAR DRAWER (RIGHT TO LEFT - WHITE BACKGROUND)
            ======================================================== */}
        <AnimatePresence>
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
              {/* Dimmed Blurred Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                onClick={() => setSidebarOpen(false)}
              />

              {/* White Floating Sidebar Drawer sliding in Right-to-Left */}
              <motion.aside
                initial={{ x: '100%', opacity: 0.9 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 290 }}
                className="relative z-10 w-[295px] max-w-[85vw] h-[calc(100vh-24px)] my-auto mr-3 bg-white text-[#151515] rounded-3xl border border-black/10 shadow-2xl flex flex-col p-4 overflow-hidden"
              >
                {/* Top Header: Brand Icon, Name, Subtitle, and Round Chevron Collapse Button */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-brand-primary flex items-center justify-center text-white shadow-md shadow-brand-primary/30 shrink-0 font-black">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm font-black text-[#151515] tracking-tight leading-tight truncate font-heading">
                        {user?.name || 'Admin'}
                      </h2>
                      <p className="text-[11px] text-brand-primary font-bold uppercase tracking-wider truncate mt-0.5">
                        Super Admin
                      </p>
                    </div>
                  </div>

                  {/* Round Chevron Collapse Button matching Reference Image (closes to the right) */}
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors shrink-0"
                    aria-label="Close sidebar"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Search Bar matching Reference Image with White Theme */}
                <div className="mb-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="w-full bg-[#F5F6F8] border border-gray-200 rounded-2xl pl-10 pr-3.5 py-2.5 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Navigation Items List with Active Highlights */}
                <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar py-1">
                  {filteredMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
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
                  {filteredMenuItems.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-4">No menu items found</p>
                  )}
                </nav>

                {/* Bottom Section: Public Site Link, Logout, and Theme Mode Toggle matching Reference Image */}
                <div className="pt-3 border-t border-gray-100 space-y-2.5 mt-auto">
                  <Link
                    to="/"
                    target="_blank"
                    className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-[#F5F6F8] hover:bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-800 transition-colors"
                  >
                    <span>View Public Website</span>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setSidebarOpen(false);
                    }}
                    className="flex items-center gap-3.5 px-3.5 py-2 rounded-2xl text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 w-full text-left transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" />
                    <span>Logout</span>
                  </button>

                  {/* Theme Mode Toggle matching bottom card in Reference Image with White Theme */}
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

        {/* Main Content Body */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 overflow-y-auto w-full max-w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
