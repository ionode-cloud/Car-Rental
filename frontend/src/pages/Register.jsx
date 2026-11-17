import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Car,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  X,
  Zap,
  Check,
} from 'lucide-react';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    if (!formData.agreedToTerms) {
      return setError('You must agree to the Terms & Conditions and Privacy Policy.');
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      const destination = getReturnPath();
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-black/10 overflow-hidden my-auto grid grid-cols-1 md:grid-cols-12 min-h-[520px] max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* =========================================================
            LEFT COLUMN: HIGH QUALITY IMAGE & PREMIUM FLEET SHOWCASE
            ========================================================= */}
        <div className="md:col-span-5 relative hidden md:flex flex-col justify-between p-7 sm:p-8 overflow-hidden bg-gray-900 text-white select-none">
          {/* Background Image with Dark Vignette */}
          <img
            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1200&auto=format&fit=crop"
            alt="Luxury EV Fleet"
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
              100% Electric
            </span>
          </div>

          {/* Center Stage: Hero Copy & Feature Badges */}
          <div className="relative z-10 my-auto py-6 space-y-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-1">
                Fast & Seamless Rental
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight text-white font-heading">
                Drive the Future Today.
              </h2>
              <p className="text-xs text-gray-200 mt-2 leading-relaxed">
                Unlock instant access to verified self-drive electric vehicles with zero hidden fees.
              </p>
            </div>

            {/* Feature Bullets */}
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">100% No Security Deposit (₹0)</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-brand-primary flex items-center justify-center text-white shrink-0 shadow-xs">
                  <Zap className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">Flexible 4h to Multi-Day Bookings</span>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-gray-100 bg-white/10 backdrop-blur-xs px-3.5 py-2.5 rounded-xl border border-white/10">
                <div className="w-5 h-5 rounded-md bg-indigo-500 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs">24/7 Verified Roadside Assistance</span>
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
            RIGHT COLUMN: SIGN UP FORM & CONTROLS
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
              Create Customer Account
            </h1>
            <p className="text-xs text-[#777777] mt-0.5">
              Sign up in 30 seconds to proceed with your booking.
            </p>
          </div>

          {/* Contextual Notice Banner (e.g. redirected from booking) */}
          {redirectMessage && (
            <div className="mb-3.5 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs flex items-center gap-2.5 shadow-2xs">
              <UserPlus className="w-4 h-4 shrink-0 text-amber-600" />
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

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Full Name */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Aarav Sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* Email & Phone (Grid 2-col on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm Password (Grid 2-col on sm) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Min 6 characters"
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

              <div>
                <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#F8F8FA] border border-gray-200 text-[#151515] font-semibold text-xs focus:outline-none focus:border-brand-primary focus:bg-white focus:ring-1 focus:ring-brand-primary/20 transition-all shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer p-1"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="popupAgreedToTerms"
                name="agreedToTerms"
                checked={formData.agreedToTerms}
                onChange={handleChange}
                className="mt-0.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
              />
              <label htmlFor="popupAgreedToTerms" className="text-[11px] text-gray-600 leading-tight cursor-pointer select-none">
                I agree to RideVista Mobility's{' '}
                <Link to="/contact-us" className="text-brand-primary underline font-semibold">
                  Terms & Conditions
                </Link>{' '}
                and Privacy Policy.
              </label>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl btn-theme-gradient shine-sweep text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Footer: Switch to Sign In */}
          <div className="pt-4 border-t border-gray-100 mt-4 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Already have an account?{' '}
              <Link
                to="/login"
                state={{ from: returnTarget, message: redirectMessage }}
                className="font-bold text-brand-primary hover:underline ml-1"
              >
                Sign In &rarr;
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export default Register;
