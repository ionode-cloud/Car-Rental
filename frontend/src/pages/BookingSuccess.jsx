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
  User,
  ArrowRight,
  ShieldCheck,
  FileText,
  MessageCircle,
  Clock,
  Sparkles,
  Phone,
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
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white py-28 flex justify-center items-center">
        <LoadingSpinner text="Generating Your Reservation Receipt..." size="lg" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-white text-[#151515] py-32 text-center px-4">
        <h2 className="text-2xl font-bold mb-3">Reservation Record Not Found</h2>
        <p className="text-xs text-gray-500 mb-6">
          The requested booking reference could not be loaded.
        </p>
        <Link
          to="/my-bookings"
          className="orange-gradient-btn px-6 py-2.5 rounded-xl text-white text-xs font-bold"
        >
          View My Bookings
        </Link>
      </div>
    );
  }

  const isSelfDrive = booking.rentalCategory === 'self_drive' || !booking.rentalCategory;
  const apiBase = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');
  const token = localStorage.getItem('ridevista_token');
  const invoiceUrl = `${apiBase}/bookings/${booking._id}/invoice${
    token ? `?token=${encodeURIComponent(token)}` : ''
  }`;

  // Direct WhatsApp Confirmation Link
  const cleanPhone = (booking.customerDetails?.phone || '').replace(/\D/g, '');
  const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  const categoryLabel = isSelfDrive ? 'Self Drive' : 'Driving with Driver';
  const formattedPickupDate = new Date(booking.pickupDate).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const whatsappMessage = `🚗 *Booking Confirmed - RideVista Mobility*
━━━━━━━━━━━━━━━━━━━━
📌 *Booking ID:* ${booking.bookingReference}
🚘 *Category:* ${categoryLabel}
🚙 *Vehicle:* ${booking.vehicle?.brand || ''} ${booking.vehicle?.name || ''}
📍 *Pickup:* ${booking.pickupLocation}
${!isSelfDrive && booking.dropLocation ? `🏁 *Drop:* ${booking.dropLocation}\n` : ''}📅 *Date & Time:* ${formattedPickupDate} at ${booking.pickupTime}
⏱ *Duration:* ${booking.rentalDuration?.tier || '24 Hours'}
💰 *Total Fare:* ₹${(booking.totalAmount || 0).toLocaleString('en-IN')}
🛡️ *Security Deposit:* ₹0 (100% No Deposit Required)
━━━━━━━━━━━━━━━━━━━━
Your ride is reserved. Have a safe and pleasant journey!`;

  const whatsappUrl = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-[#151515] py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200 text-center shadow-xl relative overflow-hidden space-y-6">
          {/* Success Checkmark Badge */}
          <div className="w-16 h-16 rounded-3xl bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-9 h-9 stroke-[2.5]" />
          </div>

          <div>
            <span className="text-xs font-black text-brand-primary uppercase tracking-widest">
              Reservation Confirmed
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-[#151515] mt-1">
              Your Ride is Reserved!
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mt-2">
              A formal confirmation receipt has been generated and is ready to share.
            </p>
          </div>

          {/* Prominent No Deposit Badge */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center gap-2 max-w-lg mx-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="text-xs font-black text-emerald-800">
              100% No Security Deposit Required – Booked with ₹0 Deposit!
            </span>
          </div>

          {/* Booking Reference Box */}
          <div className="inline-block p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200 min-w-[280px]">
            <p className="text-[11px] text-gray-500 uppercase tracking-wider font-bold">
              Unique Booking ID
            </p>
            <p className="text-xl sm:text-2xl font-black text-brand-primary font-mono tracking-wider mt-1">
              {booking.bookingReference}
            </p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-brand-primary">
              {isSelfDrive ? <Car className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              <span>{categoryLabel}</span>
            </div>
          </div>

          {/* Trip Summary Card */}
          <div className="bg-gray-50/70 rounded-2xl p-5 border border-gray-200 text-left space-y-4">
            <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
              <img
                src={
                  booking.vehicle?.images?.[0] ||
                  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=600&auto=format&fit=crop'
                }
                alt=""
                className="w-20 h-14 object-contain rounded-xl bg-white p-1 border border-gray-200"
              />
              <div>
                <span className="text-[10px] font-bold text-brand-primary uppercase">
                  {booking.vehicle?.brand} • {booking.vehicle?.category}
                </span>
                <h3 className="text-base font-black text-[#151515]">
                  {booking.vehicle?.name || `${booking.vehicleType} Rental`}
                </h3>
                <p className="text-xs text-gray-500">
                  Rental Duration: <strong className="text-[#151515]">{booking.rentalDuration?.tier || '24 Hours'}</strong>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                  Pickup Location & Time
                </span>
                <p className="font-bold text-[#151515]">{booking.pickupLocation}</p>
                <p className="text-gray-500 mt-0.5">
                  {formatDate(booking.pickupDate)} at {booking.pickupTime}
                </p>
              </div>

              <div>
                <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">
                  {isSelfDrive ? 'Return Hub' : 'Drop Location'}
                </span>
                <p className="font-bold text-[#151515]">
                  {booking.dropLocation || booking.returnLocation || booking.pickupLocation}
                </p>
                <p className="text-gray-500 mt-0.5">
                  Duration: {booking.rentalDuration?.tier || '24 Hours'}
                </p>
              </div>
            </div>

            {/* Price & Deposit Transparent Table */}
            <div className="pt-3 border-t border-gray-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Rental Fare:</span>
                <span className="font-bold text-[#151515]">{formatCurrency(booking.totalAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-emerald-700">
                <span>Security Deposit:</span>
                <span>₹0 (100% No Deposit)</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-gray-200 font-black text-sm">
                <span>Total Amount:</span>
                <span className="text-xl text-brand-primary">{formatCurrency(booking.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: WhatsApp, PDF, My Bookings */}
          <div className="space-y-3 pt-2">
            {/* Primary WhatsApp Confirmation Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Send Confirmation on WhatsApp</span>
            </a>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <a
                href={invoiceUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-[#151515] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4 text-brand-primary" />
                <span>Download Tax Invoice (PDF)</span>
              </a>

              <Link
                to="/my-bookings"
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#151515] font-bold text-xs uppercase tracking-wider text-center transition-colors"
              >
                View in My Bookings
              </Link>
            </div>

            <div>
              <Link
                to="/"
                className="text-xs text-gray-400 hover:text-[#151515] font-semibold transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;
