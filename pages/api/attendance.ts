// /api/attendance.ts
import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseServices } from '@/lib/firebaseConfig';
const { db } = getFirebaseServices();
import { doc, getDoc, setDoc } from "firebase/firestore";

// Define attendance status type instead of const
type AttendanceStatusType = "present" | "absent" | "on leave";

// Define the request body type
interface AttendanceRequest {
  classId: string;
  date: string;
  year: string;
  Students?: Record<string, AttendanceStatusType>;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // Handle fetching attendance data
    const { classId, date, year } = req.query as { classId: string; date: string; year: string; };
    console.log("Fetching attendance for:", { classId, date });

    try {
      const attendanceRef = doc(db, `Attendance/${classId}/${year}/${date}`);
      const attendanceSnap = await getDoc(attendanceRef);
      console.log("Firestore document data:", attendanceSnap.data());

      if (attendanceSnap.exists()) {
        res.status(200).json(attendanceSnap.data());
      } else {
        res.status(404).json({ message: "No attendance data found for this date." });
      }
    } catch (error) {
      console.error("Error fetching attendance:", error); // ✅ Logs error
      res.status(500).json({ message: "Failed to fetch attendance data." });
    }
  } else if (req.method === "POST") {
    // Handle updating attendance data
    const { classId, date, year, Students } = req.body as AttendanceRequest;

    try {
      const attendanceRef = doc(db, `Attendance/${classId}/${year}/${date}`);
      await setDoc(attendanceRef, { Students }, { merge: true });

      res.status(200).json({ message: "Attendance updated successfully!" });
    } catch (error) {
      console.error("Error updating attendance:", error); // ✅ Logs error
      res.status(500).json({ message: "Failed to update attendance data." });
    }
  } else {
    res.status(405).json({ message: "Method not allowed." });
  }
}
