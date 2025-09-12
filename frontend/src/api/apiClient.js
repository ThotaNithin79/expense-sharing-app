import axios from 'axios';

// Create a new Axios instance with a custom configuration
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api', // Your backend's base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;