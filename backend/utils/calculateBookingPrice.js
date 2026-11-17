/**
 * Reusable Price Calculation Utility
 * @param {Object} params
 * @param {Object} params.vehicle - Mongoose vehicle document
 * @param {string} [params.rentalCategory='self_drive'] - 'self_drive' | 'with_driver'
 * @param {string} [params.durationTier='24 Hours'] - '4 Hours' | '8 Hours' | '1 Day' | '2 Days' | '5 Days' | custom
 * @param {number} [params.estimatedHours=0]
 * @param {number} [params.customDays=0]
 * @param {Date|string} [params.pickupDate]
 * @param {Date|string} [params.returnDate]
 * @param {Object} [params.coupon] - Optional validated coupon object
 * @param {number} [params.deliveryFee=0]
 * @returns {Object} detailed price breakdown
 */
export const calculateBookingPrice = ({
  vehicle,
  rentalCategory = 'self_drive',
  durationTier = '24 Hours',
  estimatedHours = 0,
  customDays = 0,
  pickupDate,
  returnDate,
  coupon = null,
  deliveryFee = 0,
}) => {
  let baseRental = 0;
  let rentalDays = 1;
  let hours = 0;

  // Standard Rental Pricing provided by customer:
  // 4 Hours: ₹800
  // 8 Hours: ₹1,200
  // 24 Hours (1 Day): ₹1,800
  const dailyRate = 1800;

  // Check if dates are given and compute difference in hours
  let computedHoursFromDates = 0;
  if (pickupDate && returnDate) {
    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);
    const diffMs = rDate.getTime() - pDate.getTime();
    if (diffMs > 0) {
      computedHoursFromDates = diffMs / (1000 * 60 * 60);
    }
  }

  // Parse days from durationTier if it matches "X Day" or "X Days"
  const daysMatch = String(durationTier).match(/^(\d+)\s*Days?$/i);
  const hoursMatch = String(durationTier).match(/^(\d+)\s*Hours?$/i);

  if (customDays && Number(customDays) > 0) {
    rentalDays = Number(customDays);
    hours = rentalDays * 24;
    baseRental = rentalDays * dailyRate;
  } else if (daysMatch) {
    rentalDays = Number(daysMatch[1]);
    hours = rentalDays * 24;
    baseRental = rentalDays * dailyRate;
  } else if (durationTier === '24 Hours' || durationTier === '1 Day') {
    rentalDays = 1;
    hours = 24;
    baseRental = dailyRate;
  } else if (durationTier === '4 Hours') {
    hours = 4;
    rentalDays = 1;
    baseRental = 800;
  } else if (durationTier === '8 Hours') {
    hours = 8;
    rentalDays = 1;
    baseRental = 1200;
  } else if (durationTier === '12 Hours') {
    hours = 12;
    rentalDays = 1;
    baseRental = 1500;
  } else if (estimatedHours && Number(estimatedHours) > 0) {
    hours = Math.max(4, Number(estimatedHours)); // Enforce minimum 4 hours
    if (hours <= 4) {
      baseRental = 800;
      rentalDays = 1;
    } else if (hours <= 8) {
      baseRental = 1200;
      rentalDays = 1;
    } else if (hours <= 24) {
      baseRental = dailyRate;
      rentalDays = 1;
    } else {
      rentalDays = Math.ceil(hours / 24);
      baseRental = rentalDays * dailyRate;
    }
  } else if (computedHoursFromDates > 0) {
    hours = Math.max(4, computedHoursFromDates); // Enforce minimum 4 hours
    if (hours <= 4) {
      baseRental = 800;
      rentalDays = 1;
    } else if (hours <= 8) {
      baseRental = 1200;
      rentalDays = 1;
    } else {
      rentalDays = Math.max(1, Math.ceil(hours / 24));
      baseRental = rentalDays * dailyRate;
    }
  } else {
    // Default 1 Day
    rentalDays = 1;
    hours = 24;
    baseRental = dailyRate;
  }

  // 100% No Security Deposit Required
  const securityDeposit = 0;

  // Transparent pricing: All taxes included
  const taxAmount = 0;

  // Discount calculation
  let discountAmount = 0;
  let couponCode = '';

  if (coupon) {
    couponCode = coupon.code;
    if (coupon.discountType === 'percentage') {
      discountAmount = Math.round((baseRental * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discountAmount > coupon.maximumDiscount) {
        discountAmount = coupon.maximumDiscount;
      }
    } else if (coupon.discountType === 'fixed') {
      discountAmount = Math.min(coupon.discountValue, baseRental);
    }
  }

  const subtotal = baseRental + taxAmount + securityDeposit + Number(deliveryFee);
  const finalAmount = Math.max(0, subtotal - discountAmount);

  return {
    dailyRate,
    rentalDays,
    hours,
    durationTier,
    baseRental,
    securityDeposit: 0, // Strictly ₹0
    deliveryFee: Number(deliveryFee),
    taxRatePercentage: 0,
    taxAmount: 0,
    discountAmount,
    couponCode,
    subtotal,
    finalAmount,
  };
};

export default calculateBookingPrice;
