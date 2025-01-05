import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'papaparse';
import { getAdminServices } from '@/lib/firebaseAdmin';

const { adminAuth, adminFirestore } = getAdminServices();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { csvData } = req.body;

  if (!csvData) {
    return res.status(400).json({ message: 'No CSV data provided.' });
  }

  try {
    // Parse the CSV data
    const students = parse(csvData, { header: true }).data as Array<{
      Email: string;
      Name: string;
      [key: string]: string;
    }>;


    for (const student of students) {
      if (!student.Email || !student.Name) {
        console.error(`Invalid student data: ${JSON.stringify(student)}`);
        continue;
      }

      // Check if the student already exists in Firestore
      const existingStudent = await adminFirestore
        .collection('students')
        .where('Email', '==', student.Email)
        .get();

      if (!existingStudent.empty) {
        console.log(`Student with email ${student.Email} already exists in Firestore. Skipping.`);
        continue;
      }

      // Check if the student already exists in Firebase Authentication
      try {
        const userRecord = await adminAuth.getUserByEmail(student.Email);
        console.log(`User with email ${student.Email} already exists in Firebase Authentication. Using existing UID: ${userRecord.uid}`);

        // Add or update the student in Firestore with their existing UID
        const studentRef = adminFirestore.collection('students').doc(userRecord.uid);
        await studentRef.set({
          ...student,
          uid: userRecord.uid,
        });
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'auth/user-not-found') {
          // If the user doesn't exist in Firebase Auth, create a new user
          const user = await adminAuth.createUser({
            email: student.Email,
            password: 'password123', // Default password
            displayName: student.Name,
          });

          console.log(`Created user for ${student.Email} with UID: ${user.uid}`);
          
          // Set the custom claims for the user to mark them as a 'student'
          await adminAuth.setCustomUserClaims(user.uid, { role: 'student' });
          console.log(`Assigned 'student' role to user with UID: ${user.uid}`);

          // Add the student to Firestore with document ID = user.uid
          const studentRef = adminFirestore.collection('students').doc(user.uid);
          await studentRef.set({
            ...student,
            uid: user.uid,
            role: 'student', // Add the 'role' field as 'student'
          });
        } else {
          console.error('Error retrieving user from Firebase Auth:', error);
          continue;
        }
      }
    }

    res.status(200).json({ message: 'Students uploaded successfully.' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
