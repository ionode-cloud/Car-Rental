import Vehicle from '../models/Vehicle.js';
import Booking from '../models/Booking.js';
import { escapeRegex } from '../utils/escapeRegex.js';

/**
 * @desc    Get all vehicles with comprehensive filtering, sorting & pagination
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getVehicles = async (req, res) => {
  try {
    const {
      vehicleType,
      category,
      fuelType,
      transmission,
      seatingCapacity,
      brand,
      minPrice,
      maxPrice,
      search,
      pickupDate,
      returnDate,
      sort,
      page = 1,
      limit = 9,
    } = req.query;

    const query = { status: 'active' };

    if (vehicleType && vehicleType !== 'all') {
      query.vehicleType = vehicleType;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (fuelType && fuelType !== 'all') {
      query.fuelType = fuelType;
    }

    if (transmission && transmission !== 'all') {
      query.transmission = transmission;
    }

    if (seatingCapacity && seatingCapacity !== 'all') {
      query.seatingCapacity = Number(seatingCapacity);
    }

    if (brand && brand !== 'all') {
      query.brand = new RegExp(escapeRegex(brand), 'i');
    }

    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = Number(minPrice);
      if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(escapeRegex(search.trim()), 'i');
      query.$or = [{ name: regex }, { brand: regex }, { model: regex }, { category: regex }];
    }

    // Availability filter across dates if provided
    if (pickupDate && returnDate) {
      const pDate = new Date(pickupDate);
      const rDate = new Date(returnDate);

      if (!isNaN(pDate.getTime()) && !isNaN(rDate.getTime())) {
        // Find bookings that overlap with requested period
        const overlappingBookings = await Booking.find({
          bookingStatus: { $in: ['Confirmed', 'Active', 'Pending'] },
          $or: [
            {
              pickupDate: { $lte: rDate },
              returnDate: { $gte: pDate },
            },
          ],
        }).select('vehicle');

        const bookedVehicleIds = overlappingBookings.map((b) => b.vehicle);
        if (bookedVehicleIds.length > 0) {
          query._id = { $nin: bookedVehicleIds };
        }
      }
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price_asc') sortOptions = { pricePerDay: 1 };
    if (sort === 'price_desc') sortOptions = { pricePerDay: -1 };
    if (sort === 'popular') sortOptions = { rating: -1, totalReviews: -1 };
    if (sort === 'newest') sortOptions = { createdAt: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Vehicle.countDocuments(query);
    const vehicles = await Vehicle.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: vehicles.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch vehicles',
    });
  }
};

/**
 * @desc    Get single vehicle by ID
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found',
      });
    }

    // Fetch similar vehicles
    const similarVehicles = await Vehicle.find({
      _id: { $ne: vehicle._id },
      vehicleType: vehicle.vehicleType,
      status: 'active',
    })
      .limit(3)
      .lean();

    res.json({
      success: true,
      vehicle,
      similarVehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Check availability for a vehicle on specific dates
 * @route   POST /api/vehicles/availability
 * @access  Public
 */
export const checkAvailability = async (req, res) => {
  try {
    const { vehicleId, pickupDate, returnDate } = req.body;

    if (!vehicleId || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: 'Vehicle ID, pickup date, and return date are required.',
      });
    }

    const pDate = new Date(pickupDate);
    const rDate = new Date(returnDate);

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle || vehicle.status !== 'active') {
      return res.json({
        success: true,
        available: false,
        message: 'Vehicle is currently inactive or under maintenance.',
      });
    }

    const conflict = await Booking.findOne({
      vehicle: vehicleId,
      bookingStatus: { $in: ['Confirmed', 'Active', 'Pending'] },
      $or: [
        {
          pickupDate: { $lte: rDate },
          returnDate: { $gte: pDate },
        },
      ],
    });

    if (conflict) {
      return res.json({
        success: true,
        available: false,
        message: 'Vehicle is already reserved for the selected dates.',
      });
    }

    return res.json({
      success: true,
      available: true,
      message: 'Vehicle is available for your journey!',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get featured vehicles for homepage
 * @route   GET /api/vehicles/featured
 * @access  Public
 */
export const getFeaturedVehicles = async (req, res) => {
  try {
    const cars = await Vehicle.find({ vehicleType: 'car', status: 'active' })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    const scooties = await Vehicle.find({ vehicleType: 'scooty', status: 'active' })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    res.json({
      success: true,
      cars,
      scooties,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * @desc    Get vehicle categories and stats
 * @route   GET /api/vehicles/categories
 * @access  Public
 */
export const getCategories = async (req, res) => {
  try {
    const carCategories = await Vehicle.distinct('category', { vehicleType: 'car' });
    const scootyCategories = await Vehicle.distinct('category', { vehicleType: 'scooty' });
    const brands = await Vehicle.distinct('brand', { status: 'active' });

    res.json({
      success: true,
      carCategories,
      scootyCategories,
      brands,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
