import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle, signUpWithEmail, auth } from "../config/firebaseConfig";
import gfcompanyapi from "../lib/gfcompanyapi";

export default function GFCompanySignup() {
  const navigate = useNavigate();
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailData, setEmailData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });

  const handleGoogleSignUp = async () => {
    if (isSigningUp) return;

    setIsSigningUp(true);
    try {
      console.log("🚀 GFCompany: Starting signup with Google...");
      const result = await signInWithGoogle();

      console.log("✅ GFCompany: Google signup successful:", result);

      // Call backend create route (Pattern A - no token needed)
      const firstName = result.name?.split(' ')[0] || '';
      const lastName = result.name?.split(' ').slice(1).join(' ') || '';        

      const res = await gfcompanyapi.post("/api/staff/create", {
        firebaseId: result.uid,
        email: result.email,
        firstName,
        lastName,
        photoURL: result.photoURL,
        role: 'founder'  // Assign founder role on initial sign in
      });

      // Response structure: { success: true, staff: {...} }
      const staff = res.data.staff;
      if (!staff) {
        throw new Error('Staff creation failed - no staff returned');
      }

      console.log("✅ GFCompany: Staff created/found:", staff.id);

      // Store auth data
      localStorage.setItem("gfcompany_firebaseId", result.uid);
      localStorage.setItem("gfcompany_staffId", staff.id);
      localStorage.setItem("gfcompany_email", staff.email || result.email);
      
      // Store Firebase token for future requests
      const idToken = await auth.currentUser.getIdToken();
      localStorage.setItem("gfcompany_firebaseToken", idToken);

      // NEW USER → Welcome (hydration hub)
      console.log("✅ GFCompany: New user → Welcome");
      navigate("/gfcompanywelcome");

    } catch (error) {
      console.error("❌ GFCompany: Google signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  const handleEmailSignUp = async (e) => {
    e.preventDefault();
    if (isSigningUp) return;

    if (emailData.password !== emailData.confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    setIsSigningUp(true);
    try {
      console.log("🚀 GFCompany: Starting signup with email...");
      const displayName = `${emailData.firstName} ${emailData.lastName}`.trim();
      const result = await signUpWithEmail(emailData.email, emailData.password, displayName);                                                                   

      console.log("✅ GFCompany: Email signup successful:", result);

      // Call backend create route (Pattern A - no token needed)
      const res = await gfcompanyapi.post("/api/staff/create", {
        firebaseId: result.uid,
        email: result.email,
        firstName: emailData.firstName,
        lastName: emailData.lastName,
        photoURL: result.photoURL,
        role: 'founder'  // Assign founder role on initial sign in
      });

      // Response structure: { success: true, staff: {...} }
      const staff = res.data.staff;
      if (!staff) {
        throw new Error('Staff creation failed - no staff returned');
      }

      console.log("✅ GFCompany: Staff created/found:", staff.id);

      // Store auth data
      localStorage.setItem("gfcompany_firebaseId", result.uid);
      localStorage.setItem("gfcompany_staffId", staff.id);
      localStorage.setItem("gfcompany_email", staff.email || result.email);
      
      // Store Firebase token for future requests
      const idToken = await auth.currentUser.getIdToken();
      localStorage.setItem("gfcompany_firebaseToken", idToken);

      // NEW USER → Welcome (hydration hub)
      console.log("✅ GFCompany: New user → Welcome");
      navigate("/gfcompanywelcome");

    } catch (error) {
      console.error("❌ GFCompany: Email signup failed:", error);
      alert("Signup failed. Please try again.");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center space-y-8 bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-white/20">
        
        {/* Logo */}
        <div className="space-y-4">
          <img src="/logo.jpg" alt="GoFast Company" className="h-20 mx-auto rounded-full" />
          
          <h1 className="text-3xl font-bold text-white">
            Welcome to GoFast Company!
          </h1>
        </div>

        {!showEmailForm ? (
          <>
            {/* Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              disabled={isSigningUp}
              className="w-full bg-white text-gray-800 py-4 px-6 rounded-xl font-semibold hover:bg-gray-100 transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>{isSigningUp ? 'Signing up...' : 'Sign up with Google'}</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 border-t border-white/30"></div>
              <span className="text-white/60 text-sm">or</span>
              <div className="flex-1 border-t border-white/30"></div>
            </div>

            {/* Email Sign Up Option */}
            <button
              onClick={() => setShowEmailForm(true)}
              disabled={isSigningUp}
              className="w-full bg-white/10 border-2 border-white/30 text-white py-4 px-6 rounded-xl font-semibold hover:bg-white/20 transition shadow-lg disabled:opacity-50"
            >
              Sign up with Email
            </button>
          </>
        ) : (
          <>
            {/* Email Sign Up Form */}
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">First Name *</label>
                  <input
                    type="text"
                    required
                    value={emailData.firstName}
                    onChange={(e) => setEmailData({...emailData, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={emailData.lastName}
                    onChange={(e) => setEmailData({...emailData, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={emailData.email}
                  onChange={(e) => setEmailData({...emailData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={emailData.password}
                  onChange={(e) => setEmailData({...emailData, password: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Minimum 6 characters"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Confirm Password *</label>
                <input
                  type="password"
                  required
                  value={emailData.confirmPassword}
                  onChange={(e) => setEmailData({...emailData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Confirm your password"
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1 px-6 py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50"
                >
                  {isSigningUp ? 'Signing up...' : 'Sign Up'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* Already have account */}
        <p className="text-white/80 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/gfcompanysignin")}
            className="text-blue-300 font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}

