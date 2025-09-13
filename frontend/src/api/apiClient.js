import axios from 'axios';

// Create a new Axios instance with a custom configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// ===== AXIOS INTERCEPTOR =====
// This function will run on every response that comes back from the API.
apiClient.interceptors.response.use(
  (response) => {
    // If the response is successful (2xx status code), just return it.
    return response;
  },
  (error) => {
    // If the response is an error
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Check if the error is 401 (Unauthorized) or 403 (Forbidden)
      console.log("Stale or invalid token detected. Logging out.");
      // Remove the invalid token from local storage
      localStorage.removeItem('authToken');
      // Redirect the user to the login page
      // We use window.location.href for a full page refresh to clear all state.
      window.location.href = '/login'; 
    }
    // For all other errors, just pass them along.
    return Promise.reject(error);
  }
);

export default apiClient;