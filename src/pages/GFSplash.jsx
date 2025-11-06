import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function GFSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check Firebase auth state AND localStorage for CompanyStaff-specific data
    // Important: Firebase user might exist from GoFast app, but we need CompanyStaff data
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Check if we have CompanyStaff-specific data in localStorage
      const staffId = localStorage.getItem('gfcompany_staffId');
      const staff = localStorage.getItem('gfcompany_staff');
      const companyFirebaseId = localStorage.getItem('gfcompany_firebaseId');
      
      // Must have BOTH Firebase user AND CompanyStaff data with matching firebaseId
      if (user && staffId && staff && companyFirebaseId === user.uid) {
        // Has Firebase auth AND matching CompanyStaff data → go to welcome (hydration hub)
        console.log('✅ GFSplash: User authenticated with CompanyStaff data → Welcome');
        navigate('/gfcompanywelcome');
      } else {
        // No Firebase user OR no CompanyStaff data OR firebaseId mismatch → go to signup
        console.log('❌ GFSplash: No CompanyStaff data → Signup');
        console.log('   Firebase user:', !!user);
        console.log('   Firebase UID:', user?.uid);
        console.log('   Company Firebase ID:', companyFirebaseId);
        console.log('   Staff ID:', !!staffId);
        console.log('   Staff data:', !!staff);
        
        // Clear ALL CompanyStaff data (might be from different Firebase user)
        localStorage.removeItem('gfcompany_staffId');
        localStorage.removeItem('gfcompany_staff');
        localStorage.removeItem('gfcompany_firebaseId');
        localStorage.removeItem('gfcompany_firebaseToken');
        localStorage.removeItem('gfcompany_email');
        localStorage.removeItem('gfcompany_company');
        localStorage.removeItem('gfcompany_companyId');
        localStorage.removeItem('gfcompany_containerId');
        localStorage.removeItem('gfcompany_role');
        
        // If Firebase user exists but no CompanyStaff data, sign out Firebase
        // (This handles case where user is signed into GoFast app but not Company Stack)
        if (user && !staffId) {
          console.log('⚠️ GFSplash: Firebase user exists but no CompanyStaff → signing out Firebase');
          try {
            await signOut(auth);
            console.log('✅ GFSplash: Signed out from Firebase');
          } catch (error) {
            console.error('❌ GFSplash: Error signing out:', error);
          }
        }
        
        navigate('/gfcompanysignup');
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <img src="/logo.jpg" alt="GoFast Company" className="h-32 mx-auto mb-8 rounded-full" />
        <h1 className="text-4xl font-bold text-white mb-2">
          GoFast Company Stack
        </h1>
        <p className="text-xl text-white/80 mb-8">
          The Operating System for Founders
        </p>
        
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </div>
    </div>
  );
}

