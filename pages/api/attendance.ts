import { NextApiRequest, NextApiResponse } from "next";
import { getFirebaseServices } from "@/lib/firebaseConfig";
const { db } = getFirebaseServices();
import {
  collection,
  doc,
  getDocs,
  setDoc,
  serverTimestamp,
  query,
  where,
  DocumentData,
} from "firebase/firestore";

type AttendanceStatusType = "present" | "absent" | "leave";

interface AttendanceRequest {
  classId: string;
  date: string;
  year: string;
  students?: Record<string, AttendanceStatusType>;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { classId, date, year } = req.query as { classId: string; date: string; year: string };
    console.log("Fetching attendance for:", { classId, date });

    try {
      // Attempt to fetch existing attendance records
      const attendanceRecordsRef = collection(db, `Attendance/${classId}/${year}/${date}/AttendanceRecords`);
      const attendanceRecordsSnap = await getDocs(attendanceRecordsRef);

      if (!attendanceRecordsSnap.empty) {
        // Find the latest record based on the timestamp
        const latestRecord = attendanceRecordsSnap.docs.reduce((latest, doc) => {
          const record = doc.data();
          return !latest || (record.timestamp && record.timestamp > latest.timestamp)
            ? record
            : latest;
        }, null as DocumentData | null);

        if (latestRecord) {
          return res.status(200).json(latestRecord);
        } else {
          return res.status(404).json({ message: "No valid attendance records found." });
        }
      }

      // If no attendance record exists, fetch all students for the class
      console.log(`Fetching students for class: ${classId}`);
      const studentsRef = collection(db, "students");
      const formattedClassId = classId.trim().toLowerCase();

      const q = query(
        studentsRef,
        where("class", ">=", formattedClassId),
        where("class", "<=", formattedClassId + "\uf8ff")
      );
      const studentsSnap = await getDocs(q);

      if (!studentsSnap.empty) {
        const students = studentsSnap.docs.map(doc => ({
          uid: doc.id,
          name: doc.data().name,
          status: "leave" as AttendanceStatusType,
        }));

        return res.status(200).json({ students });
      } else {
        console.warn(`No students found for class: ${classId}. Listing all available students.`);
        const allStudentsSnap = await getDocs(studentsRef);
        const allStudents = allStudentsSnap.docs.map(doc => ({
          uid: doc.id,
          name: doc.data().name,
          class: doc.data().class,
        }));
        console.log("All students in Firestore:", allStudents);
        return res.status(404).json({ message: "No students found for this class.", allStudents });
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      return res.status(500).json({ message: "Failed to fetch attendance data." });
    }
  }
  else if (req.method === "POST") {
    const { classId, date, year, students } = req.body as AttendanceRequest & {
      students: Record<string, AttendanceStatusType>;
    };
  
    if (!students) {
      return res.status(400).json({ message: "Students data is required." });
    }
  
    try {
      // Reference to the attendance records collection for this class/date/year
      const attendanceRecordsRef = collection(db, `Attendance/${classId}/${year}/${date}/AttendanceRecords`);
      const recordId = `record_${new Date().toISOString().replace(/[:.]/g, "-")}`;
      const recordRef = doc(attendanceRecordsRef, recordId);
  
      // Fetch all students from Firestore to get their names
      const studentsRef = collection(db, "students");
      const studentsData = await getDocs(studentsRef);
      const studentNamesMap = studentsData.docs.reduce((acc, doc) => {
        const studentData = doc.data();
        acc[doc.id] = studentData.name;
        return acc;
      }, {} as Record<string, string>);
  
      // Prepare the formatted students object
      let formattedStudents: Record<string, { name: string; status: AttendanceStatusType }> = {};
  
      if (Array.isArray(students)) {
        // If students is an array, loop over each student object.
        formattedStudents = students.reduce((acc: Record<string, { name: string; status: AttendanceStatusType }>, student) => {
          const uid = student.uid;
          const status = student.status;
          // Prefer the name from Firestore; if not available, use the name from the student object.
          const name = studentNamesMap[uid] || student.name || "Unknown";
          if (uid) {
            acc[uid] = { name, status };
          }
          return acc;
        }, {} as Record<string, { name: string; status: AttendanceStatusType }>);
      } else {
        // If students is already an object keyed by uid
        formattedStudents = Object.entries(students).reduce((acc, [uid, status]) => {
          const name = studentNamesMap[uid] || "Unknown";
          acc[uid] = { name, status: status as AttendanceStatusType };
          return acc;
        }, {} as Record<string, { name: string; status: AttendanceStatusType }>);
      }
  
      // Save the attendance record with the properly structured students map
      await setDoc(recordRef, {
        students: formattedStudents,
        timestamp: serverTimestamp(),
      });
  
      return res.status(200).json({ message: "Attendance records updated successfully!", recordId });
    } catch (error) {
      console.error("Error updating attendance records:", error);
      return res.status(500).json({ message: "Failed to update attendance records." });
    }
  }
}
