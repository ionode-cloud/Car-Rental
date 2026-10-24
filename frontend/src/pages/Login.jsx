import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Car,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract return destination if redirected from a protected route
  const from = location.state?.from?.pathname || '/';

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
        if (from && from !== '/' && from !== '/login') {
          navigate(from, { replace: true });
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

  return (
    <div className="min-h-screen bg-[#F8F8FA] flex items-center justify-center px-4 py-20 relative">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-[#EAEAEA] relative z-10 shadow-xl">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-brand-primary flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-[#151515]">
              Car Rental
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-[#151515] font-heading">
            Sign In to Your Account
          </h1>
          <p className="text-xs text-[#777777] mt-1">
            Access your bookings, invoices, or management console.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold text-[#777777] uppercase tracking-wider">
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
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#F8F8FA] border border-[#EAEAEA] text-[#151515] text-xs font-semibold focus:outline-none focus:border-brand-primary transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-brand-primary hover:bg-brand-primaryHover text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins */}
        <div className="mt-6 pt-5 border-t border-[#EAEAEA]">
          <p className="text-[11px] font-bold text-center text-[#777777] uppercase tracking-wider mb-2.5">
            Quick Demo Autofill
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={fillCustomerCredentials}
              className="py-2 px-3 rounded-xl bg-brand-primaryLight hover:bg-brand-primaryLightHover text-brand-primary text-xs font-bold transition-colors"
            >
              Demo Customer
            </button>
            <button
              type="button"
              onClick={fillAdminCredentials}
              className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Register link */}
        <p className="text-center text-xs text-[#777777] mt-6">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-primary hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
