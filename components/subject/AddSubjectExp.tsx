"use client";

import { db } from "@/lib/firebaseConfig";
import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import {
  collection,
  addDoc,
  updateDoc,
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

function AddSubjectExp() {
  const [subjectName, setSubjectName] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);

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
    fetchTeachers();
  }, []);

  const handleTeacherChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedName = e.target.options[e.target.selectedIndex].text;
    const selectedPosition =
      e.target.options[e.target.selectedIndex].dataset.position || "";

    if (!selectedTeachers.find((teacher) => teacher.id === selectedId)) {
      setSelectedTeachers([
        ...selectedTeachers,
        { id: selectedId, name: selectedName, position: selectedPosition },
      ]);
    }
  };

  const handleSubmit = async () => {
    const subjectData = {
      subjectName,
      assignedTeachers: selectedTeachers,
      subjectId: uuidv4(),
    };

    try {
      const subjectsRef = collection(db, "subjects");

      const q = query(subjectsRef, where("subject", "==", subjectName));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const existingTeachers =
          querySnapshot.docs[0].data().assignedTeachers || [];

        const updatedTeachers = [
          ...existingTeachers,
          ...selectedTeachers.filter(
            (newTeacher) =>
              !existingTeachers.some(
                (t: { id: string }) => t.id === newTeacher.id
              )
          ),
        ];

        await updateDoc(querySnapshot.docs[0].ref, {
          assignedTeachers: updatedTeachers,
          subjectId: querySnapshot.docs[0].data().subjectId,
        });

        alert("Subject updated successfully!");
      } else {
        await addDoc(subjectsRef, {
          ...subjectData,
        });

        alert("Subject added successfully!");
      }

      setSubjectName("");
      setSelectedTeachers([]);
    } catch (error) {
      console.error("Error handling subject: ", error);
      alert("Failed to handle subject. Please try again.");
    }
  };

  return (
    <div className="p-6 rounded-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Add Student</span>
        </button>
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Edit Student Form</span>
        </button>
      </div>

      {/* Title Section */}
      <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
        Please enter Subject Details
      </h2>

      {/* Input Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="subjectName"
          className="block font-medium mb-2 text-gray-700"
        >
          Subject Name
        </label>
        <input
          type="text"
          id="firstName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Subject Name"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>

      {/* Assign Teacher */}
      <div className="mb-6 px-6">
        <label
          htmlFor="teachers"
          className="block font-medium mb-2 text-gray-700"
        >
          Assign Teachers
        </label>
        <select
          id="teachers"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          onChange={handleTeacherChange}
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option
              key={teacher.id}
              value={teacher.id}
              data-position={teacher.position}
            >
              {teacher.name}
            </option>
          ))}
        </select>

        {/* Display Selected Teachers */}
        <ul className="mt-4 space-y-2">
          {selectedTeachers.map((teacher) => (
            <li key={teacher.id} className="text-gray-700">
              {teacher.name} - {teacher.position}
            </li>
          ))}
        </ul>
      </div>

      {/* Button Section */}
      <div className="flex justify-end">
        <button
          className="px-6 py-2 bg-[#576086] text-white rounded-md hover:bg-[#414d6b]"
          onClick={handleSubmit}
        >
          Add Subject
        </button>
      </div>
    </div>
  );
}

export default AddSubjectExp;
