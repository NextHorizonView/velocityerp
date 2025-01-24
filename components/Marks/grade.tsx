"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Search, FileText, Download } from "lucide-react";

interface MarkEntry {
  subject: string;
  marks: number;
  grade: string;
}

interface Student {
  id: number;
  name: string;
  marks: MarkEntry[];
}

const GradeEntryForm = () => {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "RajvardhanSingh",
      marks: [
        { subject: "English", marks: 80, grade: "B+" },
        { subject: "English", marks: 80, grade: "B+" },
        { subject: "English", marks: 80, grade: "B+" },
        { subject: "English", marks: 80, grade: "B+" },
        { subject: "English", marks: 80, grade: "B+" },
        { subject: "English", marks: 80, grade: "B+" },
      ],
    },
    // Add more students as needed
  ]);

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const handlePrevStudent = () => {
    setCurrentStudentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNextStudent = () => {
    setCurrentStudentIndex((prev) => (prev < students.length - 1 ? prev + 1 : prev));
  };

  const currentStudent = students[currentStudentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg space-y-4">
      {/* Header */}
      <div className="flex items-center text-[#576086] mb-4">
        <ChevronLeft className="w-6 h-6" />
        <h1 className="text-xl font-medium ml-2">Marks</h1>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-lg p-4 border">
        {/* Dropdowns */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="relative">
            <select className="w-full p-3 rounded bg-[#576086] text-white appearance-none">
              <option>Select Class</option>
            </select>
            <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white" />
          </div>
          <div className="relative">
            <select className="w-full p-3 rounded bg-[#576086] text-white appearance-none">
              <option>Select Div</option>
            </select>
            <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white" />
          </div>
        </div>

        {/* Test Dropdown */}
        <div className="relative mb-4">
          <select className="w-full p-3 rounded bg-[#576086] text-white appearance-none">
            <option>Select Test</option>
          </select>
          <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-white" />
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search Student or roll no"
            className="w-full p-3 pl-10 border rounded"
          />
        </div>

        {/* Student Navigation */}
        <div className="flex items-center mb-4 border rounded">
          <button 
            onClick={handlePrevStudent}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1 text-center border-l border-r p-2">
            {currentStudent.id} {currentStudent.name}
          </div>
          <button 
            onClick={handleNextStudent}
            className="p-2 hover:bg-gray-100"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Marks Table */}
        <div className="mb-4">
          <div className="grid grid-cols-3 bg-gray-700 text-white p-3 rounded-t">
            <div>Subject</div>
            <div className="text-center">Marks</div>
            <div className="text-center">Grade</div>
          </div>
          <div className="border-x border-b rounded-b">
            {currentStudent.marks.map((entry, index) => (
              <div
                key={index}
                className="grid grid-cols-3 p-3 border-b last:border-b-0"
              >
                <div>{entry.subject}</div>
                <div className="text-center">{entry.marks}</div>
                <div className="text-center">{entry.grade}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <button className="p-2 bg-orange-200 rounded">
              <FileText className="w-5 h-5 text-orange-600" />
            </button>
            <button className="p-2 bg-orange-200 rounded">
              <Download className="w-5 h-5 text-orange-600" />
            </button>
          </div>
          <button className="px-6 py-2 bg-[#576086] text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GradeEntryForm;