import React, { useState } from 'react';
import { Settings, ShieldCheck, Building2, CreditCard, Sliders, CheckCircle2 } from 'lucide-react';

const AdminSettings = () => {
  const [saved, setSaved] = useState(false);
  const [companySettings, setCompanySettings] = useState({
    companyName: 'RideVista Mobility Technologies Pvt Ltd',
    supportEmail: 'concierge@ridevista.com',
    supportPhone: '+91 98765 43210',
    address: 'Aerocity Business Park, Terminal 3 Expressway, New Delhi 110037',
    gstin: '07AAAAA0000A1Z5',
    gstRate: '18',
    defaultSecurityDeposit: '5000',
    defaultKmAllowance: '250',
    extraKmPrice: '12',
    enableRazorpay: true,
    enablePayAtPickup: true,
    enableCashPayment: true,
    cancellationRefund24h: '90',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCompanySettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            System Configuration
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Platform Settings</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure company identity, GST tax calculations, and payment gateway controls.
          </p>
        </div>

        {saved && (
          <div className="px-4 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Identity */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand-primary" />
            Company & Statutory Details
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Company Legal Name</label>
              <input
                type="text"
                name="companyName"
                value={companySettings.companyName}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">GSTIN Number</label>
              <input
                type="text"
                name="gstin"
                value={companySettings.gstin}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Support Email</label>
              <input
                type="email"
                name="supportEmail"
                value={companySettings.supportEmail}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Support Hotline</label>
              <input
                type="text"
                name="supportPhone"
                value={companySettings.supportPhone}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Headquarters Address</label>
            <input
              type="text"
              name="address"
              value={companySettings.address}
              onChange={handleChange}
              className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Rental & Pricing Parameters */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-brand-primary" />
            Pricing, GST & Deposit Defaults
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">GST Tax Rate (%)</label>
              <input
                type="number"
                name="gstRate"
                value={companySettings.gstRate}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Default Security Deposit (₹)
              </label>
              <input
                type="number"
                name="defaultSecurityDeposit"
                value={companySettings.defaultSecurityDeposit}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">
                Refund Rate (&gt;24h) %
              </label>
              <input
                type="number"
                name="cancellationRefund24h"
                value={companySettings.cancellationRefund24h}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateway Controls */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-brand-primary" />
            Active Payment Channels
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                name="enableRazorpay"
                checked={companySettings.enableRazorpay}
                onChange={handleChange}
                className="accent-brand-primary"
              />
              <div>
                <p className="text-xs font-bold text-white">Enable Razorpay Payment Gateway</p>
                <p className="text-[11px] text-gray-400">
                  Allows customers to pay online via UPI, Credit/Debit cards, and Net Banking.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                name="enablePayAtPickup"
                checked={companySettings.enablePayAtPickup}
                onChange={handleChange}
                className="accent-brand-primary"
              />
              <div>
                <p className="text-xs font-bold text-white">Enable Pay at Pickup / Handover</p>
                <p className="text-[11px] text-gray-400">
                  Allows customers to reserve without upfront charges and pay at vehicle delivery.
                </p>
              </div>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="orange-gradient-btn w-full py-4 rounded-2xl text-white font-bold text-xs uppercase tracking-wider shadow-primary-glow"
        >
          Save Platform Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
