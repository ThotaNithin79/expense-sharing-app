import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import VerifyOtpPage from './pages/VerifyOtpPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute'; // <<< --- IMPORT THE PUBLIC ROUTE
import { Toaster } from '~/components/ui/sonner'; // <<< --- IMPORT THE TOASTER
import WelcomePage from './pages/WelcomePage'; // <<< --- IMPORT
import CreateGroupPage from './pages/CreateGroupPage'; // <<< --- IMPORT

import MainLayout from './components/MainLayout'; // <<< --- IMPORT THE LAYOUT
import GroupManagementPage from './pages/GroupManagementPage'; // <<< --- IMPORT THE PAGE
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // <<< --- IMPORT THE PAGE
import ResetPasswordPage from './pages/ResetPasswordPage'; // <<< --- IMPORT THE PAGE

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 text-white">
        <Routes>
          {/* == PROTECTED ROUTES == */}
          {/* These routes are only accessible to logged-in users */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            } 
          >
          {/* These are the child routes that will be rendered in the Outlet */}
            <Route index element={<DashboardPage />} />
            <Route path="group" element={<GroupManagementPage />} />
          </Route>
          {/* You can add more protected routes here later, e.g., /profile, /settings */}

          <Route 
            path="/welcome" 
            element={<ProtectedRoute><WelcomePage /></ProtectedRoute>} 
          />
          <Route path="/create-group" element={<ProtectedRoute><CreateGroupPage /></ProtectedRoute>} />

          {/* == PUBLIC ROUTES == */}
          {/* These routes are only accessible to logged-out users */}

          <Route 
            path="/reset-password" // <<< --- ADD THE NEW PUBLIC ROUTE
            element={<PublicRoute><ResetPasswordPage /></PublicRoute>} 
          />
           <Route 
            path="/forgot-password" // <<< --- ADD THE NEW PUBLIC ROUTE
            element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} 
          />
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <PublicRoute>
                <SignupPage />
              </PublicRoute>
            } 
          />
          <Route 
            path="/verify-otp" 
            element={
              <PublicRoute>
                <VerifyOtpPage />
              </PublicRoute>
            } 
          />

          {/* A catch-all route to handle unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* ADD THE TOASTER COMPONENT HERE, AT THE END */}
        <Toaster richColors />
      </div>
    </Router>
  );
}

export default App;