import { collection, getDocs, query, where, addDoc, doc,updateDoc,getDoc, setDoc} from "firebase/firestore";
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();

export enum FieldType {
  TEXT = 'Text',
  RADIO = 'Radio',
  DATE = 'Date',
  SELECT = 'Select',
}
export type FormData = {
  [key: string]: string;
};
export interface FormField {
  FormFields?: Array<FormField>;
  FormFieldID?: string;
  FormFieldSchoolId?:string;       
  FieldName: string;          
  FieldType: FieldType;      
  IsRequired: boolean;       
  Sequence: number;          
  DefaultValue?: string;     
  Options?: string[]; 
  CanChange?: true;       
}
export interface FormFieldUpdate {
  FieldName?: string; 
  FieldType?: string; 
}

export type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

export interface Student {
  id: string;
  name: string;
  number: string;
  status: Status;
}

export const fetchEnquiryDetails = async (enquiryType: string, userId: string): Promise<Student[]> => {
  if (!userId) {
    throw new Error("User ID is required to fetch enquiry details.");
  }

  const studentsQuery = query(
    collection(db, "AdmissionEnquiry"),
    where("EnquiryType", "==", enquiryType),
    where("EnquirySchoolId", "==", userId)
  );

  const querySnapshot = await getDocs(studentsQuery);

  return querySnapshot.docs.map((doc) => {
    const enquiry = doc.data();

    return {
      id: doc.id,
      name: `${enquiry.EnquiryFirstName} ${enquiry.EnquiryLastName}`,
      number: enquiry.EnquiryPhoneNumber,
      status: enquiry.EnquiryStatus as Status,
    };
  });
};


export const fetchStudentDataById = async (studentId: string) => {
  try {
    // Reference to the student document in the Firestore "students" collection
    const studentDocRef = doc(db, "students", studentId);  // Adjust collection name if needed
    const teacherDocSnap = await getDoc(studentDocRef);

    if (teacherDocSnap.exists()) {
      // Return student data as a plain object
      return teacherDocSnap.data();
    } else {
      throw new Error("Student not found");
    }
  } catch (error) {
    console.error("Error fetching student data:", error);
    throw new Error("Failed to fetch student data");
  }
};

export const fetchTeacherDataById = async (teacherId: string) => {
  try {
    const teacherDocRef = doc(db, "teachers", teacherId);  // Adjust collection name if needed
    const teacherDocSnap = await getDoc(teacherDocRef);

    if (teacherDocSnap.exists()) {
      // Return student data as a plain object
      return teacherDocSnap.data();
    } else {
      throw new Error("teacher not found");
    }
  } catch (error) {
    console.error("Error fetching teacher data:", error);
    throw new Error("Failed to fetch teacher data");
  }
};

export const fetchSubjectDataById = async (subjectId: string) => {
  try {
    const subjectDocRef = doc(db, "subjects", subjectId);  // Adjust collection name if needed
    const subjectDocSnap = await getDoc(subjectDocRef);

    if (subjectDocSnap.exists()) {
      // Return student data as a plain object
      return subjectDocSnap.data();
    } else {
      throw new Error("subject not found");
    }
  } catch (error) {
    console.error("Error fetching subject data:", error);
    throw new Error("Failed to fetch subject data");
  }
}



export const fetchClassDataById = async (ClassId: string) => {
  try {
    console.log("Fetching data for ClassId:", ClassId);

    const classDocRef = doc(db, "classes", ClassId);  // Adjust collection name if needed
    const classDocSnap = await getDoc(classDocRef);

    if (classDocSnap.exists()) {
      // Return class data as a plain object
      return classDocSnap.data();
    } else {
      throw new Error("Class not found");
    }
  } catch (error) {
    console.error("Error fetching class data:", error);
    throw new Error("Failed to fetch class data");
  }
};

export const fetchFormFields = async (userId: string): Promise<FormField[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const q = query(
      collection(db, 'StudentFormField'),
      where('FormFieldSchoolId', '==', userId),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No form fields found for this user.');
      return [];
    }

    const formFields = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      FormFieldID: doc.id,
    })) as FormField[];

    return formFields;
  } catch (error) {
    console.error('Error fetching form fields:', error);
    throw error;
  }
};

export const fetchFormFieldsTeacher = async (userId: string): Promise<FormField[]> => {
  try {
    if (!userId) {
      throw new Error('User ID is required.');
    }

    const q = query(
      collection(db, 'TeacherFormField'),
      where('FormFieldSchoolId', '==', userId),
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log('No form fields found for this user.');
      return [];
    }

    const formFields = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      FormFieldID: doc.id,
    })) as FormField[];

    return formFields;
  } catch (error) {
    console.error('Error fetching form fields:', error);
    throw error;
  }
};


export const addFormField = async (userId: string, formField: FormField): Promise<string> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to add a form field.');
    }

    const formFieldsRef = collection(db, 'StudentFormField');

    const querySnapshot = await getDocs(
      query(formFieldsRef, where('FormFieldSchoolId', '==', userId))
    );

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matching document
      const existingData = querySnapshot.docs[0].data(); // Get the existing data

      const currentFields = existingData.FormFields || [];

      const updatedFields = [
        ...currentFields,
        {
          DefaultValue: formField.DefaultValue || '',
          FieldName: formField.FieldName,
          FieldType: formField.FieldType,
          IsRequired: formField.IsRequired,
          Options: formField.Options || null,
          Sequence: currentFields.length + 1, 
        },
      ];

      await setDoc(docRef, { ...existingData, FormFields: updatedFields }, { merge: true });

      return docRef.id; 
    } else {
      const newDoc = {
        FormFieldSchoolId: userId,
        FormFields: [
          {
            DefaultValue: formField.DefaultValue || '',
            FieldName: formField.FieldName,
            FieldType: formField.FieldType,
            IsRequired: formField.IsRequired,
            CanChange: true,
            Options: formField.Options || null,
            Sequence: 1, 
          },
        ],
      };

      const newDocRef = await addDoc(formFieldsRef, newDoc);
      return newDocRef.id; 
    }
  } catch (error) {
    console.error(`Error adding form field for user ID ${userId}:`, error);
    throw error; 
  }
};

export const addFormFieldTeacher = async (userId: string, formField: FormField): Promise<string> => {
  try {
    if (!userId) {
      throw new Error('User ID is required to add a form field.');
    }

    const formFieldsRef = collection(db, 'TeacherFormField');

    const querySnapshot = await getDocs(
      query(formFieldsRef, where('FormFieldSchoolId', '==', userId))
    );

    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matching document
      const existingData = querySnapshot.docs[0].data(); // Get the existing data

      const currentFields = existingData.FormFields || [];

      const updatedFields = [
        ...currentFields,
        {
          DefaultValue: formField.DefaultValue || '',
          FieldName: formField.FieldName,
          FieldType: formField.FieldType,
          IsRequired: formField.IsRequired,
          Options: formField.Options || null,
          Sequence: currentFields.length + 1, 
        },
      ];

      await setDoc(docRef, { ...existingData, FormFields: updatedFields }, { merge: true });

      return docRef.id; 
    } else {
      const newDoc = {
        FormFieldSchoolId: userId,
        FormFields: [
          {
            DefaultValue: formField.DefaultValue || '',
            FieldName: formField.FieldName,
            FieldType: formField.FieldType,
            IsRequired: formField.IsRequired,
            CanChange: true,
            Options: formField.Options || null,
            Sequence: 1, 
          },
        ],
      };

      const newDocRef = await addDoc(formFieldsRef, newDoc);
      return newDocRef.id; 
    }
  } catch (error) {
    console.error(`Error adding form field for user ID ${userId}:`, error);
    throw error; 
  }
};



export const deleteFormField = async (formFieldId: string, fieldName: string): Promise<void> => {
  try {
    const fieldDocRef = doc(db, 'StudentFormField', formFieldId);

    const docSnapshot = await getDoc(fieldDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${formFieldId} does not exist`);
    }

    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    const updatedFormFields = formFields.filter((field: FormField) => field.FieldName !== fieldName);

    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form fields with FieldName "${fieldName}" have been deleted.`);
  } catch (error) {
    console.error('Error deleting form fields:', error);
    throw error;
  }
};

export const deleteFormFieldTeacher = async (formFieldId: string, fieldName: string): Promise<void> => {
  try {
    const fieldDocRef = doc(db, 'TeacherFormField', formFieldId);

    const docSnapshot = await getDoc(fieldDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${formFieldId} does not exist`);
    }

    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    const updatedFormFields = formFields.filter((field: FormField) => field.FieldName !== fieldName);

    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form fields with FieldName "${fieldName}" have been deleted.`);
  } catch (error) {
    console.error('Error deleting form fields:', error);
    throw error;
  }
};


export const saveStudentData = async (studentData: Record<string, string>, role: string) => {
  try {
    const emailForAuth = studentData.Email;
    const password = '12345678';
    const data = { 
      email: emailForAuth, 
      password, 
      role 
    };

    // First create the auth user to get the UID
    const response = await fetch("/api/createStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    // Get the UID from the API response
    const uid = result.uid;

    // Use setDoc instead of addDoc to specify the document ID
    const studentDocRef = doc(db, "students", uid);
    await setDoc(studentDocRef, {
      ...studentData,
      uid: uid, // Optionally store the UID in the document data as well
      role: role
    });

    console.log("Student data saved successfully!");
    alert(result.message);

  } catch (error) {
    console.error("Error saving student data:", error);
    alert("Error saving student data.");
    throw error;
  }
};

export const saveTeacherData = async (teacherData: Record<string, string>) => {
  try {
    const teacherCollectionRef = collection(db, "teachers");

    await addDoc(teacherCollectionRef, {
      ...teacherData,
    });

    console.log("teacher data saved successfully!");

  
  alert("Teacher data saved successfully!");
  } catch (error) {
    console.error("Error saving teacher data:", error);
    alert("Error saving teacher data.");
    throw error;
  }
};





export const updateFormField = async (
  formFieldId: string,
  currentFieldName: string,
  updates: FormFieldUpdate
): Promise<void> => {
  try {
    // Reference to the Firestore document
    const fieldDocRef = doc(db, 'StudentFormField', formFieldId);

    // Retrieve the document data
    const docSnapshot = await getDoc(fieldDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${formFieldId} does not exist`);
    }

    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    const updatedFormFields = formFields.map((field: FormField) => {
      if (field.FieldName === currentFieldName) {
        return {
          ...field,
          ...updates, // Apply updates (e.g., FieldName or FieldType)
        };
      }
      return field;
    });

    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form field "${currentFieldName}" has been updated.`);
  } catch (error) {
    console.error('Error updating form field:', error);
    throw error;
  }
};

export const updateFormFieldTeacher = async (
  formFieldId: string,
  currentFieldName: string,
  updates: FormFieldUpdate
): Promise<void> => {
  try {
    // Reference to the Firestore document
    const fieldDocRef = doc(db, 'TeacherFormField', formFieldId);

    // Retrieve the document data
    const docSnapshot = await getDoc(fieldDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${formFieldId} does not exist`);
    }

    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    const updatedFormFields = formFields.map((field: FormField) => {
      if (field.FieldName === currentFieldName) {
        return {
          ...field,
          ...updates, // Apply updates (e.g., FieldName or FieldType)
        };
      }
      return field;
    });

    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form field "${currentFieldName}" has been updated.`);
  } catch (error) {
    console.error('Error updating form field:', error);
    throw error;
  }
};