import axios from 'axios';

// Use environment variable if set, otherwise use relative URL (for Vercel proxy)
// In development, VITE_API_URL should be set to http://localhost:5000
// In production (Vercel), leave it unset to use the proxy in vercel.json
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Add timeout to prevent hanging requests
  timeout: 30000, // 30 seconds
});

// Add request interceptor for better error handling and debugging
api.interceptors.request.use(
  (config) => {
    // Log in development
    if (import.meta.env.DEV) {
      console.log('API Request:', config.method?.toUpperCase(), config.url);
      console.log('API Base URL:', API_BASE_URL || 'relative (using proxy)');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // Server responded with error status
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config?.url,
      });
    } else if (error.request) {
      // Request made but no response received
      console.error('API Network Error:', {
        message: error.message,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
      });
    } else {
      // Something else happened
      console.error('API Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;

