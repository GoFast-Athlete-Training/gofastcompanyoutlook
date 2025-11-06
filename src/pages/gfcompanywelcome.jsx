import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gfcompanyapi from '../lib/gfcompanyapi';
import { getAuth } from 'firebase/auth';

export default function GFCompanyWelcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hydrateStaff = async () => {
      
      try {
        // Get Firebase user to ensure we have auth
        const auth = getAuth();
        const firebaseUser = auth.currentUser;
        
        if (!firebaseUser) {
          console.log('❌ GFCompany: No Firebase user found → redirecting to signup');
          navigate('/gfcompanysignup');
          return;
        }

        console.log('🚀 GFCompany WELCOME: Hydrating Staff data...');
        
        // Call hydration endpoint (token automatically added by api interceptor)
        const response = await gfcompanyapi.get('/api/staff/hydrate');
        
        if (!response.data.success) {
          console.error('❌ GFCompany: Hydration failed:', response.data.error);
          setError('Failed to load your account. Please try again.');
          setLoading(false);
          return;
        }

        const { staff: staffData } = response.data;
        console.log('✅ GFCompany WELCOME: Staff hydrated:', staffData);

        // Cache Staff data to localStorage
        localStorage.setItem('gfcompany_staffId', staffData.id);
        localStorage.setItem('gfcompany_staff', JSON.stringify(staffData));
        
        // Extract company from companyRoles (single company - GoFastCompany)
        if (staffData.companyRoles && staffData.companyRoles.length > 0) {
          const companyRole = staffData.companyRoles[0];
          const company = {
            ...companyRole.company,
            role: companyRole.role,  // Include role from junction
            department: companyRole.department
          };
          
          localStorage.setItem('gfcompany_company', JSON.stringify(company));
          localStorage.setItem('gfcompany_companyId', company.id);
          localStorage.setItem('gfcompany_containerId', company.containerId);
          localStorage.setItem('gfcompany_role', company.role);
        }

        setStaff(staffData);

        // Determine next route and navigate automatically
        // Check if GoFastCompany exists (no companyRoles = no company setup yet)
        if (!staffData.companyRoles || staffData.companyRoles.length === 0) {
          console.log('⚠️ GFCompany: No GoFastCompany found → navigating to company setup');
          // Auto-navigate to company create (we'll create a simple page or just go to command central)
          navigate('/');
          return;
        }

        // Check if staff has a name (basic profile requirement)
        if (!staffData.name || staffData.name.trim() === '') {
          console.log('⚠️ GFCompany: Missing name → navigating to profile setup');
          // For now, just go to command central - profile can be updated later
          navigate('/');
          return;
        }

        // All complete - ready for company screen
        console.log('✅ GFCompany: Staff fully hydrated - navigating to command central');
        navigate('/');
        
      } catch (error) {
        console.error('❌ GFCompany WELCOME: Hydration error:', error);
        
        // If 401, user not authenticated
        if (error.response?.status === 401) {
          console.log('🚫 GFCompany: Unauthorized → redirecting to signup');
          navigate('/gfcompanysignup');
          return;
        }
        
        // If user not found, redirect to signup
        if (error.response?.status === 404) {
          console.log('👤 GFCompany: User not found → redirecting to signup');
          navigate('/gfcompanysignup');
          return;
        }
        
        setError('Failed to load your account. Please try again.');
        setLoading(false);
      }
    };

    // Add a small delay to prevent jarring transitions
    const timer = setTimeout(() => {
      hydrateStaff();
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleContinue = () => {
    if (nextRoute) {
      navigate(nextRoute);
    }
  };

  // Show loading state while hydrating
  if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-white rounded-xl shadow-xl p-8">
            <p className="text-blue-600 text-lg mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show welcome screen with continue button
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome{staff?.name ? `, ${staff.name.split(' ')[0]}` : ''}!
          </h1>
          <p className="text-gray-600 mb-6">
            {staff?.companyRoles?.[0]?.company?.companyName
              ? `Ready to manage ${staff.companyRoles[0].company.companyName}?`
              : 'Ready to set up GoFast Company?'}
          </p>
          
          <button
            onClick={handleContinue}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg"
          >
            Continue →
          </button>
        </div>
      </div>
    </div>
  );
}

