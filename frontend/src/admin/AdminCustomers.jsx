import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Users, Search, CheckCircle, XCircle } from 'lucide-react';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await api.get('/admin/customers', { params });
      if (res.success) {
        setCustomers(res.customers || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.patch(`/admin/customers/${id}/status`);
      if (res.success) {
        fetchCustomers();
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle customer status.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Client Directory
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Customer Accounts</h1>
        <p className="text-xs text-gray-400 mt-1">
          Monitor registered customers, total trip reservations, and account permissions.
        </p>
      </div>

      {/* Search Input */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchCustomers();
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            placeholder="Search by customer name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-dark border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-brand-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <span className="text-xs text-gray-400 hidden sm:inline-block">
          Total Registered: <strong className="text-white">{customers.length}</strong>
        </span>
      </div>

      {/* Customers Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Total Trips</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No customer accounts found.
                    </td>
                  </tr>
                ) : (
                  customers.map((c) => (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-2.5 font-bold text-white">
                        <div className="w-7 h-7 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center font-bold text-xs">
                          {c.name?.charAt(0)}
                        </div>
                        <span>{c.name}</span>
                      </td>

                      <td className="p-4 text-gray-300">{c.email}</td>

                      <td className="p-4 font-mono text-gray-400">{c.phone}</td>

                      <td className="p-4 font-bold text-brand-primary">
                        {c.totalBookings || 0} Bookings
                      </td>

                      <td className="p-4 text-gray-400">{formatDate(c.createdAt)}</td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.isActive
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {c.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(c._id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            c.isActive
                              ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                              : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                          }`}
                        >
                          {c.isActive ? 'Suspend' : 'Activate'}
                        </button>
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

export default AdminCustomers;
