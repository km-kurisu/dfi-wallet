import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyAFS8GbpyPLaUtqgiuTaOF7ckKP_dGEqk4",
  authDomain: "dfi-wallet.firebaseapp.com",
  databaseURL: "https://dfi-wallet-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dfi-wallet",
  storageBucket: "dfi-wallet.firebasestorage.app",
  messagingSenderId: "288684233863",
  appId: "1:288684233863:web:dab3c15b3f8127122ad422",
  measurementId: "G-6P9SX2LN5Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only in browser context to avoid SSR issues
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'  // Forces account selection even when one account is available
});

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app; 