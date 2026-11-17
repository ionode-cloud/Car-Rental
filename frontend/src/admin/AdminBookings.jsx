import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CalendarCheck,
  Search,
  Filter,
  Download,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  AlertCircle,
  X,
  FileText,
  Car,
  User,
  Shield,
  ShieldCheck,
  Phone,
  MessageCircle,
  MapPin,
  ExternalLink,
  Check,
  Slash,
  Maximize2,
  Calendar,
} from 'lucide-react';

const AdminBookings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';

  const [bookings, setBookings] = useState([]);
  const [counts, setCounts] = useState({ all: 0, self_drive: 0, with_driver: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Modal State
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [actionError, setActionError] = useState('');

  // Image Preview Modal for Aadhaar / DL
  const [previewImage, setPreviewImage] = useState(null);

  const fetchBookings = async () => {
    setLoading(true);
    setActionError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (categoryFilter !== 'all') params.rentalCategory = categoryFilter;
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;
      if (typeFilter !== 'all') params.vehicleType = typeFilter;

      const res = await api.get('/admin/bookings', { params });
      if (res.success) {
        setBookings(res.bookings || []);
        if (res.counts) {
          setCounts(res.counts);
        }
      }
    } catch (err) {
      console.error(err);
      setActionError(err.message || 'Failed to fetch bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [categoryFilter, statusFilter, paymentFilter, typeFilter]);

  const handleCategoryTab = (cat) => {
    setCategoryFilter(cat);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat === 'all') next.delete('category');
      else next.set('category', cat);
      return next;
    });
  };

  const handleOpenModal = (b) => {
    setSelectedBooking(b);
    setNewStatus(b.bookingStatus);
    setNewPaymentStatus(b.paymentStatus);
    setStatusNote('');
    setSuccessMsg('');
    setActionError('');
  };

  const handleQuickStatusChange = async (bookingId, targetStatus) => {
    setActionError('');
    try {
      const res = await api.patch(`/admin/bookings/${bookingId}/status`, {
        bookingStatus: targetStatus,
        note: `Quick action: Admin set status to ${targetStatus}`,
      });
      if (res.success) {
        fetchBookings();
      }
    } catch (err) {
      alert(err.message || `Failed to update status to ${targetStatus}`);
    }
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setUpdating(true);
    setActionError('');

    try {
      const res = await api.patch(`/admin/bookings/${selectedBooking._id}/status`, {
        bookingStatus: newStatus,
        paymentStatus: newPaymentStatus,
        note: statusNote || `Status updated to ${newStatus}`,
      });

      if (res.success) {
        setSuccessMsg('Booking updated successfully!');
        fetchBookings();
        setTimeout(() => {
          setSelectedBooking(null);
        }, 1000);
      }
    } catch (err) {
      setActionError(err.message || 'Failed to update booking status.');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Ongoing':
      case 'Active':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Completed':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'Pending':
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Reservation Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151515]">Rental Bookings</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage Self Drive and Chauffeur bookings, verify KYC documents, and contact customers.
          </p>
        </div>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {actionError}
        </div>
      )}

      {/* Booking Category Switcher Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/80 rounded-2xl border border-gray-200/80 w-fit">
        <button
          type="button"
          onClick={() => handleCategoryTab('all')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            categoryFilter === 'all'
              ? 'bg-white text-[#151515] shadow-xs'
              : 'text-gray-500 hover:text-[#151515]'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>All Bookings</span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-bold">
            {counts.all || bookings.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryTab('self_drive')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            categoryFilter === 'self_drive'
              ? 'bg-brand-primary text-white shadow-xs'
              : 'text-gray-500 hover:text-[#151515]'
          }`}
        >
          <Car className="w-3.5 h-3.5" />
          <span>Self Drive Bookings</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              categoryFilter === 'self_drive' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {counts.self_drive || 0}
          </span>
        </button>

        <button
          type="button"
          onClick={() => handleCategoryTab('with_driver')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            categoryFilter === 'with_driver'
              ? 'bg-[#151515] text-white shadow-xs'
              : 'text-gray-500 hover:text-[#151515]'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Driving with Driver Bookings</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              categoryFilter === 'with_driver' ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            {counts.with_driver || 0}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBookings();
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            placeholder="Search reference, name, phone, Aadhaar, DL..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Trip Statuses</option>
            <option value="Pending">Pending Approval</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Ongoing">Ongoing (On Trip)</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Payments</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Payment Pending</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Vehicle Types</option>
            <option value="car">Cars Only</option>
            <option value="bike">Bikes / Scooties</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden bg-white">
        {loading ? (
          <div className="py-20 flex justify-center items-center">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#151515]">
              <thead className="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50/80 border-b border-gray-100">
                <tr>
                  <th className="p-3.5 font-bold">Reference & Type</th>
                  <th className="p-3.5 font-bold">Customer Details</th>
                  <th className="p-3.5 font-bold">KYC Documents</th>
                  <th className="p-3.5 font-bold">Vehicle</th>
                  <th className="p-3.5 font-bold">Locations & Dates</th>
                  <th className="p-3.5 font-bold">Duration</th>
                  <th className="p-3.5 font-bold">Fare & Deposit</th>
                  <th className="p-3.5 font-bold">Status</th>
                  <th className="p-3.5 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="p-12 text-center text-gray-400">
                      No bookings found for the selected category and filters.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => {
                    const isSelfDrive = b.rentalCategory === 'self_drive' || !b.rentalCategory;
                    const cleanPhone = (b.customerDetails?.phone || '').replace(/\D/g, '');
                    const phoneWithCountry = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
                    const whatsappMsg = `Hello ${b.customerDetails?.name}, regarding your ${isSelfDrive ? 'Self Drive' : 'Driving with Driver'} booking (${b.bookingReference}) with RideVista:`;
                    const waLink = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(whatsappMsg)}`;

                    return (
                      <tr key={b._id} className="hover:bg-gray-50/60 transition-colors">
                        {/* Reference & Category Badge */}
                        <td className="p-3.5 whitespace-nowrap">
                          <p className="font-bold text-[#151515] font-mono text-[11px]">
                            {b.bookingReference}
                          </p>
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase mt-1 ${
                              isSelfDrive
                                ? 'bg-orange-50 text-brand-primary border border-orange-200'
                                : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}
                          >
                            {isSelfDrive ? <Car className="w-2.5 h-2.5" /> : <User className="w-2.5 h-2.5" />}
                            {isSelfDrive ? 'Self Drive' : 'With Driver'}
                          </span>
                        </td>

                        {/* Customer & WhatsApp direct contact */}
                        <td className="p-3.5">
                          <p className="font-bold text-[#151515]">{b.customerDetails?.name || 'Customer'}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[11px] text-gray-500 font-medium">
                              {b.customerDetails?.phone || 'No phone'}
                            </span>
                            {cleanPhone && (
                              <a
                                href={waLink}
                                target="_blank"
                                rel="noreferrer"
                                title="Contact on WhatsApp"
                                className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                              >
                                <MessageCircle className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 truncate max-w-[140px]">
                            {b.customerDetails?.email}
                          </p>
                        </td>

                        {/* KYC Badges */}
                        <td className="p-3.5 whitespace-nowrap text-[11px]">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-gray-400">Aadhaar:</span>
                              {b.customerDetails?.aadhaarDocument ? (
                                <button
                                  type="button"
                                  onClick={() => setPreviewImage({
                                    url: b.customerDetails.aadhaarDocument,
                                    title: `Aadhaar Card - ${b.customerDetails?.name}`,
                                    idNum: b.customerDetails?.aadhaarNumber
                                  })}
                                  className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>View Doc</span>
                                </button>
                              ) : b.customerDetails?.aadhaarNumber ? (
                                <span className="font-mono text-[10px] text-gray-700 font-medium">
                                  {b.customerDetails.aadhaarNumber}
                                </span>
                              ) : (
                                <span className="text-[10px] text-gray-400 italic">Not uploaded</span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-gray-400">DL:</span>
                              {isSelfDrive ? (
                                b.customerDetails?.drivingLicenseDocument ? (
                                  <button
                                    type="button"
                                    onClick={() => setPreviewImage({
                                      url: b.customerDetails.drivingLicenseDocument,
                                      title: `Driving Licence - ${b.customerDetails?.name}`,
                                      idNum: b.customerDetails?.drivingLicenseNumber
                                    })}
                                    className="text-[10px] font-bold text-brand-primary hover:underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <FileText className="w-3 h-3" />
                                    <span>View DL</span>
                                  </button>
                                ) : b.customerDetails?.drivingLicenseNumber ? (
                                  <span className="font-mono text-[10px] text-gray-700 font-medium">
                                    {b.customerDetails.drivingLicenseNumber}
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-red-500 font-semibold">Missing DL</span>
                                )
                              ) : (
                                <span className="text-[10px] text-emerald-600 font-medium">Driver Provided</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Vehicle */}
                        <td className="p-3.5 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {b.vehicle?.images?.[0] ? (
                              <img
                                src={b.vehicle.images[0]}
                                alt=""
                                className="w-10 h-7 object-cover rounded-md border border-gray-100"
                              />
                            ) : (
                              <div className="w-10 h-7 bg-gray-100 rounded-md flex items-center justify-center">
                                <Car className="w-4 h-4 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-[#151515] leading-tight">
                                {b.vehicle?.brand} {b.vehicle?.name || b.vehicleType}
                              </p>
                              <span className="text-[10px] text-gray-400 uppercase font-medium">
                                {b.vehicle?.category || b.vehicleType}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Locations & Dates */}
                        <td className="p-3.5 whitespace-nowrap text-gray-600 text-[11px]">
                          <div className="space-y-0.5">
                            <p className="font-semibold text-[#151515] flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-brand-primary shrink-0" />
                              <span>{b.pickupLocation}</span>
                            </p>
                            {!isSelfDrive && b.dropLocation && (
                              <p className="text-[10px] text-gray-500 flex items-center gap-1">
                                <span className="font-bold text-gray-700">Drop:</span>
                                <span>{b.dropLocation}</span>
                              </p>
                            )}
                            <p className="text-[10px] text-gray-400">
                              {formatDate(b.pickupDate)} • {b.pickupTime}
                            </p>
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[11px] font-bold">
                            {b.rentalDuration?.tier || `${b.rentalDuration?.days || 1} Days`}
                          </span>
                        </td>

                        {/* Fare & Security Deposit */}
                        <td className="p-3.5 whitespace-nowrap">
                          <p className="font-black text-[#151515] text-xs">
                            {formatCurrency(b.totalAmount)}
                          </p>
                          <span className="inline-block mt-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            Deposit: ₹0 (No Deposit)
                          </span>
                        </td>

                        {/* Status Badge */}
                        <td className="p-3.5 whitespace-nowrap">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusBadge(
                              b.bookingStatus
                            )}`}
                          >
                            {b.bookingStatus}
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">{b.paymentStatus}</p>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            {b.bookingStatus === 'Pending' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleQuickStatusChange(b._id, 'Confirmed')}
                                  title="Approve Booking"
                                  className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Check className="w-3 h-3" />
                                  <span>Approve</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleQuickStatusChange(b._id, 'Rejected')}
                                  title="Reject Booking"
                                  className="px-2 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                                >
                                  <Slash className="w-3 h-3" />
                                  <span>Reject</span>
                                </button>
                              </>
                            )}

                            <button
                              type="button"
                              onClick={() => handleOpenModal(b)}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#151515] font-bold text-[11px] cursor-pointer"
                            >
                              Manage
                            </button>

                            <a
                              href={`${(import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')}/bookings/${b._id}/invoice${localStorage.getItem('ridevista_token') ? `?token=${encodeURIComponent(localStorage.getItem('ridevista_token'))}` : ''}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                              title="Download Invoice PDF"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Management & Detailed Verification Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 max-w-2xl w-full relative space-y-4 max-h-[92vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute right-5 top-5 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                    selectedBooking.rentalCategory === 'with_driver'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-orange-100 text-brand-primary'
                  }`}
                >
                  {selectedBooking.rentalCategory === 'with_driver'
                    ? 'Driving with Driver'
                    : 'Self Drive'}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {selectedBooking.bookingReference}
                </span>
              </div>
              <h2 className="text-xl font-black text-[#151515] mt-1">
                Booking & Document Inspection
              </h2>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {/* Customer & Direct Contact Card */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-sm text-[#151515]">
                    {selectedBooking.customerDetails?.name}
                  </h4>
                  <p className="text-xs text-gray-500">{selectedBooking.customerDetails?.email}</p>
                </div>

                {selectedBooking.customerDetails?.phone && (
                  <a
                    href={`https://wa.me/${(selectedBooking.customerDetails.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${selectedBooking.customerDetails.name}, regarding your RideVista booking ${selectedBooking.bookingReference}:`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Customer</span>
                  </a>
                )}
              </div>

              {/* KYC Document Previews */}
              <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Aadhaar Card */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-brand-primary" />
                    Aadhaar Card Details
                  </span>
                  <p className="font-mono font-bold text-xs text-[#151515]">
                    {selectedBooking.customerDetails?.aadhaarNumber || 'Number Not Stated'}
                  </p>
                  {selectedBooking.customerDetails?.aadhaarDocument ? (
                    <button
                      type="button"
                      onClick={() => setPreviewImage({
                        url: selectedBooking.customerDetails.aadhaarDocument,
                        title: `Aadhaar Card - ${selectedBooking.customerDetails?.name}`,
                        idNum: selectedBooking.customerDetails?.aadhaarNumber
                      })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline cursor-pointer pt-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Uploaded Document</span>
                    </button>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">No document image attached</p>
                  )}
                </div>

                {/* Driving Licence */}
                <div className="p-3 bg-white rounded-xl border border-gray-200 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                    <Shield className="w-3 h-3 text-brand-primary" />
                    Driving Licence Details
                  </span>
                  {selectedBooking.rentalCategory === 'with_driver' ? (
                    <div className="pt-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                        Driver Provided • Licence Not Required
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="font-mono font-bold text-xs text-[#151515]">
                        {selectedBooking.customerDetails?.drivingLicenseNumber || 'Missing DL Number'}
                      </p>
                      {selectedBooking.customerDetails?.drivingLicenseDocument ? (
                        <button
                          type="button"
                          onClick={() => setPreviewImage({
                            url: selectedBooking.customerDetails.drivingLicenseDocument,
                            title: `Driving Licence - ${selectedBooking.customerDetails?.name}`,
                            idNum: selectedBooking.customerDetails?.drivingLicenseNumber
                          })}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-primary hover:underline cursor-pointer pt-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect Uploaded Licence</span>
                        </button>
                      ) : (
                        <p className="text-[10px] text-gray-400 italic">No document image attached</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Trip Itinerary & Vehicle Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Trip Schedule
                </span>
                <div>
                  <span className="text-gray-500 block text-[11px]">Pickup Location:</span>
                  <p className="font-bold text-[#151515]">{selectedBooking.pickupLocation}</p>
                </div>
                {selectedBooking.dropLocation && (
                  <div>
                    <span className="text-gray-500 block text-[11px]">Drop Location:</span>
                    <p className="font-bold text-[#151515]">{selectedBooking.dropLocation}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 block text-[11px]">Date & Time:</span>
                  <p className="font-bold text-[#151515]">
                    {formatDate(selectedBooking.pickupDate)} at {selectedBooking.pickupTime}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 block text-[11px]">Rental Duration:</span>
                  <p className="font-bold text-brand-primary">
                    {selectedBooking.rentalDuration?.tier || `${selectedBooking.rentalDuration?.days || 1} Days`}
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200/80 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                  Vehicle & Pricing
                </span>
                <div className="flex items-center gap-2">
                  {selectedBooking.vehicle?.images?.[0] && (
                    <img
                      src={selectedBooking.vehicle.images[0]}
                      alt=""
                      className="w-12 h-9 object-cover rounded-md border border-gray-200 bg-white"
                    />
                  )}
                  <div>
                    <p className="font-bold text-[#151515]">
                      {selectedBooking.vehicle?.brand} {selectedBooking.vehicle?.name}
                    </p>
                    <span className="text-[10px] text-gray-500 uppercase">
                      {selectedBooking.vehicle?.category}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="flex justify-between text-gray-500">
                    <span>Base Rental:</span>
                    <span>{formatCurrency(selectedBooking.priceBreakdown?.baseRental || selectedBooking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-700">
                    <span>Security Deposit:</span>
                    <span>₹0 (100% No Deposit)</span>
                  </div>
                  <div className="flex justify-between font-black text-sm text-[#151515] pt-1 border-t border-gray-200">
                    <span>Total Fare:</span>
                    <span className="text-brand-primary">{formatCurrency(selectedBooking.totalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Approve / Reject Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setNewStatus('Confirmed');
                  setNewPaymentStatus('Paid');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Mark as Confirmed & Paid
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewStatus('Ongoing');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Mark as Ongoing (Vehicle Dispatched)
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewStatus('Completed');
                }}
                className="flex-1 py-2 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition-colors cursor-pointer"
              >
                Mark as Completed
              </button>
            </div>

            {/* Status Transition Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 pt-2 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[#151515] block mb-1">
                    Booking Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                  >
                    <option value="Pending">Pending Approval</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Ongoing">Ongoing (Vehicle Dispatched)</option>
                    <option value="Completed">Completed (Returned)</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[#151515] block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={newPaymentStatus}
                    onChange={(e) => setNewPaymentStatus(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                  >
                    <option value="Pending">Payment Pending</option>
                    <option value="Paid">Paid in Full</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#151515] block mb-1">
                  Internal Operational Note
                </label>
                <input
                  type="text"
                  placeholder="e.g., Aadhaar verified, customer called for pickup hub directions..."
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-500 hover:text-gray-800"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="orange-gradient-btn px-6 py-2.5 rounded-xl text-xs font-bold text-white shadow-primary-glow cursor-pointer"
                >
                  {updating ? 'Saving...' : 'Save Booking Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KYC Document Viewer Full Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-xl w-full relative space-y-3 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-gray-200">
              <div>
                <h3 className="font-bold text-sm text-[#151515]">{previewImage.title}</h3>
                {previewImage.idNum && (
                  <p className="font-mono text-xs text-gray-500">ID: {previewImage.idNum}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center min-h-[260px] max-h-[70vh] border border-gray-200">
              <img
                src={previewImage.url}
                alt="Document Preview"
                className="object-contain max-h-[70vh] w-auto max-w-full"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={previewImage.url}
                target="_blank"
                rel="noreferrer"
                download
                className="text-xs text-brand-primary font-bold hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Open Original Image</span>
              </a>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-[#151515]"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
