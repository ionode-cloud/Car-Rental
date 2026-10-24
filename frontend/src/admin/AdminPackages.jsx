import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import LoadingSpinner from '../components/LoadingSpinner';
import { Package, PlusCircle, Trash2, Edit2, X, CheckCircle2 } from 'lucide-react';

const AdminPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Daily',
    duration: '24 Hours',
    price: '',
    includedKilometers: '200',
    extraKilometerPrice: '12',
    discount: '0',
    description: '',
    features: 'Doorstep Delivery, Full Sanitization, 24/7 Roadside Rescue',
  });

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await api.get('/packages');
      if (res.packages) {
        setPackages(res.packages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({
      name: '',
      category: 'Daily',
      duration: '24 Hours',
      price: '',
      includedKilometers: '200',
      extraKilometerPrice: '12',
      discount: '0',
      description: '',
      features: 'Doorstep Delivery, Full Sanitization, 24/7 Roadside Rescue',
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (pkg) => {
    setEditingPkg(pkg);
    setFormData({
      name: pkg.name,
      category: pkg.category,
      duration: pkg.duration,
      price: pkg.price,
      includedKilometers: pkg.includedKilometers,
      extraKilometerPrice: pkg.extraKilometerPrice,
      discount: pkg.discount || 0,
      description: pkg.description,
      features: Array.isArray(pkg.features) ? pkg.features.join(', ') : '',
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this rental package?')) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      fetchPackages();
    } catch (err) {
      alert(err.message || 'Failed to delete package.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        includedKilometers: Number(formData.includedKilometers),
        extraKilometerPrice: Number(formData.extraKilometerPrice),
        discount: Number(formData.discount),
        features: formData.features.split(',').map((f) => f.trim()).filter(Boolean),
      };

      if (editingPkg) {
        await api.put(`/admin/packages/${editingPkg._id}`, payload);
      } else {
        await api.post('/admin/packages', payload);
      }

      setModalOpen(false);
      fetchPackages();
    } catch (err) {
      alert(err.message || 'Failed to save package.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
            Package Catalog
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Rental Packages</h1>
          <p className="text-xs text-gray-400 mt-1">
            Configure kilometer quotas, bundled rates, and public package offerings.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="orange-gradient-btn px-5 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-primary-glow"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Package</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full">
            <LoadingSpinner />
          </div>
        ) : packages.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-gray-500 rounded-3xl">
            No packages created yet.
          </div>
        ) : (
          packages.map((pkg) => (
            <div
              key={pkg._id}
              className="glass-panel p-6 rounded-3xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-brand-primary/20 text-brand-primary uppercase">
                    {pkg.category}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mt-3">{pkg.name}</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{pkg.description}</p>

                <div className="my-4 p-3 rounded-xl bg-white/5 border border-white/5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-bold text-white">
                      {formatCurrency(pkg.price)}/{pkg.duration}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-gray-400">Included Distance:</span>
                    <span className="font-bold text-brand-primary">{pkg.includedKilometers} km</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Form */}
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
              {editingPkg ? 'Edit Rental Package' : 'Create Rental Package'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Weekend Hill Station Escape"
                  className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-brand-black border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option value="Daily">Daily</option>
                    <option value="Weekend">Weekend</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Outstation">Outstation</option>
                    <option value="Corporate">Corporate</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Duration Label</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    required
                    placeholder="e.g. 72 Hours"
                    className="w-full bg-brand-black border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                    className="w-full bg-brand-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Free km</label>
                  <input
                    type="number"
                    value={formData.includedKilometers}
                    onChange={(e) => setFormData({ ...formData, includedKilometers: e.target.value })}
                    required
                    className="w-full bg-brand-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-300 block mb-1">Extra km (₹)</label>
                  <input
                    type="number"
                    value={formData.extraKilometerPrice}
                    onChange={(e) => setFormData({ ...formData, extraKilometerPrice: e.target.value })}
                    className="w-full bg-brand-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-300 block mb-1">Description</label>
                <textarea
                  rows="2"
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
                  Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
