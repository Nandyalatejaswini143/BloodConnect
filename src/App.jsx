
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import EmergencyBanner from './components/layout/EmergencyBanner';
import ScrollToTop from './components/common/ScrollToTop';

import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Pages
import HomePage from './pages/HomePage';
import FindDonorsPage from './pages/FindDonorsPage';
import RegisterDonorPage from './pages/RegisterDonorPage';
import PatientRegisterPage from './pages/PatientRegisterPage';
import LoginPage from './pages/LoginPage';
import DonorDashboardPage from './pages/DonorDashboardPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import EmergencyRequestsPage from './pages/EmergencyRequestsPage';
import CompatibilityPage from './pages/CompatibilityPage';
import HowItWorksPage from './pages/HowItWorksPage';
import CreateBloodRequestPage from './pages/CreateBloodRequestPage';
import DonorRequestsPage from './pages/DonorRequestsPage.jsx';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] selection:bg-[#DC2626] selection:text-white font-sans">

          <EmergencyBanner />

          <Navbar />

          <main className="flex-grow">
            <Routes>

              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />

              <Route
                path="/find-donors"
                element={<FindDonorsPage />}
              />

              {/* Registration */}
              <Route
                path="/register"
                element={<RegisterDonorPage />}
              />

              <Route
                path="/patient-register"
                element={<PatientRegisterPage />}
              />

              {/* Authentication */}
              <Route
                path="/login"
                element={<LoginPage />}
              />

              {/* Donor Emergency Requests */}
              <Route
                path="/emergency"
                element={<EmergencyRequestsPage />}
              />

              {/* Patient Emergency Section */}
              <Route
                path="/patient-emergency"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Other Public Pages */}
              <Route
                path="/compatibility"
                element={<CompatibilityPage />}
              />

              <Route
                path="/how-it-works"
                element={<HowItWorksPage />}
              />

              {/* Donor Dashboard */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRole="donor">
                    <DonorDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Donor Requests */}
              <Route
                path="/donor-requests"
                element={
                  <ProtectedRoute allowedRole="donor">
                    <DonorRequestsPage />
                  </ProtectedRoute>
                }
              />

              {/* Patient Dashboard */}
              <Route
                path="/patient-dashboard"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <PatientDashboardPage />
                  </ProtectedRoute>
                }
              />

              {/* Create Blood Request */}
              <Route
                path="/create-blood-request"
                element={
                  <ProtectedRoute allowedRole="patient">
                    <CreateBloodRequestPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route
                path="*"
                element={<HomePage />}
              />

            </Routes>
          </main>

          <Footer />

        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
