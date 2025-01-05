import { NextApiRequest, NextApiResponse } from "next";
import { adminAuth, adminFirestore } from "@/lib/firebaseAdmin";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { uid } = req.body;

  if (!uid) {
    return res.status(400).json({ message: "No UID provided." });
  }

  try {
    // Delete the document from Firestore
    const studentRef = adminFirestore.collection("students").doc(uid);
    const studentSnap = await studentRef.get();

    if (!studentSnap.exists) {
      return res.status(404).json({ message: `Student with ID ${uid} not found.` });
    }

    await studentRef.delete();
    console.log(`Document with UID ${uid} deleted from Firestore.`);

    // Delete the user from Firebase Authentication
    await adminAuth.deleteUser(uid);
    console.log(`User with UID ${uid} deleted from Firebase Auth.`);

    res.status(200).json({ message: "Student deleted successfully." });
  } catch (error: unknown) {
    console.error("Error deleting student:", error);
    if (error instanceof Error) {
      res.status(500).json({ message: "Internal server error.", error: error.message });
    } else {
      res.status(500).json({ message: "Internal server error.", error: "An unknown error occurred" });
    }
  }
}