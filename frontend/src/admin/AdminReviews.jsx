import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/reviews');
      if (res.reviews) {
        setReviews(res.reviews);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/reviews/${id}/status`, { status });
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to update review.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    try {
      await api.delete(`/admin/reviews/${id}`);
      fetchReviews();
    } catch (err) {
      alert(err.message || 'Failed to delete review.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Reputation & Social Proof
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Customer Reviews</h1>
        <p className="text-xs text-gray-400 mt-1">
          Moderate customer feedback, approve verified testimonials, and maintain review standards.
        </p>
      </div>

      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4">Review Content</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No customer reviews submitted yet.
                    </td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {r.customerName || r.customer?.name}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {r.vehicle?.name || r.vehicleName || 'Fleet Rental'}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{r.rating} / 5</span>
                        </div>
                      </td>

                      <td className="p-4 max-w-xs text-gray-300 line-clamp-2">
                        "{r.comment}"
                      </td>

                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {formatDate(r.createdAt)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.status === 'approved'
                              ? 'bg-green-500/20 text-green-400'
                              : r.status === 'pending'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {r.status}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'approved')}
                              className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 font-bold text-[10px]"
                            >
                              Approve
                            </button>
                          )}
                          {r.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateStatus(r._id, 'rejected')}
                              className="px-2.5 py-1 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 font-bold text-[10px]"
                            >
                              Reject
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(r._id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
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
    </div>
  );
};

export default AdminReviews;
