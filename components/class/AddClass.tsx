"use client";
import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebaseConfig"; // Update with your Firebase configuration path
import { addDoc, collection } from "firebase/firestore";

const AddSubject: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  // const [searchTerm, setSearchTerm] = useState<string>("");
  const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
  const [newDivision, setNewDivision] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("A");
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([
    { id: "T001", name: "John Doe" },
    { id: "T002", name: "Jane Smith" },
  ]);
  const [selectedClassteacher, setSelectedClassteacher] =
    useState<string>("T001");

  const handleAddDivision = () => {
    if (newDivision.trim() && !divisions.includes(newDivision)) {
      setDivisions([...divisions, newDivision]);
      setNewDivision(""); // Clear input after adding
    }
  };

  const handleSubmit = async () => {
    const classData = {
      className,
      classDivisions: selectedDivision,
      classTeacherId: selectedClassteacher,
    };

    console.log("Submitting Class Data: ", classData);

    try {
      await addDoc(collection(db, "classes"), classData);
      alert("Class added successfully!");
      setClassName("");
      setSelectedDivision("A");
      setSelectedClassteacher("T001");
    } catch (error) {
      console.error("Error adding class: ", error);
      setTeachers([]);
      alert("Failed to add class. Please try again.");
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
          className="block font-medium mb-2 text-gray-500"
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

      {/* Divisions Section */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Divisions</h2>

          {/* Dropdown for Divisions */}
          <div className="mb-4">
            <Label htmlFor="divisionDropdown" className="text-sm font-medium">
              Select Division
            </Label>
            <select
              id="divisionDropdown"
              value={selectedDivision}
              onChange={(e) => setSelectedDivision(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            >
              {divisions.map((division, index) => (
                <option key={index} value={division}>
                  {division}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Add Division Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default" className="bg-[#576086] text-white">
              Add Division
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Division</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="divisionName" className="text-sm font-medium">
                  Division Name
                </Label>
                <Input
                  id="divisionName"
                  value={newDivision}
                  onChange={(e) => setNewDivision(e.target.value)}
                  placeholder="Enter division name"
                  className="mt-2"
                />
              </div>
              <Button
                onClick={handleAddDivision}
                variant="default"
                className="w-full bg-[#576086] text-white hover:bg-green-700"
              >
                Add Division
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Classteacher Section */}
      <div className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Classteacher</h2>

          {/* Dropdown for Classteacher */}
          <div className="mb-4">
            <Label
              htmlFor="classteacherDropdown"
              className="text-sm font-medium"
            >
              Select Classteacher
            </Label>
            <select
              id="classteacherDropdown"
              value={selectedClassteacher}
              onChange={(e) => setSelectedClassteacher(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            >
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between space-x-4 mt-20">
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none">
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSubject;
