import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

export type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

export interface Student {
  id: string;
  name: string;
  number: string;
  status: Status;
}


export const fetchEnquiryDetails = async (enquiryType: string): Promise<Student[]> => {
  const studentsQuery = query(
    collection(db, "AdmissionEnquiry"),
    where("EnquiryType", "==", enquiryType)
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
