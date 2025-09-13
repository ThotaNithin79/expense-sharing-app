import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '~/components/ui/sonner';

// Layout and Route Components
import MainLayout from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Page Components
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import GroupManagementPage from './pages/GroupManagementPage';
import CreateGroupPage from './pages/CreateGroupPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-950 text-white">
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          {/* Routes accessible only to logged-out users */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
          <Route path="/verify-otp" element={<PublicRoute><VerifyOtpPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />
          
          {/* --- PROTECTED ROUTES --- */}
          {/* All authenticated routes are now children of a single protected path */}
          <Route 
            path="/*" // Match all other paths (e.g., /, /group, /create-group)
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* The MainLayout's <Outlet> will render these nested routes */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="group" element={<GroupManagementPage />} />
            <Route path="create-group" element={<CreateGroupPage />} />
            
            {/* The default route for a logged-in user */}
            <Route index element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
        <Toaster richColors />
      </div>
    </Router>
  );
}

export default App;