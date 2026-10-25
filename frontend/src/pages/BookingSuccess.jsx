import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  Download,
  Calendar,
  MapPin,
  Car,
  ArrowRight,
  ShieldCheck,
  FileText,
} from 'lucide-react';

const BookingSuccess = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const res = await bookingService.getBookingById(id);
        if (res.success && res.booking) {
          setBooking(res.booking);
        }
      } catch (err) {
        console.error('Failed to load booking:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-black pt-28">
        <LoadingSpinner text="Generating Your Reservation..." />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-brand-black text-white pt-32 text-center px-4">
        <h2 className="text-2xl font-bold mb-4">Reservation Record Not Found</h2>
        <Link to="/my-account" className="orange-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  const apiBase = import.meta.env.VITE_API_URL || '/api';
  const invoiceUrl = `${apiBase}/bookings/${booking._id}/invoice`;

  return (
    <div className="min-h-screen bg-brand-black text-white pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-white/15 text-center shadow-2xl relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-brand-primary/20 rounded-full blur-3xl pointer-events-none" />

          {/* Success Checkmark Badge */}
          <div className="w-16 h-16 rounded-3xl theme-hero-gradient flex items-center justify-center mx-auto mb-6 shadow-primary-glow animate-bounce">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>

          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest">
            Reservation Confirmed
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white mt-1 mb-2">
            Your Ride is Reserved!
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto mb-6">
            A confirmation receipt has been transmitted to{' '}
            <strong className="text-white">{booking.customerDetails?.email}</strong>.
          </p>

          {/* Booking Reference Box */}
          <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 mb-8">
            <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold">
              Booking Reference Number
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-primary tracking-wider mt-0.5">
              {booking.bookingReference}
            </p>
          </div>

          {/* Trip Summary Card */}
          <div className="bg-brand-dark/80 rounded-2xl p-6 border border-white/10 text-left space-y-4 mb-8">
            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <img
                src={booking.vehicle?.images?.[0] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'}
                alt=""
                className="w-20 h-14 object-cover rounded-xl"
              />
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase">
                  {booking.vehicle?.brand} • {booking.vehicle?.category}
                </span>
                <h3 className="text-base font-bold text-white">
                  {booking.vehicle?.name || `${booking.vehicleType.toUpperCase()} Rental`}
                </h3>
                <p className="text-xs text-gray-400">
                  Total Paid: <strong className="text-white">{formatCurrency(booking.totalAmount)}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block mb-0.5">Pickup Details</span>
                <p className="font-bold text-white">
                  {formatDate(booking.pickupDate)} • {booking.pickupTime}
                </p>
                <p className="text-gray-400">{booking.pickupLocation}</p>
              </div>

              <div>
                <span className="text-gray-400 block mb-0.5">Return Details</span>
                <p className="font-bold text-white">
                  {formatDate(booking.returnDate)} • {booking.returnTime}
                </p>
                <p className="text-gray-400">{booking.returnLocation}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noreferrer"
              className="orange-gradient-btn w-full sm:w-auto px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-primary-glow"
            >
              <Download className="w-4 h-4" />
              <span>Download Tax Invoice (PDF)</span>
            </a>

            <Link
              to="/my-account"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider text-center transition-colors"
            >
              View in My Bookings
            </Link>

            <Link
              to="/"
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-400 hover:text-white text-xs font-semibold text-center"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
