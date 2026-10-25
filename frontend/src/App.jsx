import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Common Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ScrollToTop from './components/ScrollToTop';

// Customer Pages
import Home from './pages/Home';
import AboutUs from './pages/AboutUs';
import Packages from './pages/Packages';
import Services from './pages/Services';
import Vehicles from './pages/Vehicles';
import CarRental from './pages/CarRental';
import ScootyRental from './pages/ScootyRental';
import VehicleDetails from './pages/VehicleDetails';
import ContactUs from './pages/ContactUs';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import BookingCheckout from './pages/BookingCheckout';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/AdminDashboard';
import AdminVehicles from './admin/AdminVehicles';
import AddVehicle from './admin/AddVehicle';
import EditVehicle from './admin/EditVehicle';
import AdminBookings from './admin/AdminBookings';
import AdminCustomers from './admin/AdminCustomers';
import AdminPayments from './admin/AdminPayments';
import AdminPackages from './admin/AdminPackages';
import AdminServices from './admin/AdminServices';
import AdminReviews from './admin/AdminReviews';
import AdminContacts from './admin/AdminContacts';
import AdminReports from './admin/AdminReports';
import AdminSettings from './admin/AdminSettings';
import AdminProfile from './admin/AdminProfile';
import AnimatedPage from './components/AnimatedPage';

// Layout wrapper for customer-facing pages
const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow overflow-x-hidden">
        <AnimatedPage>{children}</AnimatedPage>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BookingProvider>
          <ScrollToTop />
          <Routes>
          {/* Customer & Public Routes */}
          <Route
            path="/"
            element={
              <CustomerLayout>
                <Home />
              </CustomerLayout>
            }
          />
          <Route
            path="/about-us"
            element={
              <CustomerLayout>
                <AboutUs />
              </CustomerLayout>
            }
          />
          <Route
            path="/packages"
            element={
              <CustomerLayout>
                <Packages />
              </CustomerLayout>
            }
          />
          <Route
            path="/services"
            element={
              <CustomerLayout>
                <Services />
              </CustomerLayout>
            }
          />
          <Route
            path="/vehicles"
            element={
              <CustomerLayout>
                <Vehicles />
              </CustomerLayout>
            }
          />
          <Route
            path="/car-rental"
            element={
              <CustomerLayout>
                <Vehicles />
              </CustomerLayout>
            }
          />
          <Route
            path="/scooty-rental"
            element={
              <CustomerLayout>
                <Vehicles />
              </CustomerLayout>
            }
          />
          <Route
            path="/vehicles/:id"
            element={
              <CustomerLayout>
                <VehicleDetails />
              </CustomerLayout>
            }
          />
          <Route
            path="/contact-us"
            element={
              <CustomerLayout>
                <ContactUs />
              </CustomerLayout>
            }
          />
          <Route
            path="/login"
            element={
              <CustomerLayout>
                <Login />
              </CustomerLayout>
            }
          />
          <Route
            path="/register"
            element={
              <CustomerLayout>
                <Register />
              </CustomerLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <CustomerLayout>
                <ForgotPassword />
              </CustomerLayout>
            }
          />
          <Route
            path="/reset-password/:token"
            element={
              <CustomerLayout>
                <ResetPassword />
              </CustomerLayout>
            }
          />

          {/* Protected Customer Routes */}
          <Route
            path="/booking/checkout"
            element={
              <ProtectedRoute>
                <CustomerLayout>
                  <BookingCheckout />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/success/:id"
            element={
              <ProtectedRoute>
                <CustomerLayout>
                  <BookingSuccess />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <CustomerLayout>
                  <MyBookings />
                </CustomerLayout>
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="vehicles" element={<AdminVehicles />} />
            <Route path="vehicles/add" element={<AddVehicle />} />
            <Route path="vehicles/edit/:id" element={<EditVehicle />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="packages" element={<AdminPackages />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="contacts" element={<AdminContacts />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
          </Route>

          {/* 404 Catch-All */}
          <Route
            path="*"
            element={
              <CustomerLayout>
                <NotFound />
              </CustomerLayout>
            }
          />
        </Routes>
      </BookingProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
