'use client';

import React, { useState } from "react";
import Link from "next/link";
import { IoIosCloudUpload, IoIosSearch } from "react-icons/io";
import { FaTrash, FaPen } from "react-icons/fa";
<<<<<<< Updated upstream
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // Adjust path as per your setup
import { Button } from "@/components/ui/button"; 
=======
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();
>>>>>>> Stashed changes

export type Subject = {
  id: number;
  name: string;
  classDiv: string | number;
};

const mockSubjects: Subject[] = [
  { id: 1, name: "Maths", classDiv: "VII A" },
  { id: 2, name: "Science", classDiv: "VIII B" },
  { id: 3, name: "English", classDiv: "IX C" },
  { id: 4, name: "History", classDiv: "VII B" },
  { id: 5, name: "Geography", classDiv: "VIII C" },
  { id: 6, name: "Biology", classDiv: "IX A" },
  { id: 7, name: "Physics", classDiv: "X A" },
  { id: 8, name: "Chemistry", classDiv: "X B" },
];

const ITEMS_PER_PAGE = 8;

const SubjectTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<keyof Subject | "newest">("newest");
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSort = (field: keyof Subject | "newest") => {
    setSortField(field);
    if (field !== "newest") {
      const sortedSubjects = [...subjects].sort((a, b) =>
        String(a[field]).localeCompare(String(b[field]))
      );
      setSubjects(sortedSubjects);
    } else {
      setSubjects(mockSubjects);
    }
  };

  const handleDelete = (id: number) => {
    const updatedSubjects = subjects.filter((subject) => subject.id !== id);
    setSubjects(updatedSubjects);
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSubjects.length / ITEMS_PER_PAGE);
  const currentSubjects = filteredSubjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">Subject</h1>
          <Dialog>
            <DialogTrigger asChild>
              <button className="w-10 h-10 p-0 bg-transparent border-none">
                <IoIosCloudUpload className="h-5 w-5 text-black" />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload/Download Documents</DialogTitle>
                <DialogDescription>
                  Select an option to upload or download documents.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">
                  Upload Document
                </Button>
                <Button variant="default" className="w-full">
                  Download Template
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/addsubject">
            <button className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm rounded-md">
              + Add New Subject
            </button>
          </Link>
          <div className="relative">
            <input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-10 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#576086]"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <IoIosSearch className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={sortField} 
              className="border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#576086] bg-transparent"
              onChange={(e) => handleSort(e.target.value as keyof Subject | "newest")}
            >
              <option value="newest" className="bg-transparent">
                Newest
              </option>
              <option value="classDiv" className="bg-transparent">
                Class
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 rounded-lg">
        <table className="w-full border-none text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 text-gray-500 py-2">Subject Name</th>
              <th className="px-4 text-gray-500 py-2">Class/Div</th>
              <th className="px-4 text-gray-500 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSubjects.map((subject) => (
              <tr key={subject.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{subject.name}</td>
                <td className="px-4 py-2">{subject.classDiv}</td>
                <td className="px-4 py-2 flex space-x-2">
                  <button className="p-2">
                    <FaPen className="text-black" />
                  </button>
                  <button className="p-2" onClick={() => handleDelete(subject.id)}>
                    <FaTrash className="text-black" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Section */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-600">
          Showing data {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredSubjects.length)} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)} of {filteredSubjects.length} entries
        </span>
        <div className="flex items-center space-x-2">
          <button
            className="px-3 py-1 rounded bg-gray-200 text-black hover:bg-gray-400"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1 ? "bg-[#F7B696] text-white" : "bg-gray-200 text-gray-600"
              } hover:bg-[#F7B696] hover:text-white`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          <button
            className="px-3 py-1 rounded bg-gray-200 text-black hover:bg-gray-400"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectTable;
