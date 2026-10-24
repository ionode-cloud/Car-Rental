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
} from 'lucide-react';

const AdminBookings = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
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

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;
      if (paymentFilter !== 'all') params.paymentStatus = paymentFilter;
      if (typeFilter !== 'all') params.vehicleType = typeFilter;

      const res = await api.get('/admin/bookings', { params });
      if (res.success) {
        setBookings(res.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, paymentFilter, typeFilter]);

  const handleOpenModal = (b) => {
    setSelectedBooking(b);
    setNewStatus(b.bookingStatus);
    setNewPaymentStatus(b.paymentStatus);
    setStatusNote('');
    setSuccessMsg('');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setUpdating(true);

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
        }, 1200);
      }
    } catch (err) {
      alert(err.message || 'Failed to update booking status.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Reservation Management
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Rental Bookings</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review, confirm, dispatch, and manage booking invoices and payment verification.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBookings();
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            placeholder="Search by reference, customer name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-dark border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-brand-dark border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Booking Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Active">Active (On Trip)</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="bg-brand-dark border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Payment Statuses</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer Details</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Trip Dates</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="p-8 text-center text-gray-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : (
                  bookings.map((b) => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {b.bookingReference}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-white">{b.customerDetails?.name || 'Customer'}</p>
                        <p className="text-[11px] text-gray-400">{b.customerDetails?.phone}</p>
                        <p className="text-[11px] text-gray-500 truncate max-w-[140px]">{b.customerDetails?.email}</p>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <p className="font-medium text-white">{b.vehicle?.name || b.vehicleType}</p>
                        <span className="text-[10px] text-brand-primary uppercase font-bold">
                          {b.vehicleType}
                        </span>
                      </td>

                      <td className="p-4 whitespace-nowrap text-gray-400">
                        <p className="font-medium text-white">{formatDate(b.pickupDate)}</p>
                        <p className="text-[11px]">to {formatDate(b.returnDate)}</p>
                      </td>

                      <td className="p-4 font-black text-white whitespace-nowrap">
                        {formatCurrency(b.totalAmount)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            b.paymentStatus === 'Paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {b.paymentStatus}
                        </span>
                        <p className="text-[10px] text-gray-500 mt-0.5">{b.paymentMethod}</p>
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            b.bookingStatus === 'Confirmed'
                              ? 'bg-green-500/20 text-green-400'
                              : b.bookingStatus === 'Active'
                              ? 'bg-blue-500/20 text-blue-400'
                              : b.bookingStatus === 'Completed'
                              ? 'bg-purple-500/20 text-purple-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(b)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                          >
                            Manage
                          </button>
                          <a
                            href={`/api/bookings/${b._id}/invoice`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                            title="Download Invoice"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Management & Status Transition Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-bold text-brand-primary uppercase">Manage Booking</span>
              <h2 className="text-xl font-bold text-white mt-0.5">
                {selectedBooking.bookingReference}
              </h2>
            </div>

            {successMsg && (
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400 text-xs font-semibold">
                {successMsg}
              </div>
            )}

            {/* Quick Trip Overview */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="font-bold text-white">
                  {selectedBooking.customerDetails?.name} ({selectedBooking.customerDetails?.phone})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Driver License:</span>
                <span className="font-mono text-gray-200">
                  {selectedBooking.customerDetails?.drivingLicenseNumber || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pickup:</span>
                <span className="text-white">
                  {formatDate(selectedBooking.pickupDate)} • {selectedBooking.pickupLocation}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Return:</span>
                <span className="text-white">
                  {formatDate(selectedBooking.returnDate)} • {selectedBooking.returnLocation}
                </span>
              </div>
              <div className="flex justify-between pt-1 border-t border-white/10 font-bold">
                <span className="text-gray-300">Total Fare:</span>
                <span className="text-brand-primary">{formatCurrency(selectedBooking.totalAmount)}</span>
              </div>
            </div>

            {/* Status Transition Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Trip Booking Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Active">Active (Vehicle Picked Up)</option>
                  <option value="Completed">Completed (Returned)</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Payment Status
                </label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Internal Audit Log Note
                </label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Verified license at terminal pickup, vehicle odometer recorded"
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="orange-gradient-btn flex-1 py-2.5 rounded-xl text-white text-xs font-bold"
                >
                  {updating ? 'Saving Changes...' : 'Save & Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
