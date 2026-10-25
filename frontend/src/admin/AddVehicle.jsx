import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { Car, ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const AddVehicle = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    vehicleType: 'car',
    category: 'Luxury',
    description: '',
    images: [''],
    pricePerDay: '',
    pricePerHour: '',
    securityDeposit: '5000',
    includedKilometers: '250',
    extraKilometerPrice: '15',
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: '5',
    engineCapacity: '1998cc',
    mileage: '16.5 km/l',
    registrationYear: '2024',
    ac: true,
    helmetAvailable: false,
    pickupLocation: 'Aerocity Hub, City Center Hub',
    status: 'active',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (index, value) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
  };

  const removeImageField = (index) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, images: updatedImages.length ? updatedImages : [''] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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

      const res = await api.post('/admin/vehicles', payload);
      if (res.success) {
        navigate('/admin/vehicles');
      }
    } catch (err) {
      setError(err.message || 'Failed to add vehicle.');
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-2xl font-black text-white">Add New Fleet Vehicle</h1>
          <p className="text-xs text-gray-400">Configure vehicle specifications, pricing, and media.</p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Vehicle Info */}
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
                placeholder="e.g. BMW 3 Series Limousine"
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
                placeholder="e.g. BMW"
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
                placeholder="e.g. 330Li M Sport"
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
                onChange={(e) => {
                  const val = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    vehicleType: val,
                    category: val === 'scooty' ? 'Electric Scooty' : 'Luxury',
                    helmetAvailable: val === 'scooty',
                    seatingCapacity: val === 'scooty' ? '2' : '5',
                  }));
                }}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="car">Car</option>
                <option value="scooty">Scooty / Two-Wheeler</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder={formData.vehicleType === 'car' ? 'Luxury, SUV, Sedan, etc.' : 'Electric Scooty, Standard, etc.'}
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
              placeholder="Highlight luxury interior, horsepower, key inclusions..."
              required
              className="w-full bg-brand-dark border border-white/15 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-brand-primary"
            />
          </div>
        </div>

        {/* Pricing & Kilometers */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Pricing & Distance Structure (INR ₹)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Price Per Day (₹)</label>
              <input
                type="number"
                name="pricePerDay"
                value={formData.pricePerDay}
                onChange={handleChange}
                placeholder="4500"
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

        {/* Specifications */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Technical Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Fuel / Power</label>
              <select
                name="fuelType"
                value={formData.fuelType}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
                <option value="CNG">CNG</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Transmission</label>
              <select
                name="transmission"
                value={formData.transmission}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
              >
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Seating Capacity</label>
              <input
                type="number"
                name="seatingCapacity"
                value={formData.seatingCapacity}
                onChange={handleChange}
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-300 block mb-1">Mileage / Range</label>
              <input
                type="text"
                name="mileage"
                value={formData.mileage}
                onChange={handleChange}
                placeholder="e.g. 16 km/l or 140 km/charge"
                className="w-full bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                name="ac"
                checked={formData.ac}
                onChange={handleChange}
                className="accent-brand-primary"
              />
              <span>Air Conditioned</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
              <input
                type="checkbox"
                name="helmetAvailable"
                checked={formData.helmetAvailable}
                onChange={handleChange}
                className="accent-brand-primary"
              />
              <span>Helmets Included (Scooties)</span>
            </label>
          </div>
        </div>

        {/* Media & Images */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              High-Resolution Image URLs
            </h3>
            <button
              type="button"
              onClick={addImageField}
              className="text-xs font-bold text-brand-primary hover:opacity-80 flex items-center gap-1"
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
                  placeholder="https://images.unsplash.com/..."
                  required={idx === 0}
                  className="flex-1 bg-brand-dark border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary"
                />
                {formData.images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImageField(idx)}
                    className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Link
            to="/admin/vehicles"
            className="flex-1 py-3.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-wider text-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="orange-gradient-btn flex-1 py-3.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-primary-glow"
          >
            {loading ? 'Saving Vehicle...' : 'Save & Publish Vehicle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddVehicle;
