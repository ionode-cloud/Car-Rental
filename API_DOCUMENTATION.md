# RideVista — API Documentation

This document outlines the RESTful API endpoints for the RideVista Car & Scooty Rental Platform.

- **Base URL:** `http://localhost:5000/api`
- **Authentication:** HTTP-only cookies (`jwt`) or `Authorization: Bearer <token>`
- **Content-Type:** `application/json`

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Customer Account
- **Endpoint:** `POST /api/auth/register`
- **Access:** Public (Always assigns `customer` role)
- **Request Body:**
```json
{
  "name": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "+919876543210",
  "password": "Password@123"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "message": "Registration successful! Welcome to RideVista.",
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "6718...",
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "phone": "+919876543210",
    "role": "customer"
  }
}
```

### 1.2 Unified Login (Customer & Admin)
- **Endpoint:** `POST /api/auth/login`
- **Access:** Public (No public role dropdown; backend determines account role)
- **Request Body:**
```json
{
  "email": "admin@ridevista.com",
  "password": "Admin@12345"
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "message": "Welcome back, RideVista Administrator!",
  "token": "eyJhbGciOi...",
  "user": {
    "_id": "6718...",
    "name": "RideVista Concierge Admin",
    "email": "admin@ridevista.com",
    "phone": "+919876543210",
    "role": "admin"
  }
}
```

### 1.3 Get Current User Profile
- **Endpoint:** `GET /api/auth/me`
- **Access:** Private (Authenticated User)

### 1.4 Logout
- **Endpoint:** `POST /api/auth/logout`
- **Access:** Public (Clears HTTP-only cookie)

### 1.5 Forgot Password & Reset
- `POST /api/auth/forgot-password` (Body: `{ "email": "user@example.com" }`)
- `POST /api/auth/reset-password` (Body: `{ "token": "...", "newPassword": "..." }`)

---

## 2. Vehicle Endpoints (`/api/vehicles`)

### 2.1 Get Vehicles (Catalog with Filters & Pagination)
- **Endpoint:** `GET /api/vehicles`
- **Query Parameters:**
  - `vehicleType`: `car` | `scooty`
  - `category`: `Luxury`, `SUV`, `Sedan`, `Electric`, `Hatchback`, `Electric Scooty`, etc.
  - `fuelType`: `Petrol`, `Diesel`, `Electric`, `Hybrid`, `CNG`
  - `transmission`: `Automatic`, `Manual`
  - `seatingCapacity`: `2`, `4`, `5`, `7`
  - `search`: Keyword for name, brand, or model
  - `minPrice`, `maxPrice`: Numerical price filters
  - `pickupDate`, `returnDate`: Filters out vehicles with overlapping confirmed bookings
  - `sort`: `price_asc`, `price_desc`, `popular`, `newest`
  - `page`: default `1`
  - `limit`: default `9`

### 2.2 Get Featured Vehicles
- **Endpoint:** `GET /api/vehicles/featured`
- **Response:** Returns top-rated cars and scooties for the homepage.

### 2.3 Get Vehicle by ID
- **Endpoint:** `GET /api/vehicles/:id`
- **Response:** Vehicle specifications, pricing, media, and similar vehicles.

### 2.4 Check Vehicle Availability
- **Endpoint:** `POST /api/vehicles/availability`
- **Request Body:** `{ "vehicleId": "...", "pickupDate": "2026-10-25", "returnDate": "2026-10-28" }`

---

## 3. Booking Endpoints (`/api/bookings`)

### 3.1 Create Booking
- **Endpoint:** `POST /api/bookings`
- **Access:** Private (Customer)
- **Features:** Validates conflicting reservations, calculates final pricing with 18% GST and deposits on backend.
- **Request Body:**
```json
{
  "vehicleId": "6718...",
  "pickupLocation": "Airport Terminal 3",
  "returnLocation": "Aerocity Hub",
  "pickupDate": "2026-10-25",
  "pickupTime": "10:00 AM",
  "returnDate": "2026-10-28",
  "returnTime": "10:00 AM",
  "customerName": "Aarav Sharma",
  "email": "aarav@example.com",
  "phone": "+919876543210",
  "drivingLicenseNumber": "DL-0420210087654",
  "couponCode": "RIDEVISTA10",
  "paymentMethod": "Razorpay"
}
```

### 3.2 Get My Bookings
- **Endpoint:** `GET /api/bookings/my-bookings`
- **Access:** Private (Customer)

### 3.3 Cancel Booking
- **Endpoint:** `PATCH /api/bookings/:id/cancel`
- **Access:** Private (Owner or Admin)
- **Features:** Calculates refund percentage according to cancellation policy.

### 3.4 Download Tax Invoice PDF
- **Endpoint:** `GET /api/bookings/:id/invoice`
- **Access:** Private (Owner or Admin)
- **Response:** Formatted PDF document streamed inline.

---

## 4. Payment Endpoints (`/api/payments`)

### 4.1 Create Razorpay Order
- **Endpoint:** `POST /api/payments/create-order`
- **Request Body:** `{ "bookingId": "6718..." }`
- **Response:** Razorpay order ID or Development Simulator order token.

### 4.2 Verify Payment
- **Endpoint:** `POST /api/payments/verify`
- **Request Body:**
```json
{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "...",
  "bookingId": "6718..."
}
```

---

## 5. Admin Endpoints (`/api/admin`)
*All admin endpoints require `protect` and `adminOnly` middleware.*

### 5.1 Dashboard Statistics
- `GET /api/admin/dashboard/stats`: Returns fleet counts, bookings summary, verified revenue, Recharts series, and category breakdowns.

### 5.2 Fleet Management
- `GET /api/admin/vehicles`: List all vehicles with filters
- `POST /api/admin/vehicles`: Create new vehicle
- `PUT /api/admin/vehicles/:id`: Update vehicle specifications
- `DELETE /api/admin/vehicles/:id`: Delete vehicle (prevents deletion if active bookings exist)
- `PATCH /api/admin/vehicles/:id/status`: Toggle active / inactive status

### 5.3 Booking Operations
- `GET /api/admin/bookings`: Full reservation ledger
- `PATCH /api/admin/bookings/:id/status`: Transition status (`Confirmed`, `Active`, `Completed`, `Cancelled`, `Rejected`) and update payment status

### 5.4 Customer Directory
- `GET /api/admin/customers`: List customers with total trips count
- `PATCH /api/admin/customers/:id/status`: Activate or suspend customer account

### 5.5 Financial Ledger
- `GET /api/admin/payments`: Transaction history and refund status

### 5.6 Reports & Data Export
- `GET /api/admin/reports?type=revenue|bookings`: Summary analytics with client-side CSV download trigger.

### 5.7 Packages & Services
- `POST /api/admin/packages`, `PUT /api/admin/packages/:id`, `DELETE /api/admin/packages/:id`
- `POST /api/admin/services`, `PUT /api/admin/services/:id`, `DELETE /api/admin/services/:id`

### 5.8 Feedback & Inquiries
- `GET /api/admin/reviews`, `PATCH /api/admin/reviews/:id/status`, `DELETE /api/admin/reviews/:id`
- `GET /api/admin/contacts`, `PATCH /api/admin/contacts/:id/status`, `DELETE /api/admin/contacts/:id`
