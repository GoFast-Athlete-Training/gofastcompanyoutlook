import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gfcompanyapi from '../lib/gfcompanyapi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function GFCompanyWelcome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [staff, setStaff] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const auth = getAuth();

    const hydrateStaff = async () => {
      try {
        console.log('🚀 GFCompany WELCOME: Hydrating Staff data...');

        const response = await gfcompanyapi.get('/api/staff/hydrate');

        if (!response.data.success) {
          console.error('❌ GFCompany: Hydration failed:', response.data.error);
          if (isMounted) {
            setError('Failed to load your account. Please try again.');
            setLoading(false);
          }
          return;
        }

        const { staff: staffData } = response.data;
        console.log('✅ GFCompany WELCOME: Staff hydrated:', staffData);

        localStorage.setItem('gfcompany_staffId', staffData.id);
        localStorage.setItem('gfcompany_staff', JSON.stringify(staffData));
        localStorage.setItem('gfcompany_role', staffData.role);

        if (!isMounted) return;

        setStaff(staffData);
        setLoading(false);

        // Check if company exists
        if (!staffData.company) {
          console.log('⚠️ GFCompany: No company found → redirecting to company settings');
          navigate('/company-settings', { replace: true });
          return;
        }

        // Company exists - save to localStorage
        const company = {
          ...staffData.company,
          role: staffData.role,
        };

        localStorage.setItem('gfcompany_company', JSON.stringify(company));
        localStorage.setItem('gfcompany_companyId', company.id);
        localStorage.setItem('gfcompany_containerId', company.containerId);

        // Navigate to command central
        if (window.location.pathname !== '/') {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('❌ GFCompany WELCOME: Hydration error:', error);

        if (!isMounted) return;

        setLoading(false);

        if (error.response?.status === 401) {
          console.log('🚫 GFCompany: Unauthorized → redirecting to signin');
          navigate('/gfcompanysignin', { replace: true });
          return;
        }

        if (error.response?.status === 404) {
          console.log('👤 GFCompany: User not found → redirecting to signup');
          navigate('/gfcompanysignup', { replace: true });
          return;
        }

        setError('Failed to load your account. Please try again.');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        console.log('❌ GFCompany: No Firebase user found → redirecting to signin');
        navigate('/gfcompanysignin', { replace: true });
        setLoading(false);
        return;
      }

      hydrateStaff();
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigate]);

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

  // This should never render since we auto-navigate, but just in case
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
        <p className="text-white text-xl">Redirecting...</p>
      </div>
    </div>
  );
}

