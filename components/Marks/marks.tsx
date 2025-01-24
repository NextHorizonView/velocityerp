"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";

interface MarkEntry {
  subject: string;
  totalMarks: number;
  marksObtained: number;
}

interface Student {
  id: number;
  name: string;
  marks: MarkEntry[];
}

const MarksEntryForm = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Rajvardhan Singh",
      marks: [
        { subject: "Hindi", totalMarks: 100, marksObtained: 86 },
        { subject: "Math", totalMarks: 100, marksObtained: 92 },
        { subject: "Science", totalMarks: 100, marksObtained: 88 },
        { subject: "English", totalMarks: 100, marksObtained: 90 },
        { subject: "Social Studies", totalMarks: 100, marksObtained: 85 },
      ],
    },
    {
      id: 2,
      name: "Aarav Mehta",
      marks: [
        { subject: "Hindi", totalMarks: 100, marksObtained: 75 },
        { subject: "Math", totalMarks: 100, marksObtained: 80 },
        { subject: "Science", totalMarks: 100, marksObtained: 78 },
        { subject: "English", totalMarks: 100, marksObtained: 85 },
        { subject: "Social Studies", totalMarks: 100, marksObtained: 88 },
      ],
    },
    {
      id: 3,
      name: "Meera Sharma",
      marks: [
        { subject: "Hindi", totalMarks: 100, marksObtained: 95 },
        { subject: "Math", totalMarks: 100, marksObtained: 89 },
        { subject: "Science", totalMarks: 100, marksObtained: 92 },
        { subject: "English", totalMarks: 100, marksObtained: 88 },
        { subject: "Social Studies", totalMarks: 100, marksObtained: 90 },
      ],
    },
  ]);

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const handlePrevStudent = () => {
    setCurrentStudentIndex((prev) => (prev > 0 ? prev - 1 : students.length - 1));
  };

  const handleNextStudent = () => {
    setCurrentStudentIndex((prev) => (prev < students.length - 1 ? prev + 1 : 0));
  };

  const currentStudent = students[currentStudentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-2">
        <ChevronLeft className="w-6 h-6 text-gray-600" />
        <h1 className="text-2xl font-semibold text-gray-700">Marks</h1>
      </div>

      {/* Dropdowns */}
      <div className="grid grid-cols-2 gap-4">
        <select className="p-3 border rounded bg-[#576086] text-white">
          <option>Select Class</option>
        </select>
        <select className="p-3 border rounded bg-[#576086] text-white">
          <option>Select Div</option>
        </select>
      </div>
      {/* Test Dropdown */}
      <select className="w-full p-3 border rounded bg-[#576086] text-white">
        <option>Select Test</option>
      </select>

      <div className="relative">
        <input
          type="text"
          placeholder="Search student or roll no"
          className="w-full p-2 border rounded pl-10"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
      </div>

      {/* Student Navigation */}
      <div className="flex items-center justify-between bg-gray-100 p-3 border rounded">
        <ChevronLeft
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={handlePrevStudent}
        />
        <div className="font-medium">{currentStudent.id} {currentStudent.name}</div>
        <ChevronRight
          className="w-6 h-6 text-gray-600 cursor-pointer"
          onClick={handleNextStudent}
        />
      </div>

      {/* Table Header */}
      <div className="border rounded overflow-hidden">
        <div className="grid grid-cols-3 bg-[#2C2C2CCC] text-white text-center font-medium py-2">
          <div>Subject</div>
          <div>Total Marks</div>
          <div>Marks Obtained</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-1 p-2">
          {currentStudent.marks.map((entry, index) => (
            <div
              key={index}
              className="grid grid-cols-3 items-center gap-2 border-b last:border-b-0 pb-2"
            >
              <div>{entry.subject}</div>
              <div className="text-center">{entry.totalMarks}</div>
              <input
                type="number"
                value={entry.marksObtained}
                onChange={(e) => {
                  const newStudents = [...students];
                  newStudents[currentStudentIndex].marks[index].marksObtained = parseInt(
                    e.target.value
                  );
                  setStudents(newStudents);
                }}
                className="w-full p-2 border rounded text-center"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center">
        <button className="p-2 bg-[#576086] text-white rounded-lg w-10 h-10 flex items-center justify-center text-lg font-bold">
          +
        </button>
        <button className="px-6 py-3 bg-[#576086] text-white rounded-lg font-medium">
          Confirm
        </button>
      </div>


    </div>
  );
};

export default MarksEntryForm;