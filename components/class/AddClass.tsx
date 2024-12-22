"use client";
import React, { useState } from "react";
import { AiOutlineClose, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
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

const AddSubject: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [teachers, setTeachers] = useState<
    { name: string; position: string }[]
  >([
    { name: "John Doe", position: "Math Teacher" },
    { name: "Jane Smith", position: "Science Teacher" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  // const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [divisions, setDivisions] = useState<string[]>(["A (Default)", "B"]);
  const [newDivision, setNewDivision] = useState<string>("");
  const [selectedDivision, setSelectedDivision] =
    useState<string>("A (Default)");

  const handleAddDivision = () => {
    if (newDivision.trim() && !divisions.includes(newDivision)) {
      setDivisions([...divisions, newDivision]);
      setNewDivision(""); // Clear input after adding
    }
  };

  const handleAddTeacher = () => {
    if (newTeacherName.trim()) {
      setTeachers([
        ...teachers,
        { name: newTeacherName, position: "New Teacher" },
      ]);
      setNewTeacherName("");
      //   setIsAddTeacherModalOpen(false);
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
          htmlFor="firstName"
          className="block font-medium mb-2 text-gray-500"
        >
          Class Name
        </label>
        <input
          type="text"
          id="firstName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Class Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
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

      {/* Subject Teachers Section */}
      <div className="mb-6 px-6 pt-11">
        <div className="flex items-center space-x-3 mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Subject Teachers
          </h3>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b]">
                Add Teacher
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Subject Teachers</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {/* Search Functionality */}
                <div>
                  <Label
                    htmlFor="searchTeacher"
                    className="text-sm font-medium"
                  >
                    Search Teacher
                  </Label>
                  <div className="relative mt-2">
                    <Input
                      id="searchTeacher"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for teachers"
                    />
                    <AiOutlineSearch className="absolute right-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Add New Teacher */}
                <div>
                  <Label htmlFor="teacherName" className="text-sm font-medium">
                    Add New Teacher
                  </Label>
                  <Input
                    id="teacherName"
                    value={newTeacherName}
                    onChange={(e) => setNewTeacherName(e.target.value)}
                    placeholder="Enter teacher name"
                    className="mt-2"
                  />
                </div>
                <Button
                  onClick={handleAddTeacher}
                  variant="default"
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  Add Teacher
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <table className="w-full text-left border-collapse">
          <thead></thead>
          <tbody>
            {teachers
              .filter((teacher) =>
                teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((teacher, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <div className="flex items-center text-gray-500">
                      <TbGridDots size={20} />
                    </div>
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <AiOutlineUser size={20} className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {teacher.name}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{teacher.position}</td>
                  <td className="p-3">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() =>
                        setTeachers(teachers.filter((_, i) => i !== index))
                      }
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Footer Section */}
      <div className="flex justify-between space-x-4 mt-20">
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none">
          Cancel
        </button>
        <button className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none">
          Next
        </button>
      </div>
    </div>
  );
};

export default AddSubject;
