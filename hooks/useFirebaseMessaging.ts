import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";
import { getFirebaseServices } from "@/lib/firebaseConfig"; // Ensure this is your Firebase config file

export const useFirebaseMessaging = () => {
  const { auth, db } = getFirebaseServices();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const messaging = typeof window !== "undefined" ? getMessaging() : null;

  useEffect(() => {
    if (typeof window === "undefined" || !messaging) return;

    const registerServiceWorker = async () => {
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

    const requestFCMToken = async () => {
      if (!("Notification" in window)) {
        console.error("This browser does not support notifications.");
        return;
      }

      if (Notification.permission === "denied") {
        console.warn("Notifications are blocked.");
        return;
      }

      try {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          console.warn("User denied notification permission.");
          return;
        }

        // Check if token exists in localStorage
        const existingToken = localStorage.getItem("fcmToken");
        if (existingToken) {
          setFcmToken(existingToken);
          return;
        }

        // Get FCM token
        const token = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
        });

        if (token) {
          console.log("FCM Token received:", token);
          setFcmToken(token);
          localStorage.setItem("fcmToken", token);

          // Store token in Firestore
          const user = auth.currentUser;
          if (user) {
            const userRef = doc(db, "Users", user.uid);
            await setDoc(userRef, { fcmToken: token }, { merge: true });
          }
        } else {
          console.error("Failed to get FCM token.");
        }
      } catch (error) {
        console.error("Error requesting FCM token:", error);
      }
    };

    const listenForMessages = () => {
      if (!messaging) return;
      onMessage(messaging, (payload) => {
        console.log("Message received:", payload);
        // Handle the notification logic here (e.g., show a toast)
      });
    };

    registerServiceWorker().then(() => {
      requestFCMToken();
      listenForMessages();
    });
  }, [auth, db, messaging]);

  return { fcmToken };
};
