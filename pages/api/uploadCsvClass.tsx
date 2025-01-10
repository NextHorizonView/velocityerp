import { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'papaparse';
import { getAdminServices } from '@/lib/firebaseAdmin';

const { adminFirestore } = getAdminServices();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { csvData } = req.body;
  console.log('CSV data:', csvData);

  if (!csvData) {
    return res.status(400).json({ message: 'No CSV data provided.' });
  }

  try {
    // Parse the CSV data
    const classes = parse(csvData, { header: true }).data as Array<{
      ClassId: string;
      ClassName: string;
      ClassDivision: string;
      ClassTeacherId: string; // Comma-separated string of teacher IDs
      ClassSubjects: string; // JSON string of subjects
      [key: string]: string;
    }>;

    for (const classItem of classes) {
      if (
        !classItem.ClassId ||
        !classItem.ClassName ||
        !classItem.ClassDivision ||
        !classItem.ClassTeacherId ||
        !classItem.ClassSubjects
      ) {
        console.error(`Invalid class data: ${JSON.stringify(classItem)}`);
        continue;
      }

      // Convert `ClassTeacherId` and `ClassSubjects` to their respective data types
      const teacherIds = classItem.ClassTeacherId.split(',').map((id) => id.trim());
      let subjects: { SubjectName: string; SubjectId: string; SubjectTeacherID: string }[] | string = [];

      try {
        // Check if ClassSubjects is a valid JSON string or an object
        if (typeof classItem.ClassSubjects === 'string') {
          try {
            // Try to parse as JSON if it's a string
            subjects = JSON.parse(classItem.ClassSubjects);
          } catch (err) {
            // If it's a stringified object or invalid JSON, we keep it as a string
            if (classItem.ClassSubjects.includes('[object Object]')) {
              subjects = classItem.ClassSubjects;  // Keep it as stringified object
            } else {
              throw new Error('Invalid JSON string for ClassSubjects');
            }
          }
        } else if (typeof classItem.ClassSubjects === 'object') {
          subjects = classItem.ClassSubjects;  // Use the object directly if it's already an object
        } else {
          throw new Error('ClassSubjects is neither a valid string nor an object');
        }

        // Ensure subjects is an array and validate its structure
        if (
          Array.isArray(subjects) &&
          !subjects.every(
            (subject) =>
              typeof subject.SubjectName === 'string' &&
              typeof subject.SubjectId === 'string' &&
              typeof subject.SubjectTeacherID === 'string'
          )
        ) {
          throw new Error('Invalid ClassSubjects structure');
        }
      } catch (err) {
        console.error(`Invalid ClassSubjects for class ${classItem.ClassId}:`, err);
        continue;
      }

      // Check if the class already exists in Firestore
      const existingClass = await adminFirestore
        .collection('classes')
        .where('ClassId', '==', classItem.ClassId)
        .get();

      if (!existingClass.empty) {
        console.log(`Class with ID ${classItem.ClassId} already exists. Updating.`);
        const classDocRef = existingClass.docs[0].ref;

        // Update only ClassName and ClassDivision, leave ClassSubjects untouched
        await classDocRef.update({
          ClassName: classItem.ClassName,
          ClassDivision: classItem.ClassDivision,
          ClassTeacherId: teacherIds,
        });
        continue;
      }

      // Add new class to Firestore
      const newClassRef = adminFirestore.collection('classes').doc();
      await newClassRef.set({
        ClassId: classItem.ClassId,
        ClassName: classItem.ClassName,
        ClassDivision: classItem.ClassDivision,
        ClassTeacherId: teacherIds,
        ClassSubjects: subjects,  // Store ClassSubjects as it is
      });
      console.log(`Added new class with ID ${classItem.ClassId}`);
    }

    res.status(200).json({ message: 'Classes uploaded successfully.' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
