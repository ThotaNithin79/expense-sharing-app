import apiClient from './apiClient';

// Function to call the signup endpoint
export const signupUser = (userData) => {
  return apiClient.post('/auth/signup', userData);
};

// Function to call the verify OTP endpoint
export const verifyOtp = (verificationData) => {
  return apiClient.post('/auth/verify-otp', verificationData);
};

// Function to call the login endpoint
export const loginUser = (credentials) => {
  return apiClient.post('/auth/login', credentials);
};

export const forgotPassword = (email) => {
  // The backend expects an object with an 'email' key
  return apiClient.post('/auth/forgot-password', { email });
};

export const resetPassword = (resetData) => {
  // The backend expects an object with 'token' and 'newPassword' keys
  return apiClient.post('/auth/reset-password', resetData);
};