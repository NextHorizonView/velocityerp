// components/AttendanceMarkingPage.tsx
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface Student {
  uid: string; // Unique ID from Firestore
  name: string;
  status: "present" | "absent" | "leave";
}
interface StudentData {
  name: string;
  status: string;
}
export default function AttendanceMarkingPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Track save state
  const [selectedStatus, setSelectedStatus] = useState<"present" | "absent" | null>(null); // Track the selected status
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set()); // Track selected students

  const searchParams = useSearchParams();
  const classId = searchParams?.get("classId") ?? "";
  const date = searchParams?.get("date") ?? "";
  const year = searchParams?.get("year") ?? "";

  // Fetch attendance data from the API
  useEffect(() => {
    if (!classId || !date || !year) {
      setLoading(false);
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        const response = await fetch(
          `/api/attendance?classId=${classId}&date=${date}&year=${year}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch attendance data.");
        }
        const data = await response.json();

        let studentList: Student[] = [];

        if (data.students) {
          if (Array.isArray(data.students)) {
            studentList = data.students;
          } else {
            studentList = Object.entries(data.students).map(
              ([uid, studentData]: [string, unknown]) => ({
                uid,
                name: (studentData as StudentData).name,
                status: (studentData as StudentData).status as "present" | "absent" | "leave",
              })
            );
          }
        } else {
          alert("No attendance data found for this date.");
        }

        setStudents(studentList);
      } catch (err) {
        alert(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, [classId, date, year]);

  // Handle status change for a student
  const handleStatusChange = (
    uid: string,
    newStatus: "present" | "absent" | "leave"
  ) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.uid === uid ? { ...student, status: newStatus } : student
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-[#7ECA48]";
      case "absent":
        return "bg-[#E45847]";
      default:
        return "bg-[#939393]";
    }
  };

  // Function to Save Attendance
  const saveAttendance = async () => {
    if (!classId || !date || !year) {
      alert("Class ID or Date is missing.");
      return;
    }

    setSaving(true);
    try {
      // Convert the students array to an object keyed by uid
      const attendanceData = {
        classId,
        date,
        year,
        students: students.reduce((acc, student) => {
          acc[student.uid] = student.status;
          return acc;
        }, {} as Record<string, "present" | "absent" | "leave">),
      };

      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attendanceData),
      });

      if (!response.ok) {
        throw new Error("Failed to save attendance.");
      }

      alert("Attendance saved successfully!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert("Error saving attendance. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Select All
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedStudents(new Set(students.map((student) => student.uid)));
    } else {
      setSelectedStudents(new Set());
    }
  };

  // Handle Absent/Present buttons
  const handleSetStatus = (status: "present" | "absent") => {
    setSelectedStatus(status);
  };

  // Apply selected status to selected students
  useEffect(() => {
    if (selectedStatus !== null) {
      selectedStudents.forEach((uid) => {
        handleStatusChange(uid, selectedStatus);
      });
    }
  }, [selectedStatus, selectedStudents]);

  if (loading) {
    return <p>Loading attendance data...</p>;
  }
  

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      {/* Back Navigation */}
      <div className="flex items-center mb-6">
        <Link href="/attendance" className="flex items-center text-[#576086]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-lg text-[#576086]">Attendance</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        {/* Class Title */}
        <h2 className="text-[#0E2C75] font-semibold text-lg mb-4">
          Todays Classes/{classId}
        </h2>

        {/* Class Details Card */}
        <div className="border border-[#F7A9A0] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-y-2">
            <div>
              <span className="text-[#3E494E]">Class: </span>
              <span>{classId}</span>
            </div>
            <div>
              <span className="text-[#3E494E]">Date: </span>
              <span>{date}</span>
            </div>
          </div>
          <button className="bg-[#576086] text-white px-4 py-1.5 rounded text-sm float-right -mt-8">
            Generate Sheet
          </button>
        </div>

        {/* Search and Status Controls */}
        <div className="mb-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex justify-between items-center">
            <div className="space-x-2">
              <button
                className="px-4 py-1.5 rounded bg-red-50 text-red-500"
                onClick={() => handleSetStatus("absent")}
              >
                Absent
              </button>
              <button
                className="px-4 py-1.5 rounded bg-green-50 text-green-500"
                onClick={() => handleSetStatus("present")}
              >
                Present
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                <span className="text-sm">Leave</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                <span className="text-sm">Present</span>
              </div>
            </div>
          </div>
        </div>

        {/* Student List */}
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-[#2C2C2CCC] text-white px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span>RN</span>
              <span>Student Name</span>
            </div>
            <div className="flex items-center gap-2">
              <span>Select All</span>
              <input
                type="checkbox"
                className="rounded"
                checked={selectedStudents.size === students.length}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </div>
          </div>
          {students
            .filter((student) =>
              student.name
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
            ) // Apply search filter
            .map((student, index) => (
              <div
                key={student.uid}
                className={`px-4 py-4 flex justify-between items-center ${getStatusColor(
                  student.status
                )}`}
                onClick={() => {
                  const newSelectedStudents = new Set(selectedStudents);
                  if (newSelectedStudents.has(student.uid)) {
                    newSelectedStudents.delete(student.uid);
                  } else {
                    newSelectedStudents.add(student.uid);
                  }
                  setSelectedStudents(newSelectedStudents);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="flex items-center gap-8">
                  <span>{index + 1}</span>
                  <span>{student.name || "No Name"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      student.status === "present"
                        ? "bg-green-400"
                        : student.status === "absent"
                        ? "bg-red-400"
                        : "bg-gray-400"
                    }`}
                  ></div>
                </div>
              </div>
            ))}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-6">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded"
            onClick={saveAttendance}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
}