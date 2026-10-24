import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingService } from '../services/bookingService';
import { authService } from '../services/authService';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CalendarCheck,
  User,
  Download,
  AlertTriangle,
  X,
  Lock,
  Clock,
  CheckCircle2,
  Car,
  FileText,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

const MyBookings = () => {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cancel Modal
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [licenseNumber, setLicenseNumber] = useState(user?.drivingLicense?.number || '');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getMyBookings();
      if (res.success && res.bookings) {
        setBookings(res.bookings);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Stats calculation
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Active'
  ).length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'Completed').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled').length;

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancelModalBooking) return;
    setCancelling(true);
    setCancelMessage('');

    try {
      const res = await bookingService.cancelBooking(cancelModalBooking._id, cancelReason);
      if (res.success) {
        setCancelMessage('Booking cancelled successfully.');
        fetchBookings();
        setTimeout(() => {
          setCancelModalBooking(null);
          setCancelReason('');
          setCancelMessage('');
        }, 1500);
      }
    } catch (err) {
      setCancelMessage(err.message || 'Failed to cancel booking.');
    } finally {
      setCancelling(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileSuccess('');

    try {
      const res = await authService.updateProfile({
        name,
        phone,
        drivingLicenseNumber: licenseNumber,
      });
      if (res.success) {
        updateUser(res.user);
        setProfileSuccess('Profile updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordSuccess('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.message || 'Password update failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-20">
      <div className="container-fluid py-8">
        {/* User Welcome Banner */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl theme-hero-gradient flex items-center justify-center text-white font-black text-2xl shadow-primary-glow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xs text-brand-primary font-bold uppercase tracking-wider">
                Customer Account
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{user?.name}</h1>
              <p className="text-xs text-gray-400">{user?.email} • {user?.phone}</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-4 text-center border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-8">
            <div>
              <p className="text-xl font-black text-white">{totalBookings}</p>
              <p className="text-[10px] text-gray-400 uppercase">Total</p>
            </div>
            <div>
              <p className="text-xl font-black text-green-400">{activeBookings}</p>
              <p className="text-[10px] text-gray-400 uppercase">Upcoming</p>
            </div>
            <div>
              <p className="text-xl font-black text-blue-400">{completedBookings}</p>
              <p className="text-[10px] text-gray-400 uppercase">Finished</p>
            </div>
            <div>
              <p className="text-xl font-black text-red-400">{cancelledBookings}</p>
              <p className="text-[10px] text-gray-400 uppercase">Cancelled</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-3">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'bookings'
                ? 'bg-brand-primary text-white shadow-primary-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>My Bookings ({totalBookings})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-brand-primary text-white shadow-primary-glow'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Security</span>
          </button>
        </div>

        {/* Tab 1: Bookings List */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <LoadingSpinner />
            ) : bookings.length === 0 ? (
              <div className="glass-panel rounded-3xl p-12 text-center border border-white/10">
                <Car className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-1">No Reservations Found</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
                  You haven't placed any bookings yet. Discover our premium fleet of cars and
                  scooties!
                </p>
                <a
                  href="/car-rental"
                  className="orange-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white inline-block"
                >
                  Explore Vehicles
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="glass-panel rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-brand-primary/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                  >
                    {/* Vehicle & Ref Column */}
                    <div className="flex items-start gap-4">
                      <img
                        src={booking.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'}
                        alt=""
                        className="w-24 h-16 object-cover rounded-xl shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-brand-primary">
                            {booking.bookingReference}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              booking.bookingStatus === 'Confirmed'
                                ? 'bg-green-500/20 text-green-400'
                                : booking.bookingStatus === 'Active'
                                ? 'bg-blue-500/20 text-blue-400'
                                : booking.bookingStatus === 'Completed'
                                ? 'bg-purple-500/20 text-purple-400'
                                : 'bg-red-500/20 text-red-400'
                            }`}
                          >
                            {booking.bookingStatus}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-white mt-0.5">
                          {booking.vehicle?.name || `${booking.vehicleType.toUpperCase()} Rental`}
                        </h3>
                        <p className="text-xs text-gray-400">
                          Total Amount: <strong className="text-white">{formatCurrency(booking.totalAmount)}</strong>{' '}
                          ({booking.paymentStatus})
                        </p>
                      </div>
                    </div>

                    {/* Schedule Column */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-gray-400 block">Pickup Date</span>
                        <p className="font-semibold text-white">
                          {formatDate(booking.pickupDate)} • {booking.pickupTime}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-[140px]">
                          {booking.pickupLocation}
                        </p>
                      </div>

                      <div>
                        <span className="text-gray-400 block">Return Date</span>
                        <p className="font-semibold text-white">
                          {formatDate(booking.returnDate)} • {booking.returnTime}
                        </p>
                        <p className="text-[11px] text-gray-400 truncate max-w-[140px]">
                          {booking.returnLocation}
                        </p>
                      </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center gap-2">
                      <a
                        href={`/api/bookings/${booking._id}/invoice`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Invoice PDF</span>
                      </a>

                      {(booking.bookingStatus === 'Pending' ||
                        booking.bookingStatus === 'Confirmed') && (
                        <button
                          onClick={() => setCancelModalBooking(booking)}
                          className="px-3.5 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Profile & Password Management */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Update Profile Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-brand-primary" />
                Personal Information
              </h3>

              {profileSuccess && (
                <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs">
                  {profileSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Email Address (Immutable)
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    disabled
                    className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Driving License Number
                  </label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-0420210087654"
                    className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="orange-gradient-btn w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider"
                >
                  {profileLoading ? 'Saving Changes...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-primary" />
                Change Password
              </h3>

              {passwordSuccess && (
                <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs">
                  {passwordSuccess}
                </div>
              )}
              {passwordError && (
                <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
                  {passwordError}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 uppercase tracking-wider block mb-1">
                    New Secure Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Min 6 characters"
                    className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider w-full"
                >
                  {passwordLoading ? 'Updating Password...' : 'Update Password'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancelModalBooking && (
          <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-4">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-white">Cancel Reservation?</h3>
                <p className="text-xs text-gray-400 mt-1">
                  Booking Reference: <strong className="text-white">{cancelModalBooking.bookingReference}</strong>
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300">
                <p className="font-semibold text-brand-primary mb-1">Cancellation Policy:</p>
                <p className="text-[11px] text-gray-400">
                  Cancellations made &gt;24 hours before pickup receive a 90% refund.
                  Cancellations within 24 hours receive a 50% refund.
                </p>
              </div>

              {cancelMessage && (
                <p className="text-xs font-semibold text-center text-amber-400">{cancelMessage}</p>
              )}

              <form onSubmit={handleCancelBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">
                    Reason for Cancellation (Optional)
                  </label>
                  <textarea
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Change in travel plans, etc."
                    className="w-full bg-brand-black border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalBooking(null)}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white font-bold text-xs hover:bg-red-600 transition-colors"
                  >
                    {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
