
import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { app } = getFirebaseServices();
import { ClassData } from './ClassList';
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
console.log("text is",text);
      try {
        // Send CSV data to the API route
        const response = await fetch('/api/uploadCsvClass', {
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


export const refreshClassList = async (
  setClasses: React.Dispatch<React.SetStateAction<ClassData[]>>
) => {
  try {
    const classesCollection = collection(db, 'classes');
    const querySnapshot = await getDocs(classesCollection);

    if (querySnapshot.empty) {
      console.warn('No classes found in the database.');
      setClasses([]);
      return;
    }

    const classesData = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (
          typeof data.ClassId === 'string' &&
          typeof data.ClassName === 'string' &&
          typeof data.ClassDivision === 'string' &&
          typeof data.ClassYear === 'string' &&

          Array.isArray(data.ClassTeacherId) &&
          Array.isArray(data.ClassSubjects) &&
          data.ClassSubjects.every((subject) =>
            typeof subject.SubjectName === 'string' &&
            typeof subject.SubjectId === 'string' &&
            typeof subject.SubjectTeacherID === 'string'
          )
        ) {
          return {
            id: doc.id,
            ...data,
          } as ClassData;
        } else {
          console.warn('Invalid class data structure:', data);
          return null; // Handle invalid data as needed
        }
      })
      .filter((classData): classData is ClassData => classData !== null);

    setClasses(classesData);
  } catch (error) {
    console.error('Error fetching classes:', error);
  }
};
