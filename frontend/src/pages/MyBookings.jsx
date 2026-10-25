import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Eye,
  Loader2,
  MapPin,
  Copy,
  Check,
  Search,
  ArrowRight,
  Fuel,
  Cog,
  Users,
  Phone,
  Mail,
  Plus,
  Sparkles,
  RotateCcw,
  Compass,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';

const MyBookings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [actionError, setActionError] = useState('');
  const [copiedRef, setCopiedRef] = useState(null);

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

  // Copy booking reference helper
  const handleCopyRef = (refText) => {
    navigator.clipboard.writeText(refText);
    setCopiedRef(refText);
    setTimeout(() => setCopiedRef(null), 2000);
  };

  // PDF Bill Handlers: View & Download
  const handleViewBill = async (bookingId) => {
    try {
      setDownloadingId(bookingId);
      setActionError('');
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiBase}/bookings/${bookingId}/invoice`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.message || 'Failed to generate invoice PDF.');
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const fileUrl = window.URL.createObjectURL(pdfBlob);
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error('Invoice view error:', err);
      setActionError(err.message || 'Could not view PDF bill.');
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadBill = async (bookingId, bookingRef) => {
    try {
      setDownloadingId(bookingId);
      setActionError('');
      const apiBase = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiBase}/bookings/${bookingId}/invoice`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        throw new Error(errJson?.message || 'Failed to download invoice PDF.');
      }

      const blob = await response.blob();
      const fileUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = fileUrl;
      a.download = `Invoice-${bookingRef || bookingId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      console.error('Invoice download error:', err);
      setActionError(err.message || 'Could not download PDF bill.');
    } finally {
      setDownloadingId(null);
    }
  };

  // Stats calculation
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(
    (b) => b.bookingStatus === 'Confirmed' || b.bookingStatus === 'Active'
  ).length;
  const completedBookings = bookings.filter((b) => b.bookingStatus === 'Completed').length;
  const cancelledBookings = bookings.filter((b) => b.bookingStatus === 'Cancelled').length;

  // Filter bookings based on status filter & search query
  const filteredBookings = bookings.filter((b) => {
    // Status Filter
    if (statusFilter === 'upcoming') {
      if (b.bookingStatus !== 'Confirmed' && b.bookingStatus !== 'Active') return false;
    } else if (statusFilter === 'completed') {
      if (b.bookingStatus !== 'Completed') return false;
    } else if (statusFilter === 'cancelled') {
      if (b.bookingStatus !== 'Cancelled') return false;
    }

    // Search Query (vehicle name, brand, reference, locations)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const vehicleName = (b.vehicle?.name || '').toLowerCase();
      const vehicleBrand = (b.vehicle?.brand || '').toLowerCase();
      const ref = (b.bookingReference || '').toLowerCase();
      const pickup = (b.pickupLocation || '').toLowerCase();
      const drop = (b.returnLocation || '').toLowerCase();

      return (
        vehicleName.includes(q) ||
        vehicleBrand.includes(q) ||
        ref.includes(q) ||
        pickup.includes(q) ||
        drop.includes(q)
      );
    }

    return true;
  });

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
      const res = await authService.updateDetails({
        name,
        phone,
        drivingLicense: { number: licenseNumber },
      });
      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        if (updateUser) updateUser(res.user);
      }
    } catch (err) {
      alert(err.message || 'Update failed');
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
    <div className="min-h-screen bg-[#F5F6FA] text-[#151515] pt-16 sm:pt-20 pb-28 sm:pb-20 selection:bg-brand-primary selection:text-white">
      {/* Decorative ambient subtle background gradients */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 right-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="container-fluid relative z-10 py-6 sm:py-8 max-w-7xl mx-auto">
        {/* Breadcrumb & Title */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-1">
              <Link to="/" className="hover:text-brand-primary transition-colors">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[#151515] font-bold">My Account</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight font-heading">
              Account Dashboard
            </h1>
          </div>

          <Link
            to="/vehicles"
            className="group flex items-center gap-2 bg-gradient-to-r from-brand-primary to-orange-500 hover:from-brand-primaryHover hover:to-orange-600 text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md hover:shadow-brand-primary/20 transition-all duration-300"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" />
            <span>Rent Another Vehicle</span>
          </Link>
        </div>

        {/* User Profile & Metrics Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-8 transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* User Profile Info (Left 6 cols) */}
            <div className="lg:col-span-6 flex items-center gap-4 sm:gap-5">
              <div className="relative shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-brand-primary via-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-lg shadow-brand-primary/25 border-2 border-white ring-2 ring-brand-primary/20">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs" title="Account Active">
                  <Check className="w-3 h-3 text-white stroke-[3]" />
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-orange-50 text-brand-primary border border-brand-primary/20">
                    <Sparkles className="w-3 h-3" />
                    Verified Renter
                  </span>
                  {user?.drivingLicense?.number && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
                      <ShieldCheck className="w-3 h-3" />
                      DL Verified
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-black text-[#151515] font-heading truncate">
                  {user?.name || 'Valued Member'}
                </h2>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-gray-500 font-medium">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {user?.email}
                  </span>
                  {user?.phone && (
                    <span className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {user?.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Metrics (Right 6 cols) */}
            <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Total Card */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setStatusFilter('all');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'all' && activeTab === 'bookings'
                    ? 'bg-orange-50/60 border-brand-primary/40 shadow-xs'
                    : 'bg-[#F8F9FC] border-gray-150 hover:bg-white hover:border-gray-200 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Total</span>
                  <div className="w-7 h-7 rounded-xl bg-orange-100/60 text-brand-primary flex items-center justify-center">
                    <Car className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-[#151515] font-heading">{totalBookings}</p>
                <p className="text-[10px] text-gray-400 font-medium">All trips</p>
              </div>

              {/* Upcoming Card */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setStatusFilter('upcoming');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'upcoming' && activeTab === 'bookings'
                    ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                    : 'bg-emerald-50/40 border-emerald-100 hover:bg-emerald-50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-emerald-700 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Active</span>
                  <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center relative">
                    <CalendarCheck className="w-3.5 h-3.5" />
                    {activeBookings > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                </div>
                <p className="text-2xl font-black text-emerald-600 font-heading">{activeBookings}</p>
                <p className="text-[10px] text-emerald-600 font-medium">Ready to drive</p>
              </div>

              {/* Completed Card */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setStatusFilter('completed');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'completed' && activeTab === 'bookings'
                    ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                    : 'bg-blue-50/40 border-blue-100 hover:bg-blue-50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-blue-700 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Finished</span>
                  <div className="w-7 h-7 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-blue-600 font-heading">{completedBookings}</p>
                <p className="text-[10px] text-blue-500 font-medium">Completed</p>
              </div>

              {/* Cancelled Card */}
              <div
                onClick={() => {
                  setActiveTab('bookings');
                  setStatusFilter('cancelled');
                }}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  statusFilter === 'cancelled' && activeTab === 'bookings'
                    ? 'bg-rose-50/80 border-rose-400 shadow-xs'
                    : 'bg-rose-50/40 border-rose-100 hover:bg-rose-50 hover:shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between text-rose-700 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Cancelled</span>
                  <div className="w-7 h-7 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                    <RotateCcw className="w-3.5 h-3.5" />
                  </div>
                </div>
                <p className="text-2xl font-black text-rose-600 font-heading">{cancelledBookings}</p>
                <p className="text-[10px] text-rose-500 font-medium">Cancelled</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Error Alert */}
        {actionError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-500 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError('')}
              className="text-red-500 hover:text-red-800 p-1 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Tab & Filter Controls Navigation Bar */}
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 border border-gray-150 shadow-xs mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Main Tabs */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/25'
                  : 'text-gray-600 hover:text-[#151515] hover:bg-gray-100/70'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>My Bookings ({totalBookings})</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'bg-brand-primary text-white shadow-sm shadow-brand-primary/25'
                  : 'text-gray-600 hover:text-[#151515] hover:bg-gray-100/70'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Profile & Security</span>
            </button>
          </div>

          {/* Bookings-Specific Subfilters & Search */}
          {activeTab === 'bookings' && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
              {/* Status Pills */}
              <div className="flex items-center bg-[#F4F5F9] p-1 rounded-xl border border-gray-150 text-xs font-semibold overflow-x-auto no-scrollbar max-w-full">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === 'all'
                      ? 'bg-white text-[#151515] shadow-xs font-bold'
                      : 'text-gray-500 hover:text-[#151515]'
                  }`}
                >
                  All ({totalBookings})
                </button>
                <button
                  onClick={() => setStatusFilter('upcoming')}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === 'upcoming'
                      ? 'bg-white text-emerald-700 shadow-xs font-bold'
                      : 'text-gray-500 hover:text-[#151515]'
                  }`}
                >
                  Active ({activeBookings})
                </button>
                <button
                  onClick={() => setStatusFilter('completed')}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === 'completed'
                      ? 'bg-white text-blue-700 shadow-xs font-bold'
                      : 'text-gray-500 hover:text-[#151515]'
                  }`}
                >
                  Done ({completedBookings})
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-3 py-1 rounded-lg whitespace-nowrap transition-all ${
                    statusFilter === 'cancelled'
                      ? 'bg-white text-rose-700 shadow-xs font-bold'
                      : 'text-gray-500 hover:text-[#151515]'
                  }`}
                >
                  Cancelled ({cancelledBookings})
                </button>
              </div>

              {/* Search Input */}
              <div className="relative w-full sm:w-56 md:w-60">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search booking or car..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#F8F9FC] border border-gray-150 rounded-xl text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:bg-white focus:border-brand-primary transition-all font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* TAB 1: BOOKINGS LIST */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center gap-3">
                <LoadingSpinner size="lg" />
                <p className="text-xs font-semibold text-gray-400 animate-pulse">
                  Loading your journey history...
                </p>
              </div>
            ) : filteredBookings.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-150 shadow-sm max-w-xl mx-auto my-6">
                <div className="w-16 h-16 rounded-3xl bg-orange-50 border border-brand-primary/20 text-brand-primary flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[#151515] mb-1 font-heading">
                  {searchQuery || statusFilter !== 'all'
                    ? 'No Matching Bookings Found'
                    : 'No Bookings Yet'}
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-6 leading-relaxed">
                  {searchQuery || statusFilter !== 'all'
                    ? 'Try clearing your search query or switching filters to see other reservations.'
                    : 'Your journey starts here. Explore our verified fleet of high-performance cars, luxury sedans, and city scooties!'}
                </p>
                {searchQuery || statusFilter !== 'all' ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                    }}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-brand-primary bg-orange-50 hover:bg-orange-100 transition-colors inline-block"
                  >
                    Reset Filters
                  </button>
                ) : (
                  <Link
                    to="/vehicles"
                    className="px-6 py-3 rounded-2xl text-xs font-bold text-white bg-brand-primary hover:bg-brand-primaryHover transition-all inline-flex items-center gap-2 shadow-md shadow-brand-primary/20"
                  >
                    <span>Browse Available Fleet</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {filteredBookings.map((booking) => {
                  const isProcessingPdf = downloadingId === booking._id;
                  const isConfirmed = booking.bookingStatus === 'Confirmed';
                  const isActive = booking.bookingStatus === 'Active';
                  const isCompleted = booking.bookingStatus === 'Completed';
                  const isCancelled = booking.bookingStatus === 'Cancelled';

                  const vehicle = booking.vehicle || {};
                  const vehicleImg =
                    vehicle.images?.[0] ||
                    'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop';
                  const vehicleName =
                    vehicle.name || `${(booking.vehicleType || 'Car').toUpperCase()} Rental`;

                  return (
                    <div
                      key={booking._id}
                      className="group bg-white rounded-3xl border border-gray-150 hover:border-brand-primary/40 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden"
                    >
                      {/* Ticket Top Strip */}
                      <div className="bg-[#FAFBFD] px-6 py-3.5 border-b border-gray-150 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          {/* Booking Reference Pill with Copy Button */}
                          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-2xs font-mono">
                            <span className="font-bold text-[#151515]">{booking.bookingReference}</span>
                            <button
                              onClick={() => handleCopyRef(booking.bookingReference)}
                              className="text-gray-400 hover:text-brand-primary p-0.5 transition-colors"
                              title="Copy Reference"
                            >
                              {copiedRef === booking.bookingReference ? (
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>

                          {/* Created Date */}
                          <span className="text-gray-400 hidden sm:inline-flex items-center gap-1 text-[11px] font-medium">
                            <Clock className="w-3.5 h-3.5 text-gray-400" />
                            Booked {formatDate(booking.createdAt)}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 ${
                              isConfirmed
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs'
                                : isActive
                                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-2xs'
                                : isCompleted
                                ? 'bg-purple-50 text-purple-700 border border-purple-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}
                          >
                            {isConfirmed && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                            )}
                            {isActive && (
                              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                            )}
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-purple-600" />}
                            {isCancelled && <RotateCcw className="w-3 h-3 text-rose-500" />}
                            <span>{booking.bookingStatus}</span>
                          </span>
                        </div>
                      </div>

                      {/* Card Main Body Grid */}
                      <div className="p-4 sm:p-6 lg:p-7 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-center">
                        {/* 1. Vehicle Showcase (Col 1-4) */}
                        <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-4 items-stretch sm:items-start lg:items-stretch">
                          <div className="relative w-full sm:w-48 lg:w-full h-44 sm:h-32 lg:h-40 rounded-2xl overflow-hidden bg-gray-100 border border-gray-150 shrink-0 shadow-inner group">
                            <img
                              src={vehicleImg}
                              alt={vehicleName}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            {vehicle.category && (
                              <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-lg tracking-wider">
                                {vehicle.category}
                              </div>
                            )}
                            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-md text-[#151515] text-[10px] font-black uppercase px-2 py-0.5 rounded-lg tracking-wider border border-white">
                              {vehicle.brand || booking.vehicleType || 'Vehicle'}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-black text-[#151515] font-heading hover:text-brand-primary transition-colors truncate">
                              {vehicleName}
                            </h3>

                            {/* Spec tags */}
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-gray-500 font-semibold">
                              {vehicle.fuelType && (
                                <span className="inline-flex items-center gap-1 bg-[#F5F6FA] px-2 py-0.5 rounded-md border border-gray-200">
                                  <Fuel className="w-3 h-3 text-amber-500" />
                                  {vehicle.fuelType}
                                </span>
                              )}
                              {vehicle.transmission && (
                                <span className="inline-flex items-center gap-1 bg-[#F5F6FA] px-2 py-0.5 rounded-md border border-gray-200">
                                  <Cog className="w-3 h-3 text-blue-500" />
                                  {vehicle.transmission}
                                </span>
                              )}
                              {vehicle.seatingCapacity && (
                                <span className="inline-flex items-center gap-1 bg-[#F5F6FA] px-2 py-0.5 rounded-md border border-gray-200">
                                  <Users className="w-3 h-3 text-emerald-500" />
                                  {vehicle.seatingCapacity} Seats
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 2. Route & Journey Timeline (Col 5-8) */}
                        <div className="lg:col-span-5 bg-[#F9FAFC] rounded-2xl p-5 border border-gray-150 relative">
                          <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-gray-300">
                            {/* Pickup Info */}
                            <div className="relative">
                              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-xs flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                                  Pickup
                                </span>
                                <span className="text-xs font-bold text-[#151515]">
                                  {formatDate(booking.pickupDate)} • {booking.pickupTime}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{booking.pickupLocation}</span>
                              </p>
                            </div>

                            {/* Return Info */}
                            <div className="relative">
                              <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-brand-primary border-2 border-white shadow-xs flex items-center justify-center">
                                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                              </div>
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary">
                                  Drop-off
                                </span>
                                <span className="text-xs font-bold text-[#151515]">
                                  {formatDate(booking.returnDate)} • {booking.returnTime}
                                </span>
                              </div>
                              <p className="text-xs font-medium text-gray-600 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                <span className="truncate">{booking.returnLocation}</span>
                              </p>
                            </div>
                          </div>

                          {/* Journey Duration Tag */}
                          <div className="mt-4 pt-3 border-t border-gray-200/80 flex items-center justify-between text-[11px] text-gray-500 font-medium">
                            <span className="flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                              Zero Hidden Charges
                            </span>
                            <span className="font-bold text-gray-700 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                              {booking.rentalDuration?.days || 1} Days Rental
                            </span>
                          </div>
                        </div>

                        {/* 3. Financials & Actions Center (Col 9-12) */}
                        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-gray-150 lg:pl-6">
                          <div>
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                              Total Amount
                            </span>
                            <div className="flex items-baseline gap-2 mt-0.5">
                              <span className="text-2xl sm:text-3xl font-black text-[#151515] font-heading tracking-tight">
                                {formatCurrency(booking.totalAmount)}
                              </span>
                            </div>
                            <span
                              className={`inline-block mt-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                                booking.paymentStatus === 'Paid'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                              }`}
                            >
                              Payment {booking.paymentStatus}
                            </span>
                          </div>

                          {/* Action Buttons */}
                          <div className="space-y-2 pt-2">
                            <div className="grid grid-cols-2 gap-2">
                              {/* View Bill Button */}
                              <button
                                type="button"
                                onClick={() => handleViewBill(booking._id)}
                                disabled={isProcessingPdf}
                                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 hover:border-brand-primary text-[#151515] hover:text-brand-primary text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                                title="Open Invoice in browser"
                              >
                                {isProcessingPdf ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5 text-brand-primary" />
                                )}
                                <span>View Bill</span>
                              </button>

                              {/* Download PDF Button */}
                              <button
                                type="button"
                                onClick={() => handleDownloadBill(booking._id, booking.bookingReference)}
                                disabled={isProcessingPdf}
                                className="w-full py-2.5 px-3 rounded-xl bg-brand-primary/10 hover:bg-brand-primary text-brand-primary hover:text-white border border-brand-primary/20 text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs"
                                title="Download PDF invoice file"
                              >
                                {isProcessingPdf ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                  <Download className="w-3.5 h-3.5" />
                                )}
                                <span>PDF Bill</span>
                              </button>
                            </div>

                            {/* Cancel Booking or Re-book */}
                            {(isConfirmed || booking.bookingStatus === 'Pending') && (
                              <button
                                onClick={() => setCancelModalBooking(booking)}
                                className="w-full py-2 rounded-xl text-center text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-colors"
                              >
                                Cancel Reservation
                              </button>
                            )}

                            {isCompleted && (
                              <Link
                                to={`/vehicles/${vehicle._id || ''}`}
                                className="w-full py-2 rounded-xl text-center text-xs font-bold text-brand-primary hover:bg-orange-50 border border-brand-primary/30 transition-colors block"
                              >
                                Book This Car Again
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROFILE & SECURITY */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Personal Information Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
                <div className="w-10 h-10 rounded-2xl bg-orange-50 text-brand-primary flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#151515] font-heading">
                    Personal Information
                  </h3>
                  <p className="text-xs text-gray-400">
                    Manage your identity and rental profile details
                  </p>
                </div>
              </div>

              {profileSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{profileSuccess}</span>
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Full Legal Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. John Doe"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FC] border border-gray-200 rounded-2xl text-xs text-[#151515] font-medium focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Email Address <span className="text-gray-400 font-normal">(Registered)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-200 rounded-2xl text-xs text-gray-500 font-medium cursor-not-allowed"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+91 9876543210"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FC] border border-gray-200 rounded-2xl text-xs text-[#151515] font-medium focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Driving License Number
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="e.g. DL-0420210087654"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FC] border border-gray-200 rounded-2xl text-xs text-[#151515] font-medium focus:outline-none focus:bg-white focus:border-brand-primary transition-all uppercase"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={profileLoading}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-xs uppercase tracking-wider bg-brand-primary hover:bg-brand-primaryHover transition-all shadow-md shadow-brand-primary/20 flex items-center justify-center gap-2"
                >
                  {profileLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Profile...</span>
                    </>
                  ) : (
                    <span>Save Profile Changes</span>
                  )}
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-150 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-gray-150">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#151515] font-heading">
                    Security & Password
                  </h3>
                  <p className="text-xs text-gray-400">
                    Ensure your account stays secure with a strong password
                  </p>
                </div>
              </div>

              {passwordSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{passwordError}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FC] border border-gray-200 rounded-2xl text-xs text-[#151515] font-medium focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    New Secure Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      placeholder="Minimum 6 characters"
                      className="w-full pl-10 pr-4 py-3 bg-[#F8F9FC] border border-gray-200 rounded-2xl text-xs text-[#151515] font-medium focus:outline-none focus:bg-white focus:border-brand-primary transition-all"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 text-[11px] text-gray-500">
                  <span className="font-bold text-gray-700 block mb-0.5">Password Tip:</span>
                  Use at least 8 characters including uppercase letters, numbers, and symbols.
                </div>

                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="w-full py-3.5 rounded-2xl bg-[#151515] hover:bg-black text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  {passwordLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Update Password</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Cancellation Modal */}
        {cancelModalBooking && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 max-w-md w-full relative space-y-5 shadow-2xl">
              <button
                onClick={() => setCancelModalBooking(null)}
                className="absolute right-4 top-4 text-gray-400 hover:text-black p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-xl font-black text-[#151515] font-heading">
                  Cancel Reservation?
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Booking Reference:{' '}
                  <strong className="text-[#151515] font-black font-mono">
                    {cancelModalBooking.bookingReference}
                  </strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900">
                <p className="font-bold text-amber-950 mb-1 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  Cancellation Policy:
                </p>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Cancellations requested &gt;24 hours before pickup receive a 90% instant refund.
                  Cancellations within 24 hours receive a 50% refund.
                </p>
              </div>

              {cancelMessage && (
                <p className="text-xs font-semibold text-center text-amber-600 bg-amber-50 py-2 rounded-xl border border-amber-200">
                  {cancelMessage}
                </p>
              )}

              <form onSubmit={handleCancelBooking} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1.5">
                    Reason for Cancellation <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <textarea
                    rows="3"
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Tell us why you are cancelling..."
                    className="w-full bg-[#F8F9FC] border border-gray-200 rounded-2xl p-3 text-xs text-[#151515] focus:outline-none focus:border-brand-primary focus:bg-white transition-all font-medium"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCancelModalBooking(null)}
                    className="flex-1 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-[#151515] font-bold text-xs transition-colors"
                  >
                    Keep Booking
                  </button>
                  <button
                    type="submit"
                    disabled={cancelling}
                    className="flex-1 py-3 rounded-2xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    {cancelling ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Cancelling...</span>
                      </>
                    ) : (
                      <span>Confirm Cancel</span>
                    )}
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
