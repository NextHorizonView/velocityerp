import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

interface FirebaseConfigs {
  [key: string]: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
}

// Firebase configurations for multiple schools
const firebaseConfigs: FirebaseConfigs = {
  default: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  },
  school1: {
    apiKey: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_SCHOOL1_FIREBASE_APP_ID!,
  },
  school2: {
    apiKey: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_SCHOOL2_FIREBASE_APP_ID!,
  },
};

// Helper to extract the school ID from the URL
const getSchoolIdFromPath = (): string => {
  if (typeof window !== "undefined") {
    const pathParts = window.location.pathname.split("/");
    return pathParts[1]; // Assumes the structure is /school1, /school2, etc.
  }
  return "default"; // Default config if no school ID is found
};

// Helper to get Firebase app based on the school ID
const getFirebaseApp = (): FirebaseApp => {
  const schoolId = getSchoolIdFromPath();
  const configKey = firebaseConfigs[schoolId] ? schoolId : "default"; // Fallback to default if school ID not found
  const config = firebaseConfigs[configKey];

  const existingApp = getApps().find((app) => app.name === configKey);
  return existingApp || initializeApp(config, configKey);
};

// Export Firebase services dynamically
const getFirebaseServices = () => {
  const app = getFirebaseApp();
  const auth = getAuth(app);
  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, auth, db, storage };
};

export { getFirebaseServices };
