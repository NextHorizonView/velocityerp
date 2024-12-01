import { collection, getDocs, query, where, addDoc, doc,updateDoc,getDoc, setDoc} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

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

export const saveStudentData = async (studentData: Record<string, string>) => {
  try {
    const { ...additionalData } = studentData;
    const studentRef = doc(db, 'students');
    await setDoc(studentRef, {
      ...additionalData, 
    });
  } catch (error) {
    console.error('Error saving student data:', error);
    throw error;
  }
};




export interface FormFieldUpdate {
  FieldName?: string; 
  FieldType?: string; 
}

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