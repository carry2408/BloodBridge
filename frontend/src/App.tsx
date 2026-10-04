import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import { PublicHomePage } from './pages/PublicHomePage';
import { DonorRegistrationPage } from './pages/DonorRegistrationPage';
import { DonorStatusCheckPage } from './pages/DonorStatusCheckPage';
import { LoginPage } from './pages/LoginPage';
import { VolunteerDashboardPage } from './pages/VolunteerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-[#C8372D] selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicHomePage />} />
              <Route path="/register-donor" element={<DonorRegistrationPage />} />
              <Route path="/check-status" element={<DonorStatusCheckPage />} />
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Volunteer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['VOLUNTEER', 'ADMIN']} />}>
                <Route path="/volunteer" element={<VolunteerDashboardPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                <Route path="/admin" element={<AdminDashboardPage />} />
              </Route>

              {/* Fallback Catch-all Route */}
              <Route path="*" element={<PublicHomePage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
