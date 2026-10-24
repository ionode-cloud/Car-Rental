export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const calculateDaysBetween = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 1;
  const p = new Date(pickupDate);
  const r = new Date(returnDate);
  const diffTime = r.getTime() - p.getTime();
  if (diffTime <= 0) return 1;
  return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
};
