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
      console.error('🚫 GFCompany: Unauthorized - token expired or invalid');
      
      // Try to refresh token first
      const firebaseAuth = getAuth();
      const user = firebaseAuth.currentUser;
      
      if (user) {
        try {
          // Force token refresh
          const newToken = await user.getIdToken(true);
          console.log('✅ GFCompany: Token refreshed, retrying request');
          
          // Retry the original request with new token
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return gfcompanyapi.request(error.config);
          }
        } catch (refreshError) {
          console.error('❌ GFCompany: Token refresh failed:', refreshError);
        }
      }
      
      // If refresh failed or no user, clear ONLY CompanyStaff data (not Firebase auth)
      const keysToRemove = [
        'gfcompany_staffId',
        'gfcompany_staff',
        'gfcompany_firebaseId',
        'gfcompany_firebaseToken',
        'gfcompany_email',
        'gfcompany_company',
        'gfcompany_companyId',
        'gfcompany_role'
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Redirect to signin (not signup) - user might just need to re-auth
      console.log('🚫 GFCompany: Redirecting to signin');
      window.location.href = '/gfcompanysignin';
    }
    
    return Promise.reject(error);
  }
);

export default gfcompanyapi;

