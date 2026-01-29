// lib/firebase.ts
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import {
  Auth,
  signOut as firebaseSignOut,
  getAuth,
  onAuthStateChanged,
  signInWithCustomToken
} from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import { Firestore, getFirestore } from "firebase/firestore";

// Firebase configuration - these should be set in environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    `https://${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let database: Database;
let firestore: Firestore;

if (typeof window !== "undefined") {
  // Only initialize on client side
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
  database = getDatabase(app);
  firestore = getFirestore(app);
}

/**
 * Sign in to Firebase with custom token
 * @param customToken - The Firebase custom token from the backend
 */
export const signInWithFirebaseToken = async (
  customToken: string
): Promise<void> => {
  if (typeof window === "undefined" || !auth) {
    throw new Error("Firebase auth is not available");
  }

  await signInWithCustomToken(auth, customToken);
};

/**
 * Sign out from Firebase
 */
export const signOutFirebase = async (): Promise<void> => {
  if (typeof window === "undefined" || !auth) {
    return;
  }

  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("❌ Firebase sign out error:", error);
    throw error;
  }
};

/**
 * Get current Firebase auth state
 */
export const getFirebaseAuth = (): Auth | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return auth;
};

/**
 * Get Firebase database instance
 */
export const getFirebaseDatabase = (): Database | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return database;
};

export const getFirebaseFirestore = (): Firestore | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return firestore;
};

/**
 * Listen to auth state changes
 */
export const onAuthStateChange = (
  callback: (user: any) => void
): (() => void) => {
  if (typeof window === "undefined" || !auth) {
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

export { auth, database, firestore };
