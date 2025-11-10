import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gfcompanyapi from '../lib/gfcompanyapi';
import { getAuth } from 'firebase/auth';

export default function GFCompanyWelcome() {
  const navigate = useNavigate();

  useEffect(() => {
    const hydrateStaff = async () => {
      try {
        // Get Firebase user to ensure we have auth
        const auth = getAuth();
        const firebaseUser = auth.currentUser;
        
        if (!firebaseUser) {
          console.log('❌ GFCompany: No Firebase user found → redirecting to signin');
          navigate('/gfcompanysignin', { replace: true });
          return;
        }

        console.log('🚀 GFCompany WELCOME: Hydrating Staff data...');
        
        // Call hydration endpoint (token automatically added by api interceptor)
        const response = await gfcompanyapi.get('/api/staff/hydrate');
        
        const { success, staff: staffData } = response.data;

        if (!success || !staffData) {
          console.error('❌ GFCompany: Hydration failed:', response.data.error || 'Invalid response');
          navigate('/gfcompanysignup', { replace: true });
          return;
        }

        console.log('✅ GFCompany WELCOME: Staff hydrated:', staffData);

        // Store staff data in localStorage
        localStorage.setItem('gfcompany_staffId', staffData.id);
        localStorage.setItem('gfcompany_staff', JSON.stringify(staffData));
        localStorage.setItem('gfcompany_role', staffData.role || '');
        localStorage.setItem('gfcompany_firebaseId', firebaseUser.uid);

        // Routing Logic based on what's missing
        // Company check: Does staff have a company?
        if (!staffData.company || !staffData.companyId) {
          console.log('⚠️ GFCompany: No company found → redirecting to company settings');
          navigate('/command-central/company-settings', { replace: true });
          return;
        }

        // Company exists - save to localStorage
        const company = {
          ...staffData.company,
          role: staffData.role,
        };

        localStorage.setItem('gfcompany_company', JSON.stringify(company));
        localStorage.setItem('gfcompany_companyId', company.id);

        // All complete - route directly to command central
        console.log('✅ GFCompany: Staff fully hydrated with company - routing to command central');
        navigate('/command-central', { replace: true });
        return;
        
      } catch (error) {
        console.error('❌ GFCompany WELCOME: Hydration error:', error);
        // If 401, user not authenticated or token expired
        if (error.response?.status === 401) {
          console.log('🚫 GFCompany: Unauthorized → redirecting to signin');
          navigate('/gfcompanysignin', { replace: true });
          return;
        }
        
        // If user not found, redirect to signup
        if (error.response?.status === 404) {
          console.log('👤 GFCompany: Staff not found → redirecting to signup');
          navigate('/gfcompanysignup', { replace: true });
          return;
        }
        
        // Other errors - redirect to signup
        navigate('/gfcompanysignup', { replace: true });
      }
    };

    hydrateStaff();
  }, [navigate]);

  // Show loading state while hydrating (will route away when complete)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading your account...</p>
      </div>
    </div>
  );
}

