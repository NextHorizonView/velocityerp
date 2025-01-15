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
      ClassTeacherId:  string; 
      ClassSubjects: string; // JSON string of subjects
      [key: string]: string;
    }>;
    console.log('Parsed classes:', classes);

    for (const classItem of classes) {
      if (
        !classItem.ClassId ||
        !classItem.ClassName ||
        !classItem.ClassDivision ||
        // !classItem.ClassTeacherId ||
        !classItem.ClassSubjects
      ) {
        // console.error(`Invalid class data: ${JSON.stringify(classItem)}`);
        continue;
      }

      // Convert `ClassTeacherId` and `ClassSubjects` to their respective data types
      const teacherIds = classItem.ClassTeacherId.split(',').map((id) => id.trim());
      let subjects: { SubjectName: string; SubjectId: string; SubjectTeacherID: string }[] | string = [];

      try {
        if (typeof classItem.ClassSubjects === 'string') {
          try {
            subjects = JSON.parse(classItem.ClassSubjects);
          } catch (err) {
            console.log(err);
            
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
      // const timestamp = new Date();

      const existingClass = await adminFirestore
        .collection('classes')
        .where('ClassId', '==', classItem.ClassId)
        .get();

      if (!existingClass.empty) {
        console.log(`Class with ID ${classItem.ClassId} already exists. Updating.`);
        const classDocRef = existingClass.docs[0].ref;

        await classDocRef.update({
          ClassName: classItem.ClassName,
          ClassDivision: classItem.ClassDivision,
          ClassTeacherId: teacherIds,
          ClassUpdatedAt: Timestamp.now(),


        });
        continue;
      }

      const newClassRef = adminFirestore.collection('classes').doc();
      await newClassRef.set({
        ClassId: classItem.ClassId,
        ClassName: classItem.ClassName,
        ClassDivision: classItem.ClassDivision,
        ClassTeacherId: teacherIds,
        ClassSubjects: subjects,  
  ClassCreatedAt: Timestamp.now(),
        ClassUpdatedAt: Timestamp.now(),
      });
      console.log(`Added new class with ID ${classItem.ClassId}`);
    }

    res.status(200).json({ message: 'Classes uploaded successfully.' });
  } catch (error) {
    console.error('Error processing CSV:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
