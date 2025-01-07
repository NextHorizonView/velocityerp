import type { NextApiRequest, NextApiResponse } from 'next';
import admin from 'firebase-admin';


if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.SCHOOL1_FIREBASE_ADMIN_CREDENTIALS || '{}')), // Use credential instead of credentials
    databaseURL: process.env.SCHOOL1_FIREBASE_DATABASE_URL || '',
  });
}

const adminAuth = admin.auth();
const adminFirestore = admin.firestore();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, password, displayName, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 1: Create the user in Firebase Authentication (school1 config)
    const user = await adminAuth.createUser({
      email,
      password,
      displayName,
    });

    // Step 2: Assign custom claims (e.g., role: admin)
    await adminAuth.setCustomUserClaims(user.uid, { role });

    // Step 3: Store user data in Firestore under the specific school's collection
    await adminFirestore.collection('schools').doc(user.uid).set({
      displayName,
      email,
      role,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: 'User created successfully',
      userId: user.uid,
      email: user.email,
      role,
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Failed to create user' });
  }
}
