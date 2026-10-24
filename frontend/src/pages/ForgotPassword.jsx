import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { Mail, ArrowRight, ShieldCheck, ShieldAlert, Car } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [devToken, setDevToken] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'Password reset link sent to your email.');
      if (response.devToken) {
        setDevToken(response.devToken);
      }
    } catch (err) {
      setError(err.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl border border-white/15 shadow-2xl">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl theme-hero-gradient flex items-center justify-center shadow-primary-glow">
              <Car className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-white">
              RIDE<span className="text-brand-primary">VISTA</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
          <p className="text-xs text-gray-400 mt-1">
            Enter your registered email and we'll send you recovery instructions.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="mb-5 p-3.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{message}</span>
            </div>
            {devToken && (
              <div className="mt-2 p-2 bg-brand-dark rounded-lg text-white font-mono text-[11px] break-all border border-white/10">
                <p className="text-gray-400 text-[10px] mb-1">Development Quick Link:</p>
                <Link
                  to={`/reset-password/${devToken}`}
                  className="text-brand-primary hover:underline"
                >
                  Click here to Reset Password with Token
                </Link>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl pl-11 pr-4 py-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="orange-gradient-btn w-full py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {loading ? <span>Sending...</span> : <span>Send Reset Instructions</span>}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Remembered your password?{' '}
          <Link to="/login" className="text-brand-primary font-bold hover:underline">
            Back to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
