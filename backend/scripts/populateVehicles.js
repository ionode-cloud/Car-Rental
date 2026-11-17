import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Vehicle from '../models/Vehicle.js';
import connectDB from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

export const NEW_FLEET_VEHICLES = [
  // 1. Toyota Fortuner
  {
    name: 'Toyota Fortuner Legender',
    brand: 'Toyota',
    model: 'Fortuner 4x4 Legender AT',
    vehicleType: 'car',
    category: 'SUV',
    description: 'The invincible benchmark of full-size 4x4 luxury SUVs. High-torque 500 Nm diesel engine, cat-eye LED headlights, JBL sound system, and commanding road presence.',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/commons/2/2c/Toyota_Fortuner_LTD_4x2_20221019.jpg',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 15,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 7,
    engineCapacity: '2755cc D-4D Turbo',
    mileage: '14.2 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Aerocity Hub', 'Railway Station Hub', 'Downtown Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.9,
    totalReviews: 54,
  },

  // 2. Hyundai Creta
  {
    name: 'Hyundai Creta SX (O) Turbo',
    brand: 'Hyundai',
    model: 'Creta 1.5 Turbo DCT',
    vehicleType: 'car',
    category: 'SUV',
    description: 'India’s most celebrated compact SUV with panoramic sunroof, ventilated front seats, Bose premium audio, ADAS Level 2 safety, and refined 7-speed dual-clutch transmission.',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/commons/4/41/2021_Hyundai_Creta_1.5_Executive_%28South_Africa%29_front_view.jpg',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 12,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    engineCapacity: '1482cc Turbo GDi',
    mileage: '18.4 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Aerocity Hub', 'Connaught Place Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.85,
    totalReviews: 42,
  },

  // 3. Mahindra Thar 4x4
  {
    name: 'Mahindra Thar 4x4 LX Hard Top',
    brand: 'Mahindra',
    model: 'Thar LX 4WD Diesel MT',
    vehicleType: 'car',
    category: 'SUV',
    description: 'The legendary off-roader with shift-on-the-fly 4x4, mechanical locking differential, waterproof dashboard, roll-cage, and unmatched terrain conquership.',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 14,
    fuelType: 'Diesel',
    transmission: 'Manual',
    seatingCapacity: 4,
    engineCapacity: '2184cc mHawk CRDe',
    mileage: '15.2 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Aerocity Hub', 'Railway Station Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.92,
    totalReviews: 68,
  },

  // 4. Tata Nexon EV Max
  {
    name: 'Tata Nexon EV Max Long Range',
    brand: 'Tata',
    model: 'Nexon EV Empowered Plus',
    vehicleType: 'car',
    category: 'Electric',
    description: 'Zero emissions with 453 km ARAI range on a single charge. Features 10.25-inch cinematic touchscreen, wireless Apple CarPlay, electronic parking brake, and lightning DC fast charging.',
    images: [
      'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=1200&auto=format&fit=crop',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 10,
    fuelType: 'Electric',
    transmission: 'Automatic',
    seatingCapacity: 5,
    engineCapacity: '40.5 kWh Permanent Magnet AC',
    mileage: '453 km/charge',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Cyber City Hub', 'Aerocity Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.88,
    totalReviews: 35,
  },

  // 5. Honda City ZX
  {
    name: 'Honda City ZX i-VTEC',
    brand: 'Honda',
    model: 'City 1.5 ZX CVT',
    vehicleType: 'car',
    category: 'Sedan',
    description: 'The executive sedan standard. Unrivalled rear legroom, silky smooth 1.5L i-VTEC motor with 7-step CVT paddle shifters, electric sunroof, and Honda LaneWatch camera.',
    images: [
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 12,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 5,
    engineCapacity: '1498cc i-VTEC DOHC',
    mileage: '18.4 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Connaught Place Hub', 'Aerocity Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.84,
    totalReviews: 29,
  },

  // 6. Maruti Suzuki Swift ZXi
  {
    name: 'Maruti Suzuki Swift ZXi Plus',
    brand: 'Maruti Suzuki',
    model: 'Swift ZXi Plus DualJet',
    vehicleType: 'car',
    category: 'Hatchback',
    description: 'India’s favourite zippy hatchback. 6 Airbags standard, 9-inch SmartPlay Pro+ touchscreen, cruise control, lightweight steering, and exceptional 24.8 km/l fuel economy.',
    images: [
      'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=1200&auto=format&fit=crop',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 10,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 5,
    engineCapacity: '1197cc DualJet VVT',
    mileage: '24.8 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Railway Station Hub', 'Aerocity Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.79,
    totalReviews: 44,
  },

  // 7. Ford Endeavour Titanium
  {
    name: 'Ford Endeavour Titanium 4x4',
    brand: 'Ford',
    model: 'Endeavour Titanium Plus 4x4',
    vehicleType: 'car',
    category: 'SUV',
    description: 'Commanding American SUV with 10-speed automatic gearbox, terrain management 4WD, panoramic glass roof, active noise cancellation, and semi-autonomous park assist.',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 300,
    extraKilometerPrice: 16,
    fuelType: 'Diesel',
    transmission: 'Automatic',
    seatingCapacity: 7,
    engineCapacity: '1996cc EcoBlue Bi-Turbo',
    mileage: '13.9 km/l',
    registrationYear: 2024,
    ac: true,
    helmetAvailable: false,
    pickupLocation: ['Airport Terminal 1 & 3', 'Aerocity Hub', 'Connaught Place Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.91,
    totalReviews: 38,
  },

  // 8. Royal Enfield Classic 350
  {
    name: 'Royal Enfield Classic 350 Dark',
    brand: 'Royal Enfield',
    model: 'Classic 350 Stealth Black',
    vehicleType: 'bike',
    category: 'Bikes',
    description: 'Timeless retro thumper featuring the smooth J-series 349cc air-oil cooled engine, teardrop fuel tank, dual-channel ABS, alloy wheels with tubeless tyres, and effortless cruising posture.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/2/2b/2022Classic350.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/7/73/Royal_Enfield_Classic_350.jpg',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 250,
    extraKilometerPrice: 8,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 2,
    engineCapacity: '349cc J-Series Single',
    mileage: '36.2 km/l',
    registrationYear: 2024,
    ac: false,
    helmetAvailable: true,
    pickupLocation: ['Airport Terminal 1 & 3', 'Aerocity Hub', 'Railway Station Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.94,
    totalReviews: 56,
  },

  // 9. Yamaha R15 V4
  {
    name: 'Yamaha YZF-R15 V4 Racing Blue',
    brand: 'Yamaha',
    model: 'YZF-R15 V4 Racing Blue',
    vehicleType: 'bike',
    category: 'Bikes',
    description: 'Supersport machine equipped with Variable Valve Actuation (VVA), Assist & Slipper clutch, upside-down golden forks, traction control system, and quick shifter.',
    images: [
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=1200&auto=format&fit=crop',
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Suzuki_Gixxer_155cc_DD_black.jpg',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 250,
    extraKilometerPrice: 8,
    fuelType: 'Petrol',
    transmission: 'Manual',
    seatingCapacity: 2,
    engineCapacity: '155cc Liquid-cooled SOHC 4V',
    mileage: '45.0 km/l',
    registrationYear: 2024,
    ac: false,
    helmetAvailable: true,
    pickupLocation: ['Airport Terminal 1 & 3', 'Cyber City Hub', 'Aerocity Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.88,
    totalReviews: 32,
  },

  // 10. Honda Activa 6G
  {
    name: 'Honda Activa 6G H-Smart',
    brand: 'Honda',
    model: 'Activa 6G H-Smart Deluxe',
    vehicleType: 'scooty',
    category: 'Scooties',
    description: 'India’s #1 household scooter equipped with smart keyless start, eSP engine technology, telescopic front suspension, Combi Brake System (CBS), and external fuel filling lid.',
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/0/06/Honda_Activa_red.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/e/ec/Gold_Metallic_Honda_Activa.jpg',
    ],
    pricePerDay: 1800,
    pricePerHour: 200,
    securityDeposit: 0,
    includedKilometers: 200,
    extraKilometerPrice: 6,
    fuelType: 'Petrol',
    transmission: 'Automatic',
    seatingCapacity: 2,
    engineCapacity: '109.5cc PGM-Fi HET',
    mileage: '50.0 km/l',
    registrationYear: 2024,
    ac: false,
    helmetAvailable: true,
    pickupLocation: ['Airport Terminal 1 & 3', 'Railway Station Hub', 'Aerocity Hub', 'Downtown Hub'],
    availability: true,
    status: 'active',
    featured: true,
    rating: 4.86,
    totalReviews: 49,
  },
];

export const ensureFullFleetInDatabase = async () => {
  try {
    const count = await Vehicle.countDocuments();
    if (count === 0) {
      await Vehicle.insertMany(NEW_FLEET_VEHICLES);
      console.log(`🚗 Seeded ${NEW_FLEET_VEHICLES.length} vehicles into empty database.`);
    } else {
      console.log(`🚗 Fleet verified: ${count} vehicles currently active.`);
    }
  } catch (err) {
    console.warn('⚠️ Fleet sync warning:', err.message);
  }
};

const populateVehicles = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await connectDB();

    console.log('🧹 Clearing all vehicles...');
    await Vehicle.deleteMany({});

    console.log(`🚀 Inserting exactly ${NEW_FLEET_VEHICLES.length} vehicles...`);
    const inserted = await Vehicle.insertMany(NEW_FLEET_VEHICLES);
    console.log(`✅ Successfully inserted ${inserted.length} vehicles into database.`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error populating vehicles:', error);
    process.exit(1);
  }
};

if (process.argv[1] && process.argv[1].endsWith('populateVehicles.js')) {
  populateVehicles();
}
