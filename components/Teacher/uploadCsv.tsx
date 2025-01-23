import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { app } = getFirebaseServices();
const db = getFirestore(app);

export interface TeacherData {
  id: string;
  FirstName: string;
  LastName: string;
  Email: string;
  Position: string;
  City: string;
  State: string;
  Pincode: string;
}

export const uploadTeacherCsv = async (file: File) => {
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
        const response = await fetch('/api/uploadCsvTeacher', {
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

export const refreshTeacherList = async (
  setTeachers: React.Dispatch<React.SetStateAction<TeacherData[]>>
) => {
  try {
    const teachersCollection = collection(db, 'teachers');
    const querySnapshot = await getDocs(teachersCollection);

    if (querySnapshot.empty) {
      console.warn('No teachers found in the database.');
      setTeachers([]);
      return;
    }

    const teachersData = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (
          typeof data.FirstName === 'string' &&
          typeof data.LastName === 'string' &&
          typeof data.Email === 'string' &&
          typeof data.Position === 'string' &&
          typeof data.City === 'string' &&
          typeof data.State === 'string' &&
          typeof data.Pincode === 'string'
        ) {
          return {
            id: doc.id,
            ...data,
          } as TeacherData;
        } else {
          console.warn('Invalid teacher data structure:', data);
          return null;
        }
      })
      .filter((teacherData): teacherData is TeacherData => teacherData !== null);

    setTeachers(teachersData);
  } catch (error) {
    console.error('Error fetching teachers:', error);
  }
};