import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import VehicleModal from './VehicleModal';
import VehicleTableSkeleton from './VehicleTableSkeleton';
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

const AdminVehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination states
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [totalVehicles, setTotalVehicles] = useState(0);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit,
      };
      if (search.trim()) params.search = search.trim();
      if (typeFilter !== 'all') params.vehicleType = typeFilter;
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await api.get('/admin/vehicles', { params });
      if (res.success) {
        setVehicles(res.vehicles || []);
        setTotalPages(res.totalPages || 1);
        setTotalVehicles(res.total !== undefined ? res.total : (res.vehicles ? res.vehicles.length : 0));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [page, limit, typeFilter, statusFilter]);

  // Open Add modal if redirected with ?add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      handleOpenAdd();
      setSearchParams((params) => {
        const next = new URLSearchParams(params);
        next.delete('add');
        return next;
      }, { replace: true });
    }
  }, [searchParams]);

  const handleOpenAdd = () => {
    setActionError('');
    setActionSuccess('');
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (vehicle) => {
    setActionError('');
    setActionSuccess('');
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const handleModalSuccess = (msg) => {
    setActionSuccess(msg);
    fetchVehicles();
  };

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
        if (vehicles.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchVehicles();
        }
      }
    } catch (err) {
      setActionError(err.message || 'Cannot delete vehicle with active bookings.');
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (page >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', page - 1, page, page + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Fleet Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#151515]">Vehicle Inventory</h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage your fleet of luxury cars, SUVs, and electric scooties.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-primary-glow cursor-pointer transition-transform active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      {actionError && (
        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-medium">
          {actionError}
        </div>
      )}
      {actionSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
          {actionSuccess}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            fetchVehicles();
          }}
          className="relative w-full md:w-80"
        >
          <input
            type="text"
            placeholder="Search by name, model, brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary shadow-xs"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </form>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Vehicle Types</option>
            <option value="car">Cars Only</option>
            <option value="scooty">Scooties Only</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="flex-1 sm:flex-initial bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>
      </div>

      {/* Vehicles Table with Skeleton Loading */}
      <div className="glass-panel rounded-2xl border border-gray-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <VehicleTableSkeleton rows={limit} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-3 sm:p-3.5">Vehicle</th>
                  <th className="p-3 sm:p-3.5">Type</th>
                  <th className="p-3 sm:p-3.5">Category</th>
                  <th className="p-3 sm:p-3.5">Daily Rate</th>
                  <th className="p-3 sm:p-3.5">Deposit</th>
                  <th className="p-3 sm:p-3.5">Status</th>
                  <th className="p-3 sm:p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-400">
                      No vehicles found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  vehicles.map((v) => (
                    <tr key={v._id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-3 sm:p-3.5 flex items-center gap-3">
                        <img
                          src={v.images?.[0] || 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=1200&auto=format&fit=crop'}
                          alt=""
                          className="w-14 h-10 object-cover rounded-lg shrink-0 border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-[#151515] text-sm">{v.name}</p>
                          <p className="text-[11px] text-gray-500">{v.brand} • {v.registrationYear}</p>
                        </div>
                      </td>

                      <td className="p-3 sm:p-3.5 uppercase font-bold text-brand-primary text-[11px]">
                        {v.vehicleType}
                      </td>

                      <td className="p-3 sm:p-3.5 font-medium text-gray-700">
                        {v.category}
                      </td>

                      <td className="p-3 sm:p-3.5 font-bold text-[#151515] whitespace-nowrap">
                        {formatCurrency(v.pricePerDay)}/day
                      </td>

                      <td className="p-3 sm:p-3.5 text-gray-500 whitespace-nowrap">
                        {formatCurrency(v.securityDeposit)}
                      </td>

                      <td className="p-3 sm:p-3.5">
                        <button
                          onClick={() => handleToggleStatus(v._id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            v.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
                          }`}
                        >
                          {v.status}
                        </button>
                      </td>

                      <td className="p-3 sm:p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(v)}
                            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-colors cursor-pointer"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(v._id, v.name)}
                            className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
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

      {/* Pagination Controls */}
      {!loading && totalVehicles > 0 && (
        <div className="glass-panel p-3.5 sm:p-4 rounded-2xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Entries summary & per-page selector */}
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-gray-600 w-full md:w-auto">
            <span>
              Showing <span className="font-bold text-[#151515]">{Math.min((page - 1) * limit + 1, totalVehicles)}</span> to{' '}
              <span className="font-bold text-[#151515]">{Math.min(page * limit, totalVehicles)}</span> of{' '}
              <span className="font-bold text-brand-primary">{totalVehicles}</span> vehicles
            </span>

            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-gray-200">
              <span className="text-[11px] text-gray-500">Rows:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs text-[#151515] focus:outline-none cursor-pointer shadow-xs"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* Page navigation controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => setPage(1)}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="First Page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page <= 1}
                className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Previous Page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {/* Page numbers */}
              <div className="flex items-center gap-1">
                {getPageNumbers().map((p, idx) =>
                  p === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-1.5 text-xs text-gray-400">
                      ...
                    </span>
                  ) : (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className={`min-w-[32px] h-8 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        page === p
                          ? 'orange-gradient-btn text-white shadow-primary-glow font-bold'
                          : 'bg-gray-100 border border-gray-200 text-gray-700 hover:bg-gray-200 hover:text-black'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Next Page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="p-2 rounded-xl bg-gray-100 border border-gray-200 text-gray-700 hover:text-black hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                title="Last Page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Vehicle Add / Edit Modal Form */}
      <VehicleModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingVehicle(null);
        }}
        onSuccess={handleModalSuccess}
        vehicle={editingVehicle}
      />
    </div>
  );
};

export default AdminVehicles;
