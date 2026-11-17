import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Car,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  X,
  Zap,
  Check,
} from 'lucide-react';

const SignIn = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract return destination and message if redirected from booking/protected route
  const returnTarget = location.state?.from;
  const redirectMessage = location.state?.message;

  const getReturnPath = () => {
    if (!returnTarget) return '/my-account';
    if (typeof returnTarget === 'string') return returnTarget;
    if (returnTarget.pathname) {
      return `${returnTarget.pathname}${returnTarget.search || ''}${returnTarget.hash || ''}`;
    }
    return '/my-account';
  };

  // Handle ESC key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent background body scroll while popup is open
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);

      // Smart Role-Based Redirection
      if (user.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        const dest = getReturnPath();
        if (dest && dest !== '/' && dest !== '/login' && dest !== '/signin') {
          navigate(dest, { replace: true });
        } else {
          navigate('/my-account', { replace: true });
        }
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    } finally {
      setLoading(false);
    }
  };

  // Demo auto-fill helpers for effortless testing
  const fillAdminCredentials = () => {
    setEmail('admin@ridevista.com');
    setPassword('Admin@12345');
    setError('');
  };

  const fillCustomerCredentials = () => {
    setEmail('customer@ridevista.com');
    setPassword('Customer@12345');
    setError('');
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-6 bg-black/65 backdrop-blur-md overflow-y-auto">
      {/* Click outside to close backdrop */}
      <div
        className="fixed inset-0 -z-10"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Main Modal Popup Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 14 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 14 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12 min-h-[480px] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            LEFT COLUMN: HIGH QUALITY IMAGE & PREMIUM FLEET SHOWCASE
            ========================================================= */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-7 sm:p-8 overflow-hidden bg-gray-900 text-white select-none">
          {/* Background Image with Dark Vignette */}
          <img
            src="https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=1200&auto=format&fit=crop"
            alt="Luxury EV Rental"
            className="absolute inset-0 w-full h-full object-cover object-center filter brightness-[0.72] contrast-[1.08] transition-transform duration-1000 hover:scale-105"
          />

          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />

          {/* Top Stage: Brand Badge */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-xs">
              <Car className="w-3.5 h-3.5 text-brand-primary" />
              <span>RideVista Mobility</span>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-brand-primary text-white text-[10px] font-extrabold uppercase tracking-wider shadow-xs">
              Self-Drive
            </span>
          </div>

          {/* Center Stage: Hero Copy & Feature Badges */}
          <div className="relative z-10 my-auto py-6 space-y-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                Welcome Back
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white font-heading">
                Sign In to Your Journey.
              </h2>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                Access your bookings, instant rental extensions, and exclusive club benefits.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">Instant Keyless Vehicle Access</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">Paperless Digital Invoices</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">100% Secure & Insured Rentals</span>
              </div>
            </div>
          </div>

          {/* Bottom Stage: Simple Fleet Trust Tag */}
          <div className="relative z-10 pt-3 border-t border-white/15 flex items-center justify-between text-xs text-gray-300">
            <span className="text-[11px] font-semibold text-white/90">Sanitized & GPS-Enabled Fleet</span>
            <span className="text-[10px] text-gray-300 font-medium">Instant Digital Key</span>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: SIGN IN FORM & CONTROLS
            ========================================================= */}
        <div className="md:col-span-7 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto relative bg-white max-h-[88vh] md:max-h-[640px]">
          {/* Close Button (X) */}
          <button
            type="button"
            onClick={handleClose}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-all cursor-pointer shadow-xs"
            title="Close popup (Esc)"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Form Header */}
          <div className="mb-3.5 pr-8">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-brand-primary flex items-center justify-center text-white shadow-xs">
                <Car className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-extrabold tracking-tight text-[#151515]">
                Car Rental
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#151515] font-heading tracking-tight mt-1">
              Sign In to Your Account
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Access your bookings, invoices, or management console.
            </p>
          </div>

          {/* Contextual Notice Banner */}
          {redirectMessage && (
            <div className="mb-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5 shadow-2xs">
              <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600" />
              <span className="font-semibold leading-snug">{redirectMessage}</span>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="mb-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 shadow-2xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] font-semibold text-brand-primary hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl btn-theme-gradient shine-sweep text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Quick Demo Autofill */}
          <div className="mt-4 pt-3.5 border-t border-[#EAEAEA]">
            <p className="text-[10px] font-bold text-center text-[#777777] uppercase tracking-wider mb-2">
              Quick Demo Autofill
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillCustomerCredentials}
                className="py-1.5 px-2.5 rounded-xl bg-brand-primaryLight hover:bg-brand-primaryLightHover text-brand-primary text-xs font-bold transition-colors cursor-pointer"
              >
                Demo Customer
              </button>
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="py-1.5 px-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Demo Admin
              </button>
            </div>
          </div>

          {/* Footer: Switch to Sign Up */}
          <div className="pt-3 border-t border-gray-100 mt-4 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Don't have an account yet?{' '}
              <Link
                to="/register"
                state={{ from: returnTarget, message: redirectMessage }}
                className="font-bold text-brand-primary hover:underline ml-1"
              >
                Create Account &rarr;
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default SignIn;
