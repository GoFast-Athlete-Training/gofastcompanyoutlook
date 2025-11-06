import axios from 'axios';
import { getAuth } from 'firebase/auth';

const gfcompanyapi = axios.create({
  baseURL: import.meta.env.PROD 
    ? 'https://gofastbackendv2-fall2025.onrender.com' 
    : 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json'
  }
  // No withCredentials - we use Bearer tokens, not cookies
});

// Request interceptor - AUTOMATICALLY adds Firebase token to all requests
gfcompanyapi.interceptors.request.use(
  async (config) => {
    // Get Firebase auth instance
    const firebaseAuth = getAuth();
    const user = firebaseAuth.currentUser;
    
    // If user is authenticated, add token to request
    if (user) {
      try {
        const token = await user.getIdToken(); // Firebase SDK gets fresh token
        config.headers.Authorization = `Bearer ${token}`; // Automatically added!
      } catch (error) {
        console.error('❌ GFCompany: Failed to get Firebase token:', error);
      }
    }
    
    // Log request
    console.log('🔥 GFCompany API Request:', config.method.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => {
    console.error('❌ GFCompany API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handles errors and logging
gfcompanyapi.interceptors.response.use(
  response => {
    console.log('✅ GFCompany API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('❌ GFCompany API Error:', error.response?.status, error.response?.data || error.message);
    
    // Handle 401 (Unauthorized) - token expired or invalid
    if (error.response?.status === 401) {
      console.error('🚫 GFCompany: Unauthorized - redirecting to signup');
      // Clear any stored auth data
      localStorage.clear();
      // Redirect to signup
      window.location.href = '/gfcompanysignup';
    }
    
    return Promise.reject(error);
  }
);

export default gfcompanyapi;

