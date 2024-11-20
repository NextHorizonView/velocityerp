import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

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
