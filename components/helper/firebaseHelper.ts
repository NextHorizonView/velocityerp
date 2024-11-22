import { collection, getDocs, query, where, getFirestore, addDoc, doc,updateDoc,getDoc, setDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// Enum for field types
export enum FieldType {
  TEXT = 'Text',
  RADIO = 'Radio',
  DATE = 'Date',
  SELECT = 'Select',
}
export type FormData = {
  [key: string]: string;
};
// Interface for form fields
export interface FormField {
  FormFields?: any;
  FormFieldID?: string;
  FormFieldSchoolId?:string;       // Document ID for the form field (optional)
  FieldName: string;          // Name of the field (e.g., "First Name")
  FieldType: FieldType;      // Type of the field (e.g., Text, Date, Dropdown)
  IsRequired: boolean;       // Whether the field is required or not
  Sequence: number;          // Field's position in the form (order)
  DefaultValue?: string;     // Default value for the field (optional)
  Options?: string[];        // Options for dropdown/radio (optional)
}

// Status type for students
export type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

// Student interface
export interface Student {
  id: string;
  name: string;
  number: string;
  status: Status;
}

// Fetch enquiry details
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



// Fetch form fields based on userId from localStorage
// export const fetchFormFields = async (userId: string): Promise<FormField[]> => {
//   try {
    
//     if (!userId) {
//       throw new Error('User ID is required.');
//     }

//     // Query the 'StudentFormField' collection, filter by 'FormFieldSchoolId', and order by 'Sequence'
//     const q = query(
//       collection(db, 'StudentFormField'),
//       where('FormFieldSchoolId', '==', userId), // Filtering by FormFieldSchoolId matching the userId
//       // orderBy('Sequence', 'asc')
//     );

//     // Execute the query
//     const querySnapshot = await getDocs(q);

//     // If no documents are found, return an empty array
//     if (querySnapshot.empty) {
//       console.log("No form fields found for this user.");
//       return [];
//     }

//     // Map documents to FormField array
//     const formFields = querySnapshot.docs.map(doc => ({
//       ...doc.data(),
//       FormFieldID: doc.id,
//     })) as FormField[];

//     return formFields;
//   } catch (error) {
//     console.error('Error fetching form fields:', error);
//     throw error;
//   }
// };




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

// Function to add or update a form field in Firestore
// export const addFormField = async (userId: string, formField: FormField): Promise<string> => {
//   try {
//     // Ensure userId is provided
//     if (!userId) {
//       throw new Error('User ID is required to add a form field.');
//     }

//     // Reference the 'StudentFormField' collection
//     const formFieldsRef = collection(db, 'StudentFormField');

//     // If FormFieldID exists, update the existing document
//     if (formField.FormFieldID) {
//       const fieldDocRef = doc(formFieldsRef, formField.FormFieldID);
//       await setDoc(fieldDocRef, formField);
//       return formField.FormFieldID; // Return the existing ID
//     }

//     // If no FormFieldID exists, create a new document
//     const docRef = await addDoc(formFieldsRef, formField);
//     return docRef.id; // Return the newly created document ID
//   } catch (error) {
//     console.error(`Error adding form field for user ID ${userId}:`, error);
//     throw error; // Propagate the error for external handling
//   }
// };


//

export const addFormField = async (userId: string, formField: FormField): Promise<string> => {
  try {
    // Ensure userId is provided
    if (!userId) {
      throw new Error('User ID is required to add a form field.');
    }

    // Reference the 'StudentFormField' collection
    const formFieldsRef = collection(db, 'StudentFormField');

    // Query to find the document matching the userId
    const querySnapshot = await getDocs(
      query(formFieldsRef, where('FormFieldSchoolId', '==', userId))
    );

    // Check if a matching document exists
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref; // Get the reference of the first matching document
      const existingData = querySnapshot.docs[0].data(); // Get the existing data

      // Extract the current FormFields array or initialize a new one if missing
      const currentFields = existingData.FormFields || [];

      // Add the new field to the FormFields array
      const updatedFields = [
        ...currentFields,
        {
          DefaultValue: formField.DefaultValue || '',
          FieldName: formField.FieldName,
          FieldType: formField.FieldType,
          IsRequired: formField.IsRequired,
          Options: formField.Options || null,
          Sequence: currentFields.length + 1, // Sequence number based on current fields
        },
      ];

      // Update the document with the new FormFields array
      await setDoc(docRef, { ...existingData, FormFields: updatedFields }, { merge: true });

      return docRef.id; // Return the document ID
    } else {
      // If no matching document exists, create a new document
      const newDoc = {
        FormFieldSchoolId: userId,
        FormFields: [
          {
            DefaultValue: formField.DefaultValue || '',
            FieldName: formField.FieldName,
            FieldType: formField.FieldType,
            IsRequired: formField.IsRequired,
            Options: formField.Options || null,
            Sequence: 1, // Starts with sequence 1
          },
        ],
      };

      const newDocRef = await addDoc(formFieldsRef, newDoc);
      return newDocRef.id; // Return the newly created document ID
    }
  } catch (error) {
    console.error(`Error adding form field for user ID ${userId}:`, error);
    throw error; // Propagate the error for external handling
  }
};



export const deleteFormField = async (formFieldId: string, fieldName: string): Promise<void> => {
  try {
    // Reference to the Firestore document
    const fieldDocRef = doc(db, 'StudentFormField', formFieldId);

    // Retrieve the document data
    const docSnapshot = await getDoc(fieldDocRef);

    if (!docSnapshot.exists()) {
      throw new Error(`Document with ID ${formFieldId} does not exist`);
    }

    // Extract the current FormFields array
    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    // Filter out the fields matching the specified FieldName
    const updatedFormFields = formFields.filter((field: any) => field.FieldName !== fieldName);

    // Update the document with the modified FormFields array
    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form fields with FieldName "${fieldName}" have been deleted.`);
  } catch (error) {
    console.error('Error deleting form fields:', error);
    throw error;
  }
};



export interface FormFieldUpdate {
  FieldName?: string; // New FieldName to update
  FieldType?: string; // New FieldType to update
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

    // Extract the current FormFields array
    const data = docSnapshot.data();
    const formFields = data.FormFields || [];

    // Locate the field to update
    const updatedFormFields = formFields.map((field: any) => {
      if (field.FieldName === currentFieldName) {
        return {
          ...field,
          ...updates, // Apply updates (e.g., FieldName or FieldType)
        };
      }
      return field;
    });

    // Update the document with the modified FormFields array
    await updateDoc(fieldDocRef, { FormFields: updatedFormFields });

    console.log(`Form field "${currentFieldName}" has been updated.`);
  } catch (error) {
    console.error('Error updating form field:', error);
    throw error;
  }
};