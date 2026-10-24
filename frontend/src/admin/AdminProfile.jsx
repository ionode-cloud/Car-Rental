import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { ShieldCheck, User, Lock, CheckCircle2, AlertCircle } from 'lucide-react';

const AdminProfile = () => {
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setProfileSuccess('');

    try {
      const res = await authService.updateProfile({ name, phone });
      if (res.success) {
        updateUser(res.user);
        setProfileSuccess('Admin credentials updated successfully!');
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordSuccess('');
    setPasswordError('');

    try {
      const res = await authService.changePassword({ currentPassword, newPassword });
      if (res.success) {
        setPasswordSuccess('Admin password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err) {
      setPasswordError(err.message || 'Password update failed.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Security Console
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Administrator Profile</h1>
        <p className="text-xs text-gray-400 mt-1">
          Manage your executive credentials, contact details, and master authentication password.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Info */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4 text-brand-primary" />
            Admin Details
          </h3>

          {profileSuccess && (
            <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs">
              {profileSuccess}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Admin Email (Fixed)</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-brand-dark/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="orange-gradient-btn w-full py-3 rounded-xl text-white font-bold text-xs uppercase tracking-wider"
            >
              {loading ? 'Saving...' : 'Update Admin Info'}
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-primary" />
            Update Password
          </h3>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-green-500/15 border border-green-500/30 text-green-400 text-xs">
              {passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min 6 characters"
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white font-bold text-xs uppercase tracking-wider w-full"
            >
              Change Admin Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
