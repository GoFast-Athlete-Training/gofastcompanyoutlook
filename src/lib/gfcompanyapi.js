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

// Request interceptor - Firebase automatically handles token refresh
gfcompanyapi.interceptors.request.use(
  async (config) => {
    // Get Firebase auth instance
    const firebaseAuth = getAuth();
    const user = firebaseAuth.currentUser;
    
    // If user is authenticated, Firebase automatically refreshes token if needed
    if (user) {
      try {
        // Firebase SDK automatically refreshes expired tokens
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
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
    // Following standard pattern: clear localStorage and redirect
    // Firebase auth persistence is handled by Firebase SDK internally (IndexedDB)
    if (error.response?.status === 401) {
      console.error('🚫 GFCompany: Unauthorized - redirecting to signin');
      // Clear localStorage (Firebase auth persists in IndexedDB automatically)
      localStorage.clear();
      // Redirect to signin
      window.location.href = '/gfcompanysignin';
    }
    
    return Promise.reject(error);
  }
);

export default gfcompanyapi;

