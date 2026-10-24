import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { CreditCard, Search, ArrowUpRight } from 'lucide-react';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/admin/payments');
        if (res.success) {
          setPayments(res.payments || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Financial Ledger
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Payment Transactions</h1>
        <p className="text-xs text-gray-400 mt-1">
          Real-time transaction logs, Razorpay order records, and verification status.
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
                  <th className="p-4">Transaction / Razorpay ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Booking Ref</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No payment transactions recorded.
                    </td>
                  </tr>
                ) : (
                  payments.map((p) => (
                    <tr key={p._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-mono font-bold text-white whitespace-nowrap">
                        {p.transactionId}
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-white">{p.customer?.name || 'Customer'}</p>
                        <p className="text-[11px] text-gray-400">{p.customer?.email}</p>
                      </td>

                      <td className="p-4 font-bold text-brand-primary whitespace-nowrap">
                        {p.booking?.bookingReference || 'N/A'}
                      </td>

                      <td className="p-4 font-black text-white whitespace-nowrap">
                        {formatCurrency(p.amount)}
                      </td>

                      <td className="p-4 text-gray-300 whitespace-nowrap">
                        {p.paymentMethod}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.status === 'Paid'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>

                      <td className="p-4 text-right text-gray-400 whitespace-nowrap">
                        {formatDate(p.createdAt)}
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

export default AdminPayments;
