// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, setPersistence, browserLocalPersistence, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjpoH763y2GH4VDc181IUBaZHqE_ryZ1c",
  authDomain: "gofast-a5f94.firebaseapp.com",
  projectId: "gofast-a5f94",
  storageBucket: "gofast-a5f94.firebasestorage.app",
  messagingSenderId: "500941094498",
  appId: "1:500941094498:web:1d8c5ba381392ae2889b3b",
  measurementId: "G-3RQJNF0F4G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error('❌ Firebase: Failed to set auth persistence:', error);
});

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

/**
 * Sign in with Google OAuth
 * @returns {Promise<{uid: string, email: string, name: string, photoURL: string}>}
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    console.log('✅ Firebase: Signed in with Google:', user.email);
    
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error("❌ Firebase: Sign-in error:", error);
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  try {
    await signOut(auth);
    console.log("✅ Firebase: User signed out");
  } catch (error) {
    console.error("❌ Firebase: Sign out error:", error);
    throw error;
  }
}

/**
 * Get current authenticated user
 * @returns {import("firebase/auth").User | null}
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Sign up with email and password
 * @param {string} email
 * @param {string} password
 * @param {string} displayName
 * @returns {Promise<{uid: string, email: string, name: string, photoURL: string}>}
 */
export async function signUpWithEmail(email, password, displayName) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    if (displayName) {
      await user.updateProfile({ displayName });
    }
    
    console.log('✅ Firebase: Signed up with email:', user.email);
    
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName || displayName,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error("❌ Firebase: Sign up error:", error);
    throw error;
  }
}

/**
 * Sign in with email and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{uid: string, email: string, name: string, photoURL: string}>}
 */
export async function signInWithEmail(email, password) {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    console.log('✅ Firebase: Signed in with email:', user.email);
    
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error("❌ Firebase: Sign in error:", error);
    throw error;
  }
}

/**
 * Get Firebase ID token for authenticated requests
 * @returns {Promise<string>}
 */
export async function getIdToken() {
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user authenticated');
  }
  return await user.getIdToken();
}

export { app, analytics };

