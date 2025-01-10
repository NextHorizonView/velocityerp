import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth"; // Import the persistence method
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

// Helper to get the school ID from the path or subdomain
const getSchoolIdFromPath = (): string => {
  if (typeof window !== "undefined") {
    const { hostname, pathname, href } = window.location;

    console.log("Full URL (href):", href); // Log the entire URL
    console.log("Hostname:", hostname); // Log the hostname
    console.log("Pathname:", pathname); // Log the pathname

    const subdomainMatch = hostname.split(".")[0];
    console.log("Subdomain Match:", subdomainMatch);

    if (subdomainMatch && subdomainMatch !== "localhost" && subdomainMatch !== "www") {
      return subdomainMatch; // If we are on a subdomain like school1.velocityerp.vercel.app
    }

    const pathParts = pathname.split("/");
    console.log("Path Parts:", pathParts); // Check what path parts look like

    if (pathParts[1] && pathParts[1] !== "") {
      return pathParts[1]; // Assume the first path segment is the school ID
    }
  }

  return "default"; // Default config if no school ID is found
};


// Lazy initialization of Firebase
let firebaseApp: FirebaseApp | null = null;

const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    const schoolId = getSchoolIdFromPath();
    const configKey = firebaseConfigs[schoolId] ? schoolId : "default"; // Fallback to default if school ID not found
    const config = firebaseConfigs[configKey];

    const existingApp = getApps().find((app) => app.name === configKey);
    firebaseApp = existingApp || initializeApp(config, configKey);
  }

  return firebaseApp;
};

// Export Firebase services dynamically
const getFirebaseServices = () => {
  const app = getFirebaseApp();
  const auth = getAuth(app);

  // Ensure authentication persists
  setPersistence(auth, browserLocalPersistence) // Add persistence setting here
    .then(() => {
      // Authentication persistence is set
    })
    .catch((error) => {
      console.error("Error setting persistence:", error);
    });

  const db = getFirestore(app);
  const storage = getStorage(app);

  return { app, auth, db, storage };
};

export { getFirebaseServices };
