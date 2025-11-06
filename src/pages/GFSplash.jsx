import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';

export default function GFSplash() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check Firebase auth state AND localStorage for staff data
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Check if we have both Firebase user AND staff data in localStorage
      const staffId = localStorage.getItem('gfcompany_staffId');
      const staff = localStorage.getItem('gfcompany_staff');
      
      if (user && staffId && staff) {
        // Has Firebase auth AND staff data → go to welcome (hydration hub)
        console.log('✅ GFSplash: User authenticated with staff data → Welcome');
        navigate('/gfcompanywelcome');
      } else {
        // No Firebase user OR no staff data → go to signin
        console.log('❌ GFSplash: No user or no staff data → Signin');
        console.log('   Firebase user:', !!user);
        console.log('   Staff ID:', !!staffId);
        console.log('   Staff data:', !!staff);
        
        // Clear any stale data
        if (!user) {
          localStorage.removeItem('gfcompany_staffId');
          localStorage.removeItem('gfcompany_staff');
          localStorage.removeItem('gfcompany_firebaseId');
          localStorage.removeItem('gfcompany_firebaseToken');
        }
        
        navigate('/gfcompanysignin');
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

