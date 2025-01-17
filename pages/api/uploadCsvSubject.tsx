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
    const subjects = parse(csvData, { header: true }).data as Array<{
      SubjectId: string;
      SubjectName: string;
      SubjectFile: string; // JSON string of files
      SubjectTeachersId: string; // JSON string of teachers
      [key: string]: string;
    }>;

    for (const subject of subjects) {
      if (!subject.SubjectId || !subject.SubjectName) {
        continue;
      }

      let subjectFiles: { Name: string; Url: string }[] = [];
      let subjectTeachers: { 
        SubjectTeacherID: string; 
        SubjectTeacherName: string;
        SubjectTeacherPosition: string;
      }[] = [];

      try {
        if (subject.SubjectFile) {
          subjectFiles = JSON.parse(subject.SubjectFile);
        }
        if (subject.SubjectTeachersId) {
          subjectTeachers = JSON.parse(subject.SubjectTeachersId);
        }
      } catch (err) {
        console.error(`Invalid JSON data for subject ${subject.SubjectId}:`, err);
        continue;
      }

      const existingSubject = await adminFirestore
        .collection('subjects')
        .where('SubjectId', '==', subject.SubjectId)
        .get();

      if (!existingSubject.empty) {
        console.log(`Subject with ID ${subject.SubjectId} already exists. Updating.`);
        const subjectDocRef = existingSubject.docs[0].ref;

        await subjectDocRef.update({
          SubjectName: subject.SubjectName,
          SubjectFile: subjectFiles,
          SubjectTeachersId: subjectTeachers,
          SubjectUpdatedAt: Timestamp.now(),
        });
        continue;
      }

      const newSubjectRef = adminFirestore.collection('subjects').doc();
      await newSubjectRef.set({
        SubjectId: subject.SubjectId,
        SubjectName: subject.SubjectName,
        SubjectFile: subjectFiles,
        SubjectTeachersId: subjectTeachers,
        SubjectCreatedAt: Timestamp.now(),
        SubjectUpdatedAt: Timestamp.now(),
      });
      console.log(`Added new subject with ID ${subject.SubjectId}`);
    }

    res.status(200).json({ message: 'Subjects uploaded successfully.' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}