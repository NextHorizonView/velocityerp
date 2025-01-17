import { getFirestore, collection, getDocs} from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { app } = getFirebaseServices();
const db = getFirestore(app);

export interface SubjectFile {
  Name: string;
  Url: string;
}

export interface SubjectTeacher {
  SubjectTeacherID: string;
  SubjectTeacherName: string;
  SubjectTeacherPosition: string;
}

export interface SubjectData {
  id: string;
  SubjectId: string;
  SubjectName: string;
  SubjectFile: SubjectFile[];
  SubjectTeachersId: SubjectTeacher[];
  SubjectCreatedAt: any;
  SubjectUpdatedAt: any;
}

export const uploadSubjectCsv = async (file: File) => {
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
        const response = await fetch('/api/uploadCsvSubject', {
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

export const refreshSubjectList = async (
  setSubjects: React.Dispatch<React.SetStateAction<SubjectData[]>>
) => {
  try {
    const subjectsCollection = collection(db, 'subjects');
    const querySnapshot = await getDocs(subjectsCollection);

    if (querySnapshot.empty) {
      console.warn('No subjects found in the database.');
      setSubjects([]);
      return;
    }

    const subjectsData = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        if (
          typeof data.SubjectId === 'string' &&
          typeof data.SubjectName === 'string' &&
          Array.isArray(data.SubjectFile) &&
          Array.isArray(data.SubjectTeachersId)
        ) {
          return {
            id: doc.id,
            ...data,
          } as SubjectData;
        } else {
          console.warn('Invalid subject data structure:', data);
          return null;
        }
      })
      .filter((subjectData): subjectData is SubjectData => subjectData !== null);

    setSubjects(subjectsData);
  } catch (error) {
    console.error('Error fetching subjects:', error);
  }
};