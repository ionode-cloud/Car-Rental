import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Wrench, PlusCircle, Trash2, Edit2, X } from 'lucide-react';

const AdminServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSvc, setEditingSvc] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    pricing: 'Starting at ₹999/day',
    features: 'Doorstep Handover, 24/7 Roadside Assistance, Verified Fleet',
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/services');
      if (res.services) {
        setServices(res.services);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleOpenAdd = () => {
    setEditingSvc(null);
    setFormData({
      title: '',
      description: '',
      image: '',
      pricing: 'Starting at ₹999/day',
      features: 'Doorstep Handover, 24/7 Roadside Assistance, Verified Fleet',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (svc) => {
    setEditingSvc(svc);
    setFormData({
      title: svc.title,
      description: svc.description,
      image: svc.image,
      pricing: svc.pricing,
      features: Array.isArray(svc.features) ? svc.features.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rental service?')) return;
    try {
      await api.delete(`/admin/services/${id}`);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to delete service.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      if (editingSvc) {
        await api.put(`/admin/services/${editingSvc._id}`, payload);
      } else {
        await api.post('/admin/services', payload);
      }

      setModalOpen(false);
      fetchServices();
    } catch (err) {
      alert(err.message || 'Failed to save service.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Service Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Rental Services</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure available mobility solutions displayed on the public services page.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-primary-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full">
            <LoadingSpinner />
          </div>
        ) : services.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-gray-500 rounded-3xl">
            No services created yet.
          </div>
        ) : (
          services.map((svc) => (
            <div
              key={svc._id}
              className="glass-panel rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden relative">
                <img src={svc.image} alt={svc.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 right-3 flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(svc)}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-white hover:bg-black/80"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(svc._id)}
                    className="p-1.5 rounded-lg bg-black/60 backdrop-blur-md text-red-400 hover:bg-black/80"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[10px] font-bold text-brand-primary uppercase">
                  {svc.pricing}
                </span>
                <h3 className="text-base font-bold text-white">{svc.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-3">{svc.description}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-white">
              {editingSvc ? 'Edit Rental Service' : 'Add Rental Service'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Service Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="e.g. Wedding Luxury Convoy"
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Pricing Label</label>
                <input
                  type="text"
                  value={formData.pricing}
                  onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                  placeholder="e.g. Starting at ₹1,800/day"
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  required
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="w-full bg-brand-black border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">
                  Features (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.features}
                  onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                  placeholder="Feature 1, Feature 2, Feature 3"
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-white/10 text-white text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="orange-gradient-btn flex-1 py-2.5 rounded-xl text-white text-xs font-bold"
                >
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
