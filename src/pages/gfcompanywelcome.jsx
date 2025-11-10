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

        console.log('🚀 GFCompany WELCOME: Hydrating Company data...');
        
        // Call company hydration endpoint (returns full company with all relations + staff)
        const response = await gfcompanyapi.get('/api/company/hydrate');
        
        const { success, company: companyData, staff: staffData } = response.data;

        if (!success) {
          console.error('❌ GFCompany: Hydration failed:', response.data.error || 'Invalid response');
          navigate('/gfcompanysignup', { replace: true });
          return;
        }

        if (!staffData) {
          console.error('❌ GFCompany: Staff data missing from response');
          navigate('/gfcompanysignup', { replace: true });
          return;
        }

        console.log('✅ GFCompany WELCOME: Staff hydrated:', staffData);
        console.log('✅ GFCompany WELCOME: Role:', staffData.role);
        console.log('✅ GFCompany WELCOME: Start Date:', staffData.startDate);
        console.log('✅ GFCompany WELCOME: Salary:', staffData.salary);
        console.log('✅ GFCompany WELCOME: Company ID:', companyData?.id || staffData.companyId);

        // Store ALL staff data in localStorage (includes role, startDate, salary, etc.)
        localStorage.setItem('gfcompany_staffId', staffData.id);
        localStorage.setItem('gfcompany_staff', JSON.stringify(staffData));
        localStorage.setItem('gfcompany_role', staffData.role || ''); // Keep separate for quick access
        localStorage.setItem('gfcompany_firebaseId', staffData.firebaseId || firebaseUser.uid);
        localStorage.setItem('gfcompany_email', staffData.email || firebaseUser.email || '');

        // Routing Logic based on what's missing
        // Company check: Does staff have a company?
        if (!companyData && !staffData.companyId) {
          console.log('⚠️ GFCompany: No company found → redirecting to company settings');
          navigate('/company-settings', { replace: true });
          return;
        }

        // Company exists - save FULL company data with all relations
        if (companyData) {
          const company = {
            ...companyData,
            role: staffData.role, // Include staff role in company object
          };

          localStorage.setItem('gfcompany_company', JSON.stringify(company));
          localStorage.setItem('gfcompany_companyId', company.id);
          localStorage.setItem('gfcompany_containerId', company.containerId);
          localStorage.setItem('gfcompany_companyHQ', JSON.stringify(company));
          localStorage.setItem('gfcompany_companyHQId', company.id);
          
          console.log('✅ GFCompany WELCOME: Company stored with all relations');
          console.log('   - Roadmap Items:', company.roadmapItems?.length || 0);
          console.log('   - Contacts:', company.contacts?.length || 0);
          console.log('   - Tasks:', company.tasks?.length || 0);
          console.log('   - Product Pipeline:', company.productPipelineItems?.length || 0);
          console.log('   - Financial Spends:', company.financialSpends?.length || 0);
          console.log('   - Financial Projections:', company.financialProjections?.length || 0);
          console.log('   - Staff:', company.staff?.length || 0);
        }

        // Store Firebase token for API calls
        const token = await firebaseUser.getIdToken();
        localStorage.setItem('gfcompany_firebaseToken', token);
        localStorage.setItem('gfcompany_email', firebaseUser.email || '');

        console.log('✅ GFCompany WELCOME: All data stored in localStorage');
        console.log('✅ GFCompany WELCOME: Staff ID:', staffData.id);
        console.log('✅ GFCompany WELCOME: Company ID:', company.id);
        console.log('✅ GFCompany WELCOME: Role:', staffData.role);
        
        // Verify localStorage was actually written
        const storedCompany = localStorage.getItem('gfcompany_company');
        const storedStaff = localStorage.getItem('gfcompany_staff');
        console.log('🔍 GFCompany WELCOME: Verification - Company in localStorage:', !!storedCompany);
        console.log('🔍 GFCompany WELCOME: Verification - Staff in localStorage:', !!storedStaff);
        
        if (storedCompany) {
          const parsedCompany = JSON.parse(storedCompany);
          console.log('🔍 GFCompany WELCOME: Stored Company ID:', parsedCompany.id);
          console.log('🔍 GFCompany WELCOME: Stored Company Name:', parsedCompany.companyName);
        }

        // All complete - route directly to command central
        console.log('✅ GFCompany: Staff fully hydrated with company - routing to command central');
        navigate('/command-central', { replace: true });
        return;
        
      } catch (error) {
        console.error('❌ GFCompany WELCOME: Hydration error:', error);
        console.error('❌ GFCompany WELCOME: Error response:', error.response?.data);
        console.error('❌ GFCompany WELCOME: Error status:', error.response?.status);
        console.error('❌ GFCompany WELCOME: Error message:', error.message);
        
        // Check if data might have been stored despite error (network error after success)
        const storedCompany = localStorage.getItem('gfcompany_company');
        const storedStaff = localStorage.getItem('gfcompany_staff');
        
        if (storedCompany && storedStaff) {
          console.log('⚠️ GFCompany WELCOME: Error occurred BUT data exists in localStorage!');
          console.log('⚠️ GFCompany WELCOME: Attempting to proceed with stored data...');
          
          try {
            const parsedCompany = JSON.parse(storedCompany);
            const parsedStaff = JSON.parse(storedStaff);
            
            if (parsedCompany.id && parsedStaff.id) {
              console.log('✅ GFCompany WELCOME: Stored data is valid - routing to command central');
              navigate('/command-central', { replace: true });
              return;
            }
          } catch (parseError) {
            console.error('❌ GFCompany WELCOME: Failed to parse stored data:', parseError);
          }
        }
        
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
        
        // Network errors (CORS, 502, etc.) - check if we have cached data
        if (!error.response || error.response.status >= 500) {
          console.log('⚠️ GFCompany: Server error (possibly CORS/502) - checking for cached data...');
          if (storedCompany && storedStaff) {
            console.log('✅ GFCompany: Using cached data despite server error');
            navigate('/command-central', { replace: true });
            return;
          }
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

