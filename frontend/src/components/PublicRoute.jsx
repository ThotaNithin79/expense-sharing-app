import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  // If the user IS authenticated, redirect them away from public pages (like login)
  // to the main dashboard.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If the user is NOT authenticated, render the child component (e.g., the LoginPage)
  return children;
};

export default PublicRoute;