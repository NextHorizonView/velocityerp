import { NextApiRequest, NextApiResponse } from "next";
import { getAdminServices } from "@/lib/firebaseAdmin";
const { adminAuth, adminFirestore } = getAdminServices();

// Define the structure of the form data
interface TeacherFormData {
  Email: string;
  "First Name": string;
  "Last Name": string;
  Pincode?: string;
  Address?: string;
  Phone?: string;
  [key: string]: string | undefined; // Allow additional dynamic fields
}

// Define the structure of the request body
interface CreateTeacherRequestBody {
  formData: TeacherFormData;
}

// Define a type for Firebase errors
interface FirebaseError extends Error {
  code: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { formData } = req.body as CreateTeacherRequestBody;

    try {
      // Check if the teacher already exists in Firestore
      const existingTeacher = await adminFirestore
        .collection("teachers")
        .where("Email", "==", formData.Email)
        .get();

      if (!existingTeacher.empty) {
        return res.status(400).json({ message: "Teacher already exists." });
      }

      // Check if the teacher already exists in Firebase Authentication
      try {
        const userRecord = await adminAuth.getUserByEmail(formData.Email);
        console.log(
          `User with email ${formData.Email} already exists. Using existing UID: ${userRecord.uid}`
        );

        // Add or update the teacher in Firestore with their existing UID
        const teacherRef = adminFirestore.collection("teachers").doc(userRecord.uid);
        await teacherRef.set({
          ...formData,
          uid: userRecord.uid,
        });

        return res.status(200).json({ message: "Teacher data saved successfully!" });
      } catch (error: unknown) {
        // Use type assertion to handle Firebase errors
        if (error instanceof Error && "code" in error) {
          const firebaseError = error as FirebaseError;

          if (firebaseError.code === "auth/user-not-found") {
            // If the user doesn't exist in Firebase Auth, create a new user
            const user = await adminAuth.createUser({
              email: formData.Email,
              password: "12345678", // Default password
              displayName: `${formData["First Name"]} ${formData["Last Name"]}`,
            });

            console.log(`Created user for ${formData.Email} with UID: ${user.uid}`);

            // Set the custom claims for the user to mark them as a 'teacher'
            await adminAuth.setCustomUserClaims(user.uid, { role: "teacher" });
            console.log(`Assigned 'teacher' role to user with UID: ${user.uid}`);

            // Add the teacher to Firestore with document ID = user.uid
            const teacherRef = adminFirestore.collection("teachers").doc(user.uid);
            await teacherRef.set({
              ...formData,
              uid: user.uid,
              role: "teacher", // Add the 'role' field as 'teacher'
            });

            return res.status(200).json({ message: "Teacher data saved successfully!" });
          } else {
            console.error("Error retrieving user from Firebase Auth:", firebaseError);
            return res.status(500).json({ message: "Internal server error." });
          }
        } else {
          console.error("Unknown error:", error);
          return res.status(500).json({ message: "Internal server error." });
        }
      }
    } catch (error) {
      console.error("Error saving teacher data:", error);
      return res.status(500).json({ message: "Internal server error." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}