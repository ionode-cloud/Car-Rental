import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatDate } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { MessageSquare, Mail, Phone, Trash2, CheckCircle2 } from 'lucide-react';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/contacts');
      if (res.contacts) {
        setContacts(res.contacts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admin/contacts/${id}/status`, { status });
      fetchContacts();
    } catch (err) {
      alert(err.message || 'Failed to update contact status.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert(err.message || 'Failed to delete contact.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
          Concierge Inbox
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-white">Contact Messages</h1>
        <p className="text-xs text-gray-400 mt-1">
          Review customer inquiries received through the public contact form.
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
                  <th className="p-4">Sender</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Inquiry Message</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">
                      No customer inquiries received yet.
                    </td>
                  </tr>
                ) : (
                  contacts.map((c) => (
                    <tr key={c._id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white whitespace-nowrap">
                        {c.name}
                      </td>

                      <td className="p-4">
                        <p className="text-gray-200">{c.email}</p>
                        <p className="text-[11px] font-mono text-gray-400">{c.phone}</p>
                      </td>

                      <td className="p-4 font-semibold text-brand-primary whitespace-nowrap">
                        {c.subject}
                      </td>

                      <td className="p-4 text-gray-300 max-w-sm">
                        {c.message}
                      </td>

                      <td className="p-4 text-gray-400 whitespace-nowrap">
                        {formatDate(c.createdAt)}
                      </td>

                      <td className="p-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'resolved'
                              ? 'bg-green-500/20 text-green-400'
                              : c.status === 'read'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {c.status}
                        </span>
                      </td>

                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {c.status !== 'resolved' && (
                            <button
                              onClick={() => handleUpdateStatus(c._id, 'resolved')}
                              className="px-2.5 py-1 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 font-bold text-[10px]"
                            >
                              Resolve
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(c._id)}
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

export default AdminContacts;
