import express from 'express';
import {
  getVehicles,
  getVehicleById,
  checkAvailability,
  getFeaturedVehicles,
  getCategories,
} from '../controllers/vehicleController.js';

const router = express.Router();

router.get('/', getVehicles);
router.get('/featured', getFeaturedVehicles);
router.get('/categories', getCategories);
router.post('/availability', checkAvailability);
router.get('/:id', getVehicleById);

export default router;
