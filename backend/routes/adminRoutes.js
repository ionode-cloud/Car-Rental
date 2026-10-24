import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';
import {
  getDashboardStats,
  getAdminVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  toggleVehicleStatus,
  getAdminBookings,
  updateBookingStatus,
  getAdminCustomers,
  toggleCustomerStatus,
  getAdminPayments,
  createPackage,
  updatePackage,
  deletePackage,
  createService,
  updateService,
  deleteService,
  getAdminReviews,
  updateReviewStatus,
  deleteReview,
  getAdminContacts,
  updateContactStatus,
  deleteContact,
  getReportSummary,
} from '../controllers/adminController.js';

const router = express.Router();

// Apply auth & admin verification to all admin routes
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

// Vehicles
router.get('/vehicles', getAdminVehicles);
router.post('/vehicles', createVehicle);
router.put('/vehicles/:id', updateVehicle);
router.delete('/vehicles/:id', deleteVehicle);
router.patch('/vehicles/:id/status', toggleVehicleStatus);

// Bookings
router.get('/bookings', getAdminBookings);
router.patch('/bookings/:id/status', updateBookingStatus);

// Customers
router.get('/customers', getAdminCustomers);
router.patch('/customers/:id/status', toggleCustomerStatus);

// Payments
router.get('/payments', getAdminPayments);

// Packages
router.post('/packages', createPackage);
router.put('/packages/:id', updatePackage);
router.delete('/packages/:id', deletePackage);

// Services
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Reviews
router.get('/reviews', getAdminReviews);
router.patch('/reviews/:id/status', updateReviewStatus);
router.delete('/reviews/:id', deleteReview);

// Contacts
router.get('/contacts', getAdminContacts);
router.patch('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

// Reports
router.get('/reports', getReportSummary);

export default router;
