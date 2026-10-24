# 🚗 RideVista — Premium Car & Scooty Rental Management System

RideVista is a full-stack MERN (MongoDB, Express.js, React.js, Node.js) web application engineered for self-drive car and scooty rentals. Inspired by modern luxury automotive platforms, it combines a cinematic customer booking experience with an operations and analytics dashboard for fleet administrators.

---

## 🌟 Highlights & Key Features

- **Cinematic Customer Experience:**
  - Responsive dark-mode aesthetics with glowing orange accents (`#FF6B00`) and glassmorphism.
  - Interactive multi-hub search panel (Pickup Location, Dates, Times, Vehicle Type).
  - Dedicated **Car Rental** and **Scooty Rental** showcases with multi-attribute filtering (brand, category, fuel, transmission, seating, price slider) and pagination.
  - Vehicle details view with multi-image gallery, technical specifications, and **Live Estimated Price Calculator**.
  - Flexible **Rental Packages** (Daily, Weekend, Weekly, Monthly) and **Services** catalog.

- **Unified Authentication & Security:**
  - Single common `/login` page for both Customers and Administrators (no public role selector).
  - Backend role-based authorization stored in MongoDB (`customer` vs `admin`).
  - HTTP-only secure cookie JWT authentication with bcrypt password hashing.
  - Public registration strictly enforces the `customer` role.
  - Dedicated CLI script for seeding and confirming administrator accounts.

- **Booking & Rental Pricing Engine:**
  - Automated vehicle availability verification preventing double/overlapping bookings.
  - Server-calculated pricing including daily rental fare, statutory GST (18%), refundable security deposits, and promotional coupons (`RIDEVISTA10`, `FIRSTTRIP`).
  - **Razorpay Online Payment Integration** with an automatic development simulator fallback.
  - Downloadable **Tax Invoice PDF** with itemized breakdowns.
  - Customer self-service cancellation with automated refund calculation.

- **Executive Admin Console (`/admin/dashboard`):**
  - Real-time KPI summaries: Total Vehicles, Active Bookings, Total Customers, Verified Revenue, Pending Payments.
  - Interactive **Recharts** visualizations: Monthly Revenue Area Chart and Vehicle Category Distribution Pie Chart.
  - Complete **Fleet Management**: Add, edit, delete, and toggle status (Active/Inactive) of vehicles.
  - **Booking Operations**: Status lifecycle management (`Pending` → `Confirmed` → `Active` → `Completed` → `Cancelled`), and payment status tracking.
  - Customer directory with trip statistics and account suspension controls.
  - Real-time financial transaction ledger.
  - Rental packages & services management.
  - Review moderation and contact inquiry inbox.
  - **Audit Reports & CSV Data Export**.
  - Platform and company settings configuration.

---

## 🏗️ Project Architecture

```
EV-Rental/
├── backend/
│   ├── config/
│   │   ├── db.js                 # Database connection with MongoMemoryServer dev fallback
│   │   └── razorpay.js           # Razorpay SDK configuration
│   ├── controllers/
│   │   ├── authController.js     # Unified login, register, me, forgot/reset password
│   │   ├── vehicleController.js  # Catalog filtering, availability, featured fleet
│   │   ├── bookingController.js  # Order placement, price calculator, cancellation, PDF invoices
│   │   ├── paymentController.js  # Razorpay order generation & signature verification
│   │   ├── adminController.js    # Fleet CRUD, dashboard statistics, reports, settings
│   │   ├── packageController.js  # Public packages
│   │   ├── serviceController.js  # Public services
│   │   ├── reviewController.js   # Customer testimonials
│   │   ├── contactController.js  # Inquiry messages
│   │   └── userController.js     # Profile and password updates
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification from cookie or Bearer header
│   │   ├── adminMiddleware.js    # Admin role verification
│   │   ├── errorMiddleware.js    # 404 & centralized error formatting
│   │   └── uploadMiddleware.js   # Multer file upload handling
│   ├── models/
│   │   ├── User.js               # Customer & Admin schemas
│   │   ├── Vehicle.js            # Fleet specifications, categories, rates, images
│   │   ├── Booking.js            # Reservation details, price breakdown, status history
│   │   ├── Package.js            # Rental duration packages
│   │   ├── Service.js            # Rental offerings
│   │   ├── Payment.js            # Transaction logs
│   │   ├── Review.js             # Customer reviews
│   │   ├── Contact.js            # Inquiries
│   │   └── Coupon.js             # Discount codes
│   ├── utils/
│   │   ├── calculateBookingPrice.js # Deterministic server-side pricing engine
│   │   ├── generateToken.js      # JWT cookie generator
│   │   ├── emailService.js       # Transactional notifications with dev fallback
│   │   └── invoiceGenerator.js   # PDFKit invoice generator
│   ├── scripts/
│   │   ├── createAdmin.js        # Standalone administrator account creator
│   │   └── seedData.js           # Database seeder (fleet, packages, services, reviews)
│   ├── server.js                 # Express server entry point
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, VehicleCard, SearchBar, ProtectedRoute, etc.
│   │   ├── context/              # AuthContext, BookingContext
│   │   ├── pages/                # Home, AboutUs, Packages, Services, CarRental, ScootyRental,
│   │   │                         # VehicleDetails, ContactUs, Login, Register, Checkout, Success, Dashboard
│   │   ├── admin/                # AdminLayout, AdminDashboard, AdminVehicles, AdminBookings, Reports, etc.
│   │   ├── services/             # Axios API client (api, authService, vehicleService, bookingService)
│   │   ├── utils/                # Currency, date, and duration formatters
│   │   ├── App.jsx               # Client-side router configuration
│   │   ├── main.jsx              # React DOM mounting
│   │   └── index.css             # Tailwind CSS & custom luxury styling
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── API_DOCUMENTATION.md          # REST API specifications
└── README.md
```

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- Optional: Local MongoDB or MongoDB Atlas URI (If unavailable, the backend automatically uses an In-Memory MongoDB instance for development testing)

---

### 1. Backend Setup

```bash
cd backend
npm install
```

Configure `backend/.env` (pre-configured with development defaults):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/ridevista
JWT_SECRET=ridevista_super_secure_jwt_secret_key_2026_automobile
JWT_EXPIRES_IN=7d

ADMIN_NAME=RideVista Administrator
ADMIN_EMAIL=admin@ridevista.com
ADMIN_PASSWORD=Admin@12345
ADMIN_PHONE=+919876543210
```

Seed initial fleet, packages, services, and accounts:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
The backend will be running at `http://localhost:5000`.

---

### 2. Frontend Setup

In a separate terminal window:
```bash
cd frontend
npm install
npm run dev
```
The frontend application will be running at `http://localhost:5173`.

---

## 🔑 Demo Login Credentials

For quick evaluation, one-click demo credentials are built into the `/login` page:

| Role | Email | Password | Landing Page After Login |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@ridevista.com` | `Admin@12345` | `/admin/dashboard` |
| **Customer** | `customer@ridevista.com` | `Customer@12345` | `/my-account` or Checkout |

---

## 💳 Payment Simulation (Razorpay)

- In development mode without live Razorpay API keys, the application automatically uses a development payment simulator that mimics Razorpay checkout and triggers signature verification.
- To use live Razorpay test keys, provide:
  - `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `backend/.env`
  - `VITE_RAZORPAY_KEY_ID` in `frontend/.env`

---

## 📄 Booking Invoices

Downloadable PDF tax invoices are generated dynamically using `PDFKit`:
- Access URL: `http://localhost:5000/api/bookings/:id/invoice`
- Accessible by the reservation owner and administrators.
- Itemizes daily base rental, duration, 18% GST, refundable security deposits, and coupon discounts.

---

## 🛡️ License
Proprietary mobility software built for RideVista Mobility Technologies. All rights reserved.
#   C a r - R e n t a l  
 