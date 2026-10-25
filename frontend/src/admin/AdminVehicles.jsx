import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Car,
  PlusCircle,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Star,
  RotateCcw,
} from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (typeFilter !== 'all') params.vehicleType = typeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/admin/vehicles', { params });
      if (res.success) {
        setVehicles(res.vehicles || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [typeFilter, statusFilter]);

  const handleToggleStatus = async (id) => {
    setActionError('');
    setActionSuccess('');
    try {
      const res = await api.patch(`/admin/vehicles/${id}/status`);
      if (res.success) {
        setActionSuccess(res.message);
        fetchVehicles();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to toggle vehicle status.');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    setActionError('');
    setActionSuccess('');

    try {
      const res = await api.delete(`/admin/vehicles/${id}`);
      if (res.success) {
        setActionSuccess('Vehicle deleted successfully.');
        fetchVehicles();
      }
    } catch (err) {
      setActionError(err.message || 'Cannot delete vehicle with active bookings.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Fleet Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Vehicle Inventory</h1>
          <p className="text-xs text-gray-400 mt-1">
            Manage your fleet of luxury cars, SUVs, and electric scooties.
          </p>
        </div>

        <Link
          to="/admin/vehicles/add"
          className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-primary-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs">
          {actionSuccess}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchVehicles();
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            placeholder="Search by name, model, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-brand-dark border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-primary"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-brand-dark border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Vehicle Types</option>
            <option value="car">Cars Only</option>
            <option value="scooty">Scooties Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 sm:flex-initial bg-brand-dark border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Daily Rate</th>
                  <th className="p-4">Deposit</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={v.images?.[0] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'}
                          alt=""
                          className="w-14 h-10 object-cover rounded-lg shrink-0"
                        />
                        <div>
                          <p className="font-bold text-white text-sm">{v.name}</p>
                          <p className="text-[11px] text-gray-400">{v.brand} • {v.registrationYear}</p>
                        </div>
                      </td>

                      <td className="p-4 uppercase font-bold text-brand-primary text-[11px]">
                        {v.vehicleType}
                      </td>

                      <td className="p-4 font-medium text-gray-200">
                        {v.category}
                      </td>

                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {formatCurrency(v.pricePerDay)}/day
                      </td>

                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {formatCurrency(v.securityDeposit)}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleToggleStatus(v._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            v.status === 'active'
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {v.status}
                        </button>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/vehicles/edit/${v._id}`}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(v._id, v.name)}
                            className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                            title="Delete Vehicle"
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

export default AdminVehicles;
