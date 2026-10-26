import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import vehicleRoutes from './routes/vehicleRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import packageRoutes from './routes/packageRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { autoSeedIfEmpty } from './scripts/seedData.js';
import { ensureFullFleetInDatabase } from './scripts/populateVehicles.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB and ensure data is primed
connectDB().then(async () => {
  await autoSeedIfEmpty();
  await ensureFullFleetInDatabase();
});

// Security and utility middleware
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Dynamic allowed origins parser: supports comma-separated CLIENT_URL, wildcard, and vercel.app domains
const getAllowedOrigins = () => {
  const envUrls = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((u) => u.trim().replace(/\/$/, ''))
    : [];

  return [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://localhost:4173',
    'https://car-rental-brown-alpha.vercel.app',
    ...envUrls,
  ].filter(Boolean);
};

const isOriginAllowed = (origin) => {
  if (!origin) return true;

  const allowed = getAllowedOrigins();

  // If wildcard '*' was configured in CLIENT_URL, reflect origin directly
  // (CORS specification requires explicit origin, never '*', when credentials: true)
  if (allowed.includes('*') || process.env.CLIENT_URL === '*') {
    return true;
  }

  // Exact match against allowed list
  if (allowed.includes(origin)) {
    return true;
  }

  // Allow any Vercel domain (production or preview deployments)
  try {
    const parsed = new URL(origin);
    if (parsed.hostname.endsWith('.vercel.app') || parsed.hostname === 'vercel.app') {
      return true;
    }
  } catch (e) {
    // Ignore invalid origin strings
  }

  // Allow localhost on any port
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
    return true;
  }

  return false;
};

const corsOptions = {
  origin: (origin, callback) => {
    if (isOriginAllowed(origin)) {
      // Returning true reflects the caller's origin header, ensuring withCredentials: true works cleanly
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked for origin: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Static folder for file uploads
app.use('/public', express.static(path.join(__dirname, 'public')));

// Root Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    appName: 'RideVista Mobility API',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Error Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚗 RideVista Backend Server running on port ${PORT} [Mode: ${process.env.NODE_ENV || 'development'}]`);
});

export default app;
