/**
 * Reusable Price Calculation Utility
 * @param {Object} params
 * @param {Object} params.vehicle - Mongoose vehicle document
 * @param {Date|string} params.pickupDate
 * @param {Date|string} params.returnDate
 * @param {Object} [params.coupon] - Optional validated coupon object
 * @param {number} [params.deliveryFee=0]
 * @returns {Object} detailed price breakdown
 */
export const calculateBookingPrice = ({
  vehicle,
  pickupDate,
  returnDate,
  coupon = null,
  deliveryFee = 0,
}) => {
  const pDate = new Date(pickupDate);
  const rDate = new Date(returnDate);

  if (isNaN(pDate.getTime()) || isNaN(rDate.getTime())) {
    throw new Error('Invalid pickup or return date provided');
  }

  // Calculate duration in days (minimum 1 day)
  const diffTime = rDate.getTime() - pDate.getTime();
  if (diffTime <= 0) {
    throw new Error('Return date must be after pickup date');
  }

  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const rentalDays = Math.max(1, diffDays);

  const dailyRate = vehicle.pricePerDay;
  const baseRental = dailyRate * rentalDays;
  const securityDeposit = vehicle.securityDeposit || 0;

  // 18% GST on rental amount
  const taxRate = 0.18;
  const taxAmount = Math.round(baseRental * taxRate);

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
    baseRental,
    securityDeposit,
    deliveryFee: Number(deliveryFee),
    taxRatePercentage: 18,
    taxAmount,
    discountAmount,
    couponCode,
    subtotal,
    finalAmount,
  };
};

export default calculateBookingPrice;
