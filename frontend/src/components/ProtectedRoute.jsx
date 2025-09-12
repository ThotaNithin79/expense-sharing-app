import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get the authentication status from our context
  const location = useLocation(); // Get the current location to redirect back after login

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    // We pass the original location in the state. This allows us to redirect the user
    // back to the page they were trying to access after they successfully log in.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If the user is authenticated, render the child components (e.g., the Dashboard)
  return children;
};

export default ProtectedRoute;