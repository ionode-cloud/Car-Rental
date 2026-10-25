import api from './api';

export const bookingService = {
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getMyBookings: () => api.get('/bookings/my-bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id, reason) => api.patch(`/bookings/${id}/cancel`, { reason }),
  getInvoiceUrl: (id) => `${import.meta.env.VITE_API_URL || '/api'}/bookings/${id}/invoice`,
  createPaymentOrder: (bookingId) => api.post('/payments/create-order', { bookingId }),
  verifyPayment: (paymentData) => api.post('/payments/verify', paymentData),
};
