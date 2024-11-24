// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'localhost',
  projectId: 'schoolerp-a74fb',
  storageBucket: 'gs://schoolerp-a74fb.firebasestorage.app',
  messagingSenderId: '198618808281',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};
console.log("Firebase Config:", firebaseConfig);

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, app };
