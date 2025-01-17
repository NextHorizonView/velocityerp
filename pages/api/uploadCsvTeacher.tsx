import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'papaparse';
import { getAdminServices } from '@/lib/firebaseAdmin';
import { Timestamp } from 'firebase-admin/firestore';

const { adminFirestore } = getAdminServices();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { csvData } = req.body;
  
  if (!csvData) {
    return res.status(400).json({ message: 'No CSV data provided.' });
  }

  try {
    const teachers = parse(csvData, { header: true }).data as Array<{
      FirstName: string;
      LastName: string;
      Email: string;
      Position: string;
      City: string;
      State: string;
      Pincode: string;
      [key: string]: string;
    }>;

    for (const teacher of teachers) {
      if (
        !teacher.FirstName ||
        !teacher.LastName ||
        !teacher.Email ||
        !teacher.Position ||
        !teacher.City ||
        !teacher.State ||
        !teacher.Pincode
      ) {
        continue;
      }

      const existingTeacher = await adminFirestore
        .collection('teachers')
        .where('Email', '==', teacher.Email)
        .get();

      if (!existingTeacher.empty) {
        console.log(`Teacher with email ${teacher.Email} already exists. Updating.`);
        const teacherDocRef = existingTeacher.docs[0].ref;

        await teacherDocRef.update({
          FirstName: teacher.FirstName,
          LastName: teacher.LastName,
          Position: teacher.Position,
          City: teacher.City,
          State: teacher.State,
          Pincode: teacher.Pincode,
          TeacherUpdatedAt: Timestamp.now(),
        });
        continue;
      }

      const newTeacherRef = adminFirestore.collection('teachers').doc();
      await newTeacherRef.set({
        FirstName: teacher.FirstName,
        LastName: teacher.LastName,
        Email: teacher.Email,
        Position: teacher.Position,
        City: teacher.City,
        State: teacher.State,
        Pincode: teacher.Pincode,
        TeacherCreatedAt: Timestamp.now(),
        TeacherUpdatedAt: Timestamp.now(),
      });
      console.log(`Added new teacher with email ${teacher.Email}`);
    }

    res.status(200).json({ message: 'Teachers uploaded successfully.' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}