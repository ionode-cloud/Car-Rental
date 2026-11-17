import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  X,
  Plus,
  Trash2,
  Car,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';

export const VehicleModal = ({ isOpen, onClose, onSuccess, vehicle = null }) => {
  const isEdit = Boolean(vehicle && vehicle._id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDefaultFormData = () => ({
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
    registrationYear: new Date().getFullYear().toString(),
    ac: true,
    helmetAvailable: false,
    pickupLocation: 'Airport Terminal 1, City Center Hub, Downtown Hub',
    status: 'active',
  });

  const [formData, setFormData] = useState(getDefaultFormData());

  // Populate or reset form whenever modal opens or vehicle prop changes
  useEffect(() => {
    if (!isOpen) return;

    setError('');
    if (vehicle) {
      setFormData({
        name: vehicle.name || '',
        brand: vehicle.brand || '',
        model: vehicle.model || '',
        vehicleType: vehicle.vehicleType || 'car',
        category: vehicle.category || '',
        description: vehicle.description || '',
        images: vehicle.images && vehicle.images.length > 0 ? [...vehicle.images] : [''],
        pricePerDay: vehicle.pricePerDay !== undefined ? vehicle.pricePerDay.toString() : '',
        pricePerHour: vehicle.pricePerHour !== undefined ? vehicle.pricePerHour.toString() : '',
        securityDeposit: vehicle.securityDeposit !== undefined ? vehicle.securityDeposit.toString() : '5000',
        includedKilometers: vehicle.includedKilometers !== undefined ? vehicle.includedKilometers.toString() : '250',
        extraKilometerPrice: vehicle.extraKilometerPrice !== undefined ? vehicle.extraKilometerPrice.toString() : '15',
        fuelType: vehicle.fuelType || 'Petrol',
        transmission: vehicle.transmission || 'Automatic',
        seatingCapacity: vehicle.seatingCapacity !== undefined ? vehicle.seatingCapacity.toString() : '5',
        engineCapacity: vehicle.engineCapacity || '1998cc',
        mileage: vehicle.mileage || '16.5 km/l',
        registrationYear: vehicle.registrationYear !== undefined ? vehicle.registrationYear.toString() : new Date().getFullYear().toString(),
        ac: vehicle.ac !== undefined ? Boolean(vehicle.ac) : true,
        helmetAvailable: vehicle.helmetAvailable !== undefined ? Boolean(vehicle.helmetAvailable) : false,
        pickupLocation: Array.isArray(vehicle.pickupLocation)
          ? vehicle.pickupLocation.join(', ')
          : (vehicle.pickupLocation || 'Airport Terminal 1, City Center Hub, Downtown Hub'),
        status: vehicle.status || 'active',
      });
    } else {
      setFormData(getDefaultFormData());
    }
  }, [isOpen, vehicle]);

  // Lock body scroll and listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

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
      const cleanImages = formData.images
        .map((img) => img.trim())
        .filter((img) => img.length > 0);

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
        securityDeposit: Number(formData.securityDeposit) || 0,
        includedKilometers: Number(formData.includedKilometers) || 0,
        extraKilometerPrice: Number(formData.extraKilometerPrice) || 0,
        seatingCapacity: Number(formData.seatingCapacity) || 4,
        registrationYear: Number(formData.registrationYear) || new Date().getFullYear(),
      };

      let res;
      if (isEdit) {
        res = await api.put(`/admin/vehicles/${vehicle._id}`, payload);
      } else {
        res = await api.post('/admin/vehicles', payload);
      }

      if (res.success || res.vehicle) {
        onSuccess(isEdit ? 'Vehicle updated successfully!' : 'Vehicle created and published successfully!');
        onClose();
      } else {
        throw new Error(res.message || 'Operation failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 max-w-3xl w-full my-auto shadow-2xl relative space-y-5 max-h-[92vh] overflow-y-auto text-[#151515]">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-3.5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-bold shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#151515] tracking-tight">
                {isEdit ? 'Edit Vehicle Specifications' : 'Add New Fleet Vehicle'}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {isEdit
                  ? 'Update fleet specifications, rates, and media assets.'
                  : 'Configure vehicle specifications, pricing, features, and media.'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 hover:text-black transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Section 1: Overview */}
          <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              1. Vehicle Overview
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Vehicle Name <span className="text-brand-primary">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. BMW 3 Series Limousine"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Brand / Make <span className="text-brand-primary">*</span>
                </label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  placeholder="e.g. BMW"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Model Trim <span className="text-brand-primary">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. 330Li M Sport"
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Vehicle Type</label>
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
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary cursor-pointer shadow-xs"
                >
                  <option value="car">Car</option>
                  <option value="scooty">Scooty / Two-Wheeler</option>
                  <option value="bike">Motorbike</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Category <span className="text-brand-primary">*</span>
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder={formData.vehicleType === 'scooty' ? 'Electric Scooty, Standard' : 'Luxury, SUV, Sedan'}
                  required
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Registration Year</label>
                <input
                  type="number"
                  name="registrationYear"
                  value={formData.registrationYear}
                  onChange={handleChange}
                  min="2010"
                  max="2035"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1">
                Description <span className="text-brand-primary">*</span>
              </label>
              <textarea
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
                placeholder="Highlight vehicle performance, luxury interior, key inclusions..."
                required
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
              />
            </div>
          </div>

          {/* Section 2: Pricing & Mileage */}
          <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              2. Pricing & Distance Structure (INR ₹)
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Price / Day (₹) <span className="text-brand-primary">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleChange}
                  placeholder="4500"
                  required
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Price / Hour (₹)</label>
                <input
                  type="number"
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleChange}
                  placeholder="350"
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Security Deposit (₹)</label>
                <input
                  type="number"
                  name="securityDeposit"
                  value={formData.securityDeposit}
                  onChange={handleChange}
                  placeholder="5000"
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Free km / Day</label>
                <input
                  type="number"
                  name="includedKilometers"
                  value={formData.includedKilometers}
                  onChange={handleChange}
                  placeholder="250"
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="text-xs font-bold text-gray-700 block mb-1">Extra km Rate (₹)</label>
                <input
                  type="number"
                  name="extraKilometerPrice"
                  value={formData.extraKilometerPrice}
                  onChange={handleChange}
                  placeholder="15"
                  min="0"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Specs & Status */}
          <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
            <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
              3. Specifications & Operations
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Fuel / Power</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary cursor-pointer shadow-xs"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="CNG">CNG</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Transmission</label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary cursor-pointer shadow-xs"
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Seating Capacity</label>
                <input
                  type="number"
                  name="seatingCapacity"
                  value={formData.seatingCapacity}
                  onChange={handleChange}
                  min="1"
                  max="15"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Mileage / Range</label>
                <input
                  type="text"
                  name="mileage"
                  value={formData.mileage}
                  onChange={handleChange}
                  placeholder="e.g. 16.5 km/l"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Pickup Hub Locations</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  placeholder="Separate with commas: Aerocity Hub, City Center Hub"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary shadow-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-[#151515] focus:outline-none focus:border-brand-primary cursor-pointer shadow-xs"
                >
                  <option value="active">Active (Available for booking)</option>
                  <option value="inactive">Inactive (Hidden from customers)</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
                <input
                  type="checkbox"
                  name="ac"
                  checked={formData.ac}
                  onChange={handleChange}
                  className="accent-brand-primary w-4 h-4 cursor-pointer"
                />
                <span>Air Conditioned / Climate Control</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700 select-none">
                <input
                  type="checkbox"
                  name="helmetAvailable"
                  checked={formData.helmetAvailable}
                  onChange={handleChange}
                  className="accent-brand-primary w-4 h-4 cursor-pointer"
                />
                <span>Helmets Included (Scooties / Two-Wheelers)</span>
              </label>
            </div>
          </div>

          {/* Section 4: Media & Image URLs */}
          <div className="bg-gray-50/80 p-4 sm:p-5 rounded-2xl border border-gray-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                  4. Media & High-Resolution Image URLs
                </h3>
                <p className="text-[11px] text-gray-500">
                  Provide at least one direct photo URL (Unsplash, Cloudinary, AWS S3, etc.).
                </p>
              </div>
              <button
                type="button"
                onClick={addImageField}
                className="text-xs font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-primary/10 border border-brand-primary/20 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {formData.images.map((img, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <ImageIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="url"
                        value={img}
                        onChange={(e) => handleImageChange(idx, e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        required={idx === 0}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-xs text-[#151515] placeholder-gray-400 focus:outline-none focus:border-brand-primary transition-colors shadow-xs"
                      />
                    </div>
                    {formData.images.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeImageField(idx)}
                        className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors cursor-pointer"
                        title="Remove image URL"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  {img && img.startsWith('http') && (
                    <div className="pl-2 pt-1 flex items-center gap-2">
                      <img
                        src={img}
                        alt="Preview"
                        className="w-14 h-9 object-cover rounded-md border border-gray-200"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className="text-[10px] text-gray-500">Live preview thumbnail</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="orange-gradient-btn px-6 py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-primary-glow cursor-pointer transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <span>Saving Vehicle...</span>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEdit ? 'Update Vehicle' : 'Save & Publish Vehicle'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleModal;

