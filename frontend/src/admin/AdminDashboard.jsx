import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTheme } from '../context/ThemeContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Car,
  CalendarCheck,
  Users,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const AdminDashboard = () => {
  const { theme } = useTheme();
  const primaryColor = theme === 'purple' ? '#5935E8' : '#FF6600';
  const COLORS = [primaryColor, '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('month');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/admin/dashboard/stats');
        if (res.success) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [timeFilter]);

  if (loading) {
    return <LoadingSpinner text="Aggregating Real-Time Fleet Analytics..." />;
  }

  const stats = data?.stats || {};
  const recentBookings = data?.recentBookings || [];
  const revenueChartData = data?.revenueChartData || [];
  const categoryDistribution = data?.categoryDistribution || [];

  return (
    <div className="space-y-8">
      {/* Top Header & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Live Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Executive Dashboard</h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time fleet utilization, rental bookings, and revenue metrics.
          </p>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 bg-brand-dark p-1 rounded-2xl border border-white/10 overflow-x-auto no-scrollbar max-w-full self-start sm:self-auto">
          {['today', '7days', '30days', 'month'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f)}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                timeFilter === f
                  ? 'bg-brand-primary text-white shadow-primary-glow'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {f === 'today'
                ? 'Today'
                : f === '7days'
                ? 'Last 7 Days'
                : f === '30days'
                ? 'Last 30 Days'
                : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Revenue */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            {formatCurrency(stats.totalRevenue || 0)}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Verified Paid Bookings</span>
          </div>
        </div>

        {/* Total Bookings */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalBookings || 0}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-green-400 font-semibold">{stats.confirmedBookings || 0} Confirmed</span>
            <span>•</span>
            <span className="text-yellow-400 font-semibold">{stats.pendingBookings || 0} Pending</span>
          </div>
        </div>

        {/* Fleet Availability */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Fleet
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalVehicles || 0}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <span className="text-green-400 font-semibold">
              {stats.availableVehicles || 0} Available
            </span>
            <span>•</span>
            <span className="text-brand-primary font-semibold">
              {stats.rentedVehicles || 0} On Trip
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="glass-panel p-5 rounded-2xl border border-white/10 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Registered Clients
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-white mt-2">
            {stats.totalCustomers || 0}
          </p>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-purple-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>KYC Verified Drivers</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Monthly Revenue & Trend</h3>
              <p className="text-xs text-gray-400">Gross revenue generated from confirmed trips</p>
            </div>
            <span className="text-xs font-bold text-brand-primary px-3 py-1 rounded-full bg-brand-primary/15">
              INR (₹)
            </span>
          </div>

          <div className="h-60 sm:h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={primaryColor} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                <XAxis dataKey="name" stroke="#666" fontSize={11} />
                <YAxis stroke="#666" fontSize={11} tickFormatter={(val) => `₹${val / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#333',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value) => [formatCurrency(value), 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke={primaryColor}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart (4 cols) */}
        <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">Fleet Distribution</h3>
            <p className="text-xs text-gray-400">Vehicle volume by category classification</p>
          </div>

          <div className="h-60 sm:h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#333',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                />
                <Legend iconSize={8} wrapperStyle={{ fontSize: '11px', color: '#aaa' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Recent Customer Bookings</h3>
            <p className="text-xs text-gray-400">Latest reservations placed across the network</p>
          </div>
          <Link
            to="/admin/bookings"
            className="text-xs font-bold text-brand-primary hover:opacity-80 flex items-center gap-1"
          >
            <span>View All Bookings</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
              <tr>
                <th className="p-3">Reference</th>
                <th className="p-3">Customer</th>
                <th className="p-3">Vehicle</th>
                <th className="p-3">Rental Dates</th>
                <th className="p-3">Total Fare</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-500">
                    No recent bookings recorded.
                  </td>
                </tr>
              ) : (
                recentBookings.map((b) => (
                  <tr key={b._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {b.bookingReference}
                    </td>
                    <td className="p-3 font-semibold text-gray-200">
                      {b.customerDetails?.name || 'Customer'}
                    </td>
                    <td className="p-3 font-medium text-white whitespace-nowrap">
                      {b.vehicle?.name || `${b.vehicleType.toUpperCase()}`}
                    </td>
                    <td className="p-3 whitespace-nowrap text-gray-400">
                      {formatDate(b.pickupDate)} → {formatDate(b.returnDate)}
                    </td>
                    <td className="p-3 font-bold text-white whitespace-nowrap">
                      {formatCurrency(b.totalAmount)}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          b.paymentStatus === 'Paid'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {b.paymentStatus}
                      </span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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
                    <td className="p-3 text-right whitespace-nowrap">
                      <Link
                        to={`/admin/bookings?search=${b.bookingReference}`}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-[11px]"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
