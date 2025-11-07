import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signInWithEmail, auth } from "../config/firebaseConfig";
import gfcompanyapi from "../lib/gfcompanyapi";

export default function GFCompanySignin() {
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authMethod, setAuthMethod] = useState('google'); // 'google' or 'email'
  const [emailData, setEmailData] = useState({
    email: '',
    password: ''
  });

  const handleGoogleSignIn = async () => {
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      console.log("🚀 GFCompany: Starting sign-in with Google...");
      const result = await signInWithGoogle();
      
      console.log("✅ GFCompany: Google sign-in successful:", result);
      
      // Call backend staff create route (Pattern A - find or create)
      const res = await gfcompanyapi.post("/api/staff/create", {
        firebaseId: result.uid,
        email: result.email,
        firstName: result.name?.split(' ')[0] || '',
        lastName: result.name?.split(' ').slice(1).join(' ') || '',
        photoURL: result.photoURL,
        role: 'Founder' // Assign Founder role on initial sign in (validated against roleConfig.js)
      });
      
      const { staff } = res.data;
      console.log("✅ GFCompany: Staff found/created:", staff.id);
      
      // Store auth data
      localStorage.setItem("gfcompany_firebaseId", result.uid);
      localStorage.setItem("gfcompany_staffId", staff.id);
      localStorage.setItem("gfcompany_email", staff.email || result.email);
      
      // Store Firebase token for future requests
      const idToken = await auth.currentUser.getIdToken();
      localStorage.setItem("gfcompany_firebaseToken", idToken);
      
      // Redirect to welcome (hydration hub)
      console.log("✅ GFCompany: User authenticated → Welcome");
      navigate("/gfcompanywelcome");
      
    } catch (error) {
      console.error("❌ GFCompany: Google sign-in failed:", error);
      alert("Sign-in failed. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    if (isSigningIn) return;
    
    setIsSigningIn(true);
    try {
      console.log("🚀 GFCompany: Starting sign-in with email...");
      const result = await signInWithEmail(emailData.email, emailData.password);
      
      console.log("✅ GFCompany: Email sign-in successful:", result);
      
      // Call backend staff create route (Pattern A - find or create)
      const res = await gfcompanyapi.post("/api/staff/create", {
        firebaseId: result.uid,
        email: result.email,
        firstName: result.name?.split(' ')[0] || '',
        lastName: result.name?.split(' ').slice(1).join(' ') || '',
        photoURL: result.photoURL,
        role: 'Founder' // Assign Founder role on initial sign in (validated against roleConfig.js)
      });
      
      const { staff } = res.data;
      console.log("✅ GFCompany: Staff found/created:", staff.id);
      
      // Store auth data
      localStorage.setItem("gfcompany_firebaseId", result.uid);
      localStorage.setItem("gfcompany_staffId", staff.id);
      localStorage.setItem("gfcompany_email", staff.email || result.email);
      
      // Store Firebase token for future requests
      const idToken = await auth.currentUser.getIdToken();
      localStorage.setItem("gfcompany_firebaseToken", idToken);
      
      // Redirect to welcome (hydration hub)
      console.log("✅ GFCompany: User authenticated → Welcome");
      navigate("/gfcompanywelcome");
      
    } catch (error) {
      console.error("❌ GFCompany: Email sign-in failed:", error);
      alert("Sign-in failed. Please check your credentials.");
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        
        {/* Logo */}
        <div className="space-y-4">
          <img src="/logo.jpg" alt="GoFast Company" className="h-20 mx-auto rounded-full" />
          
          <h1 className="text-3xl font-bold text-white">
            Welcome Back!
          </h1>
          <p className="text-white/80 text-lg">
            Sign in to continue managing your company
          </p>
        </div>

        {/* Auth Method Toggle */}
        <div className="flex bg-white/10 rounded-xl p-1 mb-6">
          <button
            onClick={() => setAuthMethod('google')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              authMethod === 'google' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Google
          </button>
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
              authMethod === 'email' 
                ? 'bg-white/20 text-white' 
                : 'text-white/70 hover:text-white'
            }`}
          >
            Email
          </button>
        </div>

        {/* Google Sign In */}
        {authMethod === 'google' && (
          <button
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
            className="w-full bg-white/20 border-2 border-white/30 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/30 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {isSigningIn ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        )}

        {/* Email Sign In Form */}
        {authMethod === 'email' && (
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <input
              type="email"
              placeholder="Email Address"
              value={emailData.email}
              onChange={(e) => setEmailData({...emailData, email: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={emailData.password}
              onChange={(e) => setEmailData({...emailData, password: e.target.value})}
              className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              disabled={isSigningIn}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition shadow-lg disabled:opacity-50"
            >
              {isSigningIn ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>
        )}

        {/* New user link */}
        <p className="text-white/80 text-sm">
          Don't have an account?{" "}
          <button
            onClick={() => navigate("/gfcompanysignup")}
            className="text-blue-300 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>

        {/* Back to Home */}
        <div className="pt-4 border-t border-white/20">
          <button
            onClick={() => navigate('/')}
            className="text-white/80 hover:text-white transition text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

