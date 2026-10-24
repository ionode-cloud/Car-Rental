import React, { useState } from 'react';
import { NavLink, Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
        <header className="h-16 bg-brand-dark/80 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="hidden sm:inline-block text-xs font-bold text-gray-400 uppercase tracking-widest">
              Fleet Operations & Intelligence Console
            </span>
          </div>

          <div className="flex items-center gap-4">
            <ThemeSwitcher compact />
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
              <div className="w-7 h-7 rounded-full bg-brand-primary/20 border border-brand-primary flex items-center justify-center text-brand-primary font-bold text-xs">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white truncate max-w-[120px]">{user?.name}</p>
                <p className="text-[10px] text-brand-primary uppercase font-bold">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            <div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="relative flex flex-col w-64 max-w-xs bg-brand-dark border-r border-white/10 p-4 z-50 overflow-y-auto">
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                <span className="text-lg font-black text-white">
                  RIDE<span className="text-brand-primary">VISTA</span>
                </span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 flex-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-brand-primary text-white'
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

              <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-xs font-semibold text-red-400 p-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
