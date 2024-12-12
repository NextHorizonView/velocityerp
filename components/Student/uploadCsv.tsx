// uploadCsv.ts
import { parse } from 'papaparse';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { app } from '@/lib/firebaseConfig'; 
import { Student } from './Students';
const db = getFirestore(app);

export const uploadCsv = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        reject(new Error('Failed to read CSV file.'));
        return;
      }

      parse(text, {
        header: true,
        complete: (results) => {
          const students = results.data as Array<{ Email: string; [key: string]: string }>;

          students.forEach(async (student) => {
            try {
              const querySnapshot = await getDocs(collection(db, 'students'));
              const existingStudent = querySnapshot.docs.find((doc) => doc.data().Email === student.Email);

              if (existingStudent) {
                console.log(`Student with Email ${student.Email} already exists. Skipping...`);
                return;
              }

              await addDoc(collection(db, 'students'), student);
            } catch (error) {
              console.error('Error adding document: ', error);
            }
          });

          resolve();
        },
        error: (error: Error) => {
          reject(error);
        },
      });
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const refreshStudentList = async (setStudents: React.Dispatch<React.SetStateAction<Student[]>>) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'students'));
    const studentsData = querySnapshot.docs.map((doc) => ({
      studentId: doc.id,
      ...doc.data(),
    } as Student));
    setStudents(studentsData);
    // Reset pagination and search
    // setCurrentPage(1);
    // setSearchTerm("");
  } catch (error) {
    console.error('Error fetching students: ', error);
  }
};