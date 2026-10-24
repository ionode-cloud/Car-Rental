import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    vehicleType: 'car',
    category: '',
    description: '',
    images: [''],
    pricePerDay: '',
    pricePerHour: '',
    securityDeposit: '',
    includedKilometers: '',
    extraKilometerPrice: '',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '',
    engineCapacity: '',
    mileage: '',
    registrationYear: '',
    ac: true,
    helmetAvailable: false,
    pickupLocation: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await api.get(`/vehicles/${id}`);
        if (res.success && res.vehicle) {
          const v = res.vehicle;
          setFormData({
            name: v.name || '',
            brand: v.brand || '',
            model: v.model || '',
            vehicleType: v.vehicleType || 'car',
            category: v.category || '',
            description: v.description || '',
            images: v.images?.length ? v.images : [''],
            pricePerDay: v.pricePerDay || '',
            pricePerHour: v.pricePerHour || '',
            securityDeposit: v.securityDeposit || '',
            includedKilometers: v.includedKilometers || '',
            extraKilometerPrice: v.extraKilometerPrice || '',
            fuelType: v.fuelType || 'Petrol',
            transmission: v.transmission || 'Automatic',
            seatingCapacity: v.seatingCapacity || '',
            engineCapacity: v.engineCapacity || '',
            mileage: v.mileage || '',
            registrationYear: v.registrationYear || '',
            ac: !!v.ac,
            helmetAvailable: !!v.helmetAvailable,
            pickupLocation: Array.isArray(v.pickupLocation) ? v.pickupLocation.join(', ') : '',
            status: v.status || 'active',
          });
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch vehicle details.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...formData.images];
    updated[index] = value;
    setFormData((prev) => ({ ...prev, images: updated }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const updated = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updated.length ? updated : [''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const cleanImages = formData.images.filter((img) => img.trim() !== '');
      if (cleanImages.length === 0) {
        throw new Error('Please provide at least one valid image URL.');
      }

      const locationsArray = formData.pickupLocation
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        ...formData,
        images: cleanImages,
        pickupLocation: locationsArray,
        pricePerDay: Number(formData.pricePerDay),
        pricePerHour: Number(formData.pricePerHour) || 0,
        securityDeposit: Number(formData.securityDeposit),
        includedKilometers: Number(formData.includedKilometers),
        extraKilometerPrice: Number(formData.extraKilometerPrice),
        seatingCapacity: Number(formData.seatingCapacity),
        registrationYear: Number(formData.registrationYear),
      };

      const res = await api.put(`/admin/vehicles/${id}`, payload);
      if (res.success) {
        navigate('/admin/vehicles');
      }
    } catch (err) {
      setError(err.message || 'Failed to update vehicle.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Fetching Vehicle Specs..." />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/admin/vehicles"
          className="p-2 rounded-xl bg-white/10 hover:bg-white/15 text-white"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-white">Edit Fleet Vehicle</h1>
          <p className="text-xs text-gray-400">Update specifications, pricing, and availability status.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Vehicle Overview
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Vehicle Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Brand / Make</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Model Trim</label>
              <input
                type="text"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Vehicle Type</label>
              <select
                name="vehicleType"
                value={formData.vehicleType}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="car">Car</option>
                <option value="scooty">Scooty</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Registration Year</label>
              <input
                type="number"
                name="registrationYear"
                value={formData.registrationYear}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full bg-brand-dark border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Pricing & Distance (INR ₹)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Price Per Day (₹)</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                required
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Security Deposit (₹)</label>
              <input
                type="number"
                name="securityDeposit"
                value={formData.securityDeposit}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Free km / Day</label>
              <input
                type="number"
                name="includedKilometers"
                value={formData.includedKilometers}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Extra km Rate (₹)</label>
              <input
                type="number"
                name="extraKilometerPrice"
                value={formData.extraKilometerPrice}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Vehicle Images (URLs)
            </h3>
            <button
              type="button"
              onClick={addImageField}
              className="text-xs font-bold text-brand-primary flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add URL</span>
            </button>
          </div>

          <div className="space-y-3">
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="url"
                  value={img}
                  onChange={(e) => handleImageChange(idx, e.target.value)}
                  required={idx === 0}
                  className="flex-1 bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <Link
            to="/admin/vehicles"
            className="flex-1 py-3.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider text-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="orange-gradient-btn flex-1 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
          >
            {submitting ? 'Updating Vehicle...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditVehicle;
