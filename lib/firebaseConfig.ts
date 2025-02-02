import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getMessaging, getToken, onMessage, isSupported, Messaging } from "firebase/messaging";

type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const firebaseConfigs: Record<string, FirebaseConfig> = {
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

// Helper function to determine the school ID from the URL
const getSchoolIdFromPath = (): string => {
  if (typeof window !== "undefined") {
    const { hostname, pathname } = window.location;
    const subdomainMatch = hostname.split(".")[0];

    if (subdomainMatch && subdomainMatch !== "localhost" && subdomainMatch !== "www") {
      return subdomainMatch;
    }

    const pathParts = pathname.split("/");
    if (pathParts[1] && pathParts[1] !== "") {
      return pathParts[1];
    }
  }
  return "default";
};

// Lazy initialization of Firebase
let firebaseApp: FirebaseApp | null = null;

const getFirebaseApp = (): FirebaseApp => {
  if (!firebaseApp) {
    const schoolId = getSchoolIdFromPath();
    const configKey = firebaseConfigs[schoolId] ? schoolId : "default";
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
  setPersistence(auth, browserLocalPersistence).catch(console.error);
  const db = getFirestore(app);
  const storage = getStorage(app);
  let messaging: Messaging | null = null;

  // Ensure Firebase Messaging is only initialized in the browser
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported) {
        messaging = getMessaging(app);
      }
    });
  }

  // Register the service worker before requesting the token
  const registerServiceWorker = async () => {
    if (typeof window === "undefined") return null;

    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js");
        console.log("Service Worker registered:", registration);
        return registration;
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    }
    return null;
  };

  // Request FCM Token
  const requestFCMToken = async () => {
    if (typeof window === "undefined") return null;

    if (!("Notification" in window)) {
      console.error("This browser does not support notifications.");
      return null;
    }

    if (Notification.permission === "denied") {
      console.warn("Notifications are blocked.");
      return null;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        console.warn("User denied notification permission.");
        return null;
      }

      // Check if token exists
      const existingToken = localStorage.getItem("fcmToken");
      if (existingToken) return existingToken;

      if (!messaging) {
        console.error("Firebase Messaging is not supported in this browser.");
        return null;
      }

      const fcmToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });

      if (fcmToken) {
        console.log("FCM Token received:", fcmToken);

        // Store token in Firestore
        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "Users", user.uid);
          await setDoc(userRef, { fcmToken }, { merge: true });
        }

        // Save token in local storage
        localStorage.setItem("fcmToken", fcmToken);
        return fcmToken;
      } else {
        console.error("Failed to get FCM token.");
        return null;
      }
    } catch (error) {
      console.error("Error requesting FCM token:", error);
      return null;
    }
  };

  // Listen for incoming messages
  const onMessageListener = () => {
    return new Promise((resolve) => {
      if (!messaging) {
        console.error("Firebase Messaging is not initialized.");
        return;
      }
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        resolve(payload);
      });
    });
  };

  return { app, auth, db, storage, messaging, requestFCMToken, onMessageListener, registerServiceWorker };
};

export { getFirebaseServices };