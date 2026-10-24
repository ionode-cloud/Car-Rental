import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { BarChart3, Download, FileSpreadsheet, Calendar } from 'lucide-react';

const AdminReports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchReport = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/reports?type=${reportType}`);
      if (res.success) {
        setReportData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [reportType]);

  // Export to CSV Function
  const handleExportCSV = () => {
    if (!reportData?.records || reportData.records.length === 0) {
      alert('No records available to export.');
      return;
    }

    const records = reportData.records;
    let csvContent = 'data:text/csv;charset=utf-8,';

    if (reportType === 'revenue') {
      csvContent += 'Booking Reference,Customer,Vehicle,Amount (INR),Date,Payment Status\n';
      records.forEach((r) => {
        csvContent += `"${r.bookingReference}","${r.customer?.name || ''}","${r.vehicle?.name || ''}",${r.totalAmount},"${new Date(r.createdAt).toISOString()}","${r.paymentStatus}"\n`;
      });
    } else {
      csvContent += 'Booking Reference,Customer,Vehicle,Type,Pickup Date,Return Date,Amount (INR),Status\n';
      records.forEach((r) => {
        csvContent += `"${r.bookingReference}","${r.customer?.name || ''}","${r.vehicle?.name || ''}","${r.vehicleType}","${new Date(r.pickupDate).toISOString()}","${new Date(r.returnDate).toISOString()}",${r.totalAmount},"${r.bookingStatus}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RideVista_Report_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Data Intelligence
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Financial & Trip Reports</h1>
          <p className="text-xs text-gray-400 mt-1">
            Generate and export consolidated audit records for finance and operations.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-primary-glow"
        >
          <Download className="w-4 h-4" />
          <span>Export Data to CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-brand-dark p-1 rounded-2xl border border-white/10 w-fit">
        <button
          onClick={() => setReportType('revenue')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'revenue'
              ? 'bg-brand-primary text-white shadow-primary-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Revenue & Payments
        </button>
        <button
          onClick={() => setReportType('bookings')}
          className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'bookings'
              ? 'bg-brand-primary text-white shadow-primary-glow'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Bookings & Trips
        </button>
      </div>

      {/* Report Records Table */}
      <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
        {loading ? (
          <LoadingSpinner text="Generating Report..." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="text-[11px] uppercase tracking-wider text-gray-400 bg-white/5 border-b border-white/10">
                <tr>
                  <th className="p-4">Reference</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Vehicle</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">{reportType === 'revenue' ? 'Payment Status' : 'Trip Status'}</th>
                  <th className="p-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {reportData?.records?.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No records found for this report period.
                    </td>
                  </tr>
                ) : (
                  reportData?.records?.map((r) => (
                    <tr key={r._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {r.bookingReference}
                      </td>
                      <td className="p-4 text-gray-200">
                        {r.customer?.name || r.customerDetails?.name || 'Customer'}
                      </td>
                      <td className="p-4 text-white">
                        {r.vehicle?.name || r.vehicleType}
                      </td>
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {formatCurrency(r.totalAmount)}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                          {reportType === 'revenue' ? r.paymentStatus : r.bookingStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right text-gray-400 whitespace-nowrap">
                        {formatDate(r.createdAt)}
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

export default AdminReports;
