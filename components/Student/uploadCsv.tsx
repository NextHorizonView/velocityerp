
import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { Student } from './Students';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { app } = getFirebaseServices();

const db = getFirestore(app);

export const uploadCsv = async (file: File) => {
  return new Promise<void>((resolve, reject) => {
    if (!file) {
      reject(new Error('No file provided.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text !== 'string') {
        reject(new Error('Failed to read CSV file.'));
        return;
      }

      try {
        // Send CSV data to the API route
        const response = await fetch('/api/uploadCsv', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ csvData: text }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('API Error:', error.message);
          reject(new Error(error.message || 'Failed to upload CSV.'));
          return;
        }

        resolve();
      } catch (error) {
        console.error('Network Error:', error);
        reject(error);
      }
    };

    reader.onerror = (error) => {
      console.error('File Reader Error:', error);
      reject(error);
    };

    reader.readAsText(file);
  });
};

export const refreshStudentList = async (setStudents: React.Dispatch<React.SetStateAction<Student[]>>) => {
  try {
    const studentsCollection = collection(db, 'students');
    const querySnapshot = await getDocs(studentsCollection);

    if (querySnapshot.empty) {
      console.warn('No students found in the database.');
      setStudents([]);
      return;
    }

    const studentsData = querySnapshot.docs.map((doc) => ({
      studentId: doc.id,
      ...doc.data(),
    } as Student));

    setStudents(studentsData);
  } catch (error) {
    console.error('Error fetching students:', error);
  }
};
