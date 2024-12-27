
"use client";
import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

interface Teacher {
  id: string;
  name: string;
  position: string;
}

interface Subject {
  subjectId: string;
  subjectName: string;
  assignedTeachers: { id: string }[];
}

const AddClass: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
  const [newDivision, setNewDivision] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("A");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClassteacher, setSelectedClassteacher] =
    useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const fetchedTeachers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data()["First Name"],
          position: doc.data().Position,
        }));
        setTeachers(fetchedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const fetchedSubjects = querySnapshot.docs.map((doc) => ({
          subjectId: doc.id,
          subjectName: doc.data().subjectName,
          assignedTeachers: doc.data().assignedTeachers,
        }));
        setSubjects(fetchedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };

    fetchTeachers();
    fetchSubjects();
  }, []);

  const handleAddDivision = () => {
    if (newDivision.trim() && !divisions.includes(newDivision)) {
      setDivisions([...divisions, newDivision]);
      setNewDivision(""); 
    }
  };

  const handleSubmit = async () => {
    const classId = uuidv4(); 
    const classSubjects = subjects.map((subject) => ({
      subjectName: subject.subjectName,
      subjectId: subject.subjectId,
      subjectTeacherId: subject.assignedTeachers[0]?.id || "", 
    }));

    const classData = {
      classId,
      className,
      classDivision: selectedDivision,
      classTeacherId: selectedClassteacher,
      classSubjects,
    };

    console.log("Submitting Class Data: ", classData);

    try {
      await addDoc(collection(db, "classes"), classData);
      alert("Class added successfully!");
    } catch (error) {
      console.error("Error adding class: ", error);
      alert("Failed to add class.");
    }
  };

  return (
    <div className="p-6 rounded-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Add Class</span>
        </button>
      </div>

      {/* Title Section */}
      <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
        Please enter Class Details
      </h2>

      {/* Input Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="className"
          className="block font-medium mb-2 text-gray-700"
        >
          Class Name
        </label>
        <input
          type="text"
          id="className"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          required
        />
      </div>

      {/* Division Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="newDivision"
          className="block font-medium mb-2 text-gray-700"
        >
          Add Division
        </label>
        <input
          type="text"
          id="newDivision"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Division"
          value={newDivision}
          onChange={(e) => setNewDivision(e.target.value)}
        />
        <Button onClick={handleAddDivision} className="mt-2">
          Add Division
        </Button>
      </div>

      {/* Division Options */}
      <div className="mb-6 px-6">
        <label
          htmlFor="division"
          className="block font-medium mb-2 text-gray-700"
        >
          Select Division
        </label>
        <select
          id="division"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          value={selectedDivision}
          onChange={(e) => setSelectedDivision(e.target.value)}
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </div>

      {/* Classteacher Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="classteacher"
          className="block font-medium mb-2 text-gray-700"
        >
          Select Classteacher
        </label>
        <select
          id="classteacher"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          value={selectedClassteacher}
          onChange={(e) => setSelectedClassteacher(e.target.value)}
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>

      {/* Button Section */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="bg-[#576086] text-white">
          Add Class
        </Button>
      </div>
    </div>
  );
};

export default AddClass;
