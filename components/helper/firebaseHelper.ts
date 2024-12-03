import { collection, getDocs, query, where, addDoc, doc,updateDoc,getDoc, setDoc} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// import { getAuth, createUserWithEmailAndPassword, signOut } from "firebase/auth";
// import { adminAuth } from "@/lib/firebaseAdmin";
// import { admin } from "@/lib/firebaseAdmin"; // Ensure you have Firebase Admin initialized


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





// export const saveStudentData = async (studentData: Record<string, string>) => {
//   try {
//     const studentCollectionRef = collection(db, 'students');

//     await addDoc(studentCollectionRef, {
//       ...studentData,
//     });

//     console.log("Student data saved successfully!");
//     // console.log(studentData)
//     const emailForAuth=studentData.Email;
//     const firstName = studentData["First Name"];
//     const lastName = studentData["Last Name"];
//     const password = firstName + lastName+123;
//     console.log(emailForAuth,firstName,lastName,password)

//     // const auth = getAuth();
//     console.log("Creating Auth for:", emailForAuth, password);
//     // createAuth(emailForAuth, password);
//     // const currentUser = auth.currentUser;

//     // Create a new user in Firebase Authentication
//     // await createUserWithEmailAndPassword(auth, emailForAuth, password)
//       // .then(async (userCredential) => {
//         // console.log("User created successfully!", userCredential.user);

//         // Immediately sign out the new user to preserve the current session
//         // await signOut(auth);

//         // Re-sign-in the previous user (if applicable)
//         // if (currentUser) {
//         //   await auth.updateCurrentUser(currentUser);
//         // }
//       // })
//       // .catch((error) => {
//       //   console.error("Error creating user:", error);
//       // });


//   } catch (error) {
//     console.error("Error saving student data:", error);
//     throw error;
//   }
// };


export const saveStudentData = async (studentData: Record<string, string>) => {
  try {
    const studentCollectionRef = collection(db, "students");

    // Add student data to Firestore
    await addDoc(studentCollectionRef, {
      ...studentData,
    });

    console.log("Student data saved successfully!");

    const emailForAuth = studentData.Email;
    const firstName = studentData["First Name"];
    const lastName = studentData["Last Name"];
    const password = firstName + lastName + "123";

    const data = { emailForAuth, password };
  
  
    const response = await fetch("/api/createStudent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // Success message
    } else {
      alert(result.error); // Error message
    }
  } catch (error) {
    console.error("Error saving student data:", error);
    alert("Error saving student data.");
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