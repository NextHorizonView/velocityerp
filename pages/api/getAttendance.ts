import { NextApiRequest, NextApiResponse } from 'next';
import { getFirebaseServices } from "@/lib/firebaseConfig";
const { db } = getFirebaseServices();
import { collection, getDocs, doc } from 'firebase/firestore';

interface AttendanceRecord {
  class: string;
  subject: string;
  teacher: string;
  date: string;
}

const getAttendance = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { date, year } = req.query;

    if (!date || !year) {
      return res.status(400).json({ error: 'Missing date or year' });
    }

    // Convert incoming date from "MM/DD/YYYY" to "MM-DD-YYYY" if needed.
    const formattedDate = (date as string).replace(/\//g, '-');

    // Reference the main Attendance collection
    const attendanceRef = collection(db, 'Attendance');
    const classesSnapshot = await getDocs(attendanceRef);

    const results: AttendanceRecord[] = []; // Use the defined type instead of `any[]`

    for (const classDoc of classesSnapshot.docs) {
      const classId = classDoc.id; // e.g. "class 1"

      // Get the year sub-collection for this class
      const yearRef = collection(doc(db, 'Attendance', classId), year as string);
      // Get the document for the specific date
      const dateDocRef = doc(yearRef, formattedDate);
      // Reference the AttendanceRecords sub-collection
      const attendanceRecordsRef = collection(dateDocRef, 'AttendanceRecords');

      const recordsSnapshot = await getDocs(attendanceRecordsRef);

      recordsSnapshot.forEach((recordDoc) => {
        const recordData = recordDoc.data();
        const { subject, teacher } = recordData || 'NA';
        // Only push if subject and teacher are present.
        if (teacher) {
          results.push({
            class: classId,
            subject,
            teacher,
            date: formattedDate,
          });
        }
      });
    }

    return res.status(200).json({ attendance: results });
  } catch (error) {
    console.error('Error fetching attendance:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export default getAttendance;
