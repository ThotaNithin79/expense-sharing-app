import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import apiClient from '../api/apiClient';
import { getMyGroups } from '../api/groupApi'; // Import the function to fetch user's groups

// 1. Create the context
const AuthContext = createContext(null);

// 2. Create the AuthProvider component that will wrap our application
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  
  // --- NEW STATE: We will now store the user's active group and loading status globally ---
  const [activeGroup, setActiveGroup] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Manages the initial app-wide load

  // This function is now responsible for setting up the entire user session
  const initializeUserSession = useCallback(async (authToken) => {
    if (authToken) {
      // Set token for API calls and local storage
      localStorage.setItem('authToken', authToken);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // --- NEW LOGIC: After setting the token, fetch the user's groups ---
      try {
        const response = await getMyGroups();
        if (response.data && response.data.length > 0) {
          setActiveGroup(response.data[0]); // Set the first group as the active one
        } else {
          setActiveGroup(null); // The user is valid but has no groups
        }
      } catch (error) {
        console.error("Failed to fetch user groups, session might be invalid. Logging out.", error);
        // If we can't get crucial data, it might mean the token is stale. Log the user out.
        setToken(null);
      }
    } else {
      // If there's no token, clear everything
      localStorage.removeItem('authToken');
      delete apiClient.defaults.headers.common['Authorization'];
      setActiveGroup(null);
    }
    // We are done with the initial, app-wide loading process
    setIsLoading(false);
  }, []);

  // This effect runs only once when the app first loads
  useEffect(() => {
    initializeUserSession(token);
  }, [initializeUserSession]); // The dependency is the function itself

  // Login function now also triggers the session initialization
  const login = (newToken) => {
    setToken(newToken);
    initializeUserSession(newToken); // Immediately fetch user data after login
  };

  // Logout function now clears all state
  const logout = () => {
    setToken(null); // This will trigger the useEffect to clean up
  };

  // The value provided to all consuming components now includes the group and loading state
  const value = {
    token,
    isAuthenticated: !!token,
    activeGroup, // Expose the active group to the whole app
    isLoading,   // Expose the initial loading state
    login,

    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook for easy access to the context (no changes needed here)
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};