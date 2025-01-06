import admin from 'firebase-admin';

// Firebase Admin configurations for multiple schools
interface AdminConfigs {
  [key: string]: {
    credentials: admin.ServiceAccount;
    databaseURL: string;
  };
}

// Admin configurations (stored securely in environment variables)
const adminConfigs: AdminConfigs = {
  default: {
    credentials: JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS || '{}'),
    databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  },
  school1: {
    credentials: JSON.parse(process.env.SCHOOL1_FIREBASE_ADMIN_CREDENTIALS || '{}'),
    databaseURL: process.env.SCHOOL1_FIREBASE_DATABASE_URL || '',
  },
  school2: {
    credentials: JSON.parse(process.env.SCHOOL2_FIREBASE_ADMIN_CREDENTIALS || '{}'),
    databaseURL: process.env.SCHOOL2_FIREBASE_DATABASE_URL || '',
  },
};

// Helper to extract the school ID from the URL
const getSchoolIdFromPath = (): string => {
  if (typeof window !== 'undefined') {
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] || 'default'; // Default config if no school ID is found
  }
  return 'default'; // Default for server-side rendering
};

// Helper to get Firebase Admin app dynamically
const getAdminApp = (): admin.app.App => {
  const schoolId = getSchoolIdFromPath();
  const configKey = adminConfigs[schoolId] ? schoolId : 'default'; // Fallback to default if school ID not found
  const { credentials, databaseURL } = adminConfigs[configKey];

  // Safely find an existing app
  const app = admin.apps.find((app) => app?.name === configKey) || null;

  // Initialize a new app if not found
  if (!app) {
    return admin.initializeApp(
      {
        credential: admin.credential.cert(credentials),
        databaseURL,
      },
      configKey
    );
  }

  return app; // TypeScript now knows `app` cannot be null
};

// Export Firebase Admin services dynamically
const getAdminServices = () => {
  const adminApp = getAdminApp();
  const adminAuth = adminApp.auth();
  const adminFirestore = adminApp.firestore();

  return { adminAuth, adminFirestore };
};

export { getAdminServices };
