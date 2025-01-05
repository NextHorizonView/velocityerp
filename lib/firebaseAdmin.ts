import admin from 'firebase-admin';

// Use environment variables for Firebase Admin credentials
const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

export const adminAuth = admin.auth();
export const adminFirestore = admin.firestore();
