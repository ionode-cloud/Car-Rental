import React, { createContext, useContext, useState } from 'react';

const BookingContext = createContext();

const defaultToday = new Date().toISOString().split('T')[0];
const defaultTomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
  .toISOString()
  .split('T')[0];

export const BookingProvider = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState({
    pickupLocation: 'Aerocity Hub',
    returnLocation: 'Aerocity Hub',
    pickupDate: defaultToday,
    pickupTime: '10:00 AM',
    returnDate: defaultTomorrow,
    returnTime: '10:00 AM',
    vehicleType: 'all',
  });

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const updateSearchFilters = (newFilters) => {
    setSearchFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const calculateEstimate = (vehicle, days = 1) => {
    if (!vehicle) return { baseRental: 0, taxAmount: 0, total: 0 };
    const baseRental = (vehicle.pricePerDay || 0) * days;
    const taxAmount = Math.round(baseRental * 0.18);
    const securityDeposit = vehicle.securityDeposit || 0;
    const total = baseRental + taxAmount + securityDeposit;
    return {
      dailyRate: vehicle.pricePerDay,
      days,
      baseRental,
      taxAmount,
      securityDeposit,
      total,
    };
  };

  const clearBookingDraft = () => {
    setSelectedVehicle(null);
    setSelectedPackage(null);
  };

  const value = {
    searchFilters,
    updateSearchFilters,
    selectedVehicle,
    setSelectedVehicle,
    selectedPackage,
    setSelectedPackage,
    calculateEstimate,
    clearBookingDraft,
  };

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
