"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import Cookies from 'js-cookie';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in cookies
    const sessionId = Cookies.get('sessionId');
    const userData = Cookies.get('userData');
    
    if (sessionId && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from cookie:', error);
        // Clear invalid cookies
        Cookies.remove('sessionId');
        Cookies.remove('userData');
      }
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};
        
        const fullUserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || userData.displayName,
          ...userData
        };

        setUser(fullUserData);
        
        // Store session in cookies (client-side)
        const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
        Cookies.set('sessionId', sessionId, { expires: 7 }); // 7 days
        Cookies.set('userData', JSON.stringify(fullUserData), { expires: 7 });
      } else {
        setUser(null);
        // Clear session cookies
        Cookies.remove('sessionId');
        Cookies.remove('userData');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile with display name
      await updateProfile(userCredential.user, { displayName });
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        createdAt: new Date().toISOString(),
        walletAddress: null,
        isVerified: false,
        onboardingCompleted: false,
        defaultHomepage: 'wallet'
      });

      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // Cookies will be cleared by the auth state listener
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateUserData = async (uid, data) => {
    try {
      await setDoc(doc(db, 'users', uid), data, { merge: true });
      
      // Update local user state
      setUser(prev => ({ ...prev, ...data }));
      
      // Update cookie
      const updatedUser = { ...user, ...data };
      Cookies.set('userData', JSON.stringify(updatedUser), { expires: 7 });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Google sign in method
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      // If this is first sign-in, save user data to Firestore
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          displayName: user.displayName || 'Google User',
          email: user.email,
          photoURL: user.photoURL || '',
          createdAt: new Date().toISOString(),
          walletAddress: null,
          isVerified: false,
          onboardingCompleted: false,
          provider: 'google',
          defaultHomepage: 'wallet'
        });
      }
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    signup,
    signin,
    signInWithGoogle,
    logout,
    updateUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 