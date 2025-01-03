"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosCloudUpload, IoIosSearch } from "react-icons/io";
import { FaTrash, FaPen } from "react-icons/fa";
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
import { db } from "@/lib/firebaseConfig";

export type Subject = {
  id: string;
  name: string;
  SubjectUpatedAt: Timestamp;
};

const ITEMS_PER_PAGE = 8;

const SubjectTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"newest" | "oldest">("newest");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // Separate sorting logic for Firestore Timestamps
  const sortSubjects = (
    subjectsToSort: Subject[],
    field: "newest" | "oldest"
  ) => {
    return [...subjectsToSort].sort((a, b) => {
      const timeA = a.SubjectUpatedAt.toMillis();
      const timeB = b.SubjectUpatedAt.toMillis();

      return field === "newest" ? timeB - timeA : timeA - timeB;
    });
  };

  const handleDelete = async (id: string) => {
    try {
      const subjectDocRef = doc(db, "subjects", id);
      const subjectDocSnap = await getDoc(subjectDocRef);

      if (!subjectDocSnap.exists()) {
        throw new Error(`Subject with ID ${id} does not exist`);
      }

      await deleteDoc(subjectDocRef);
      setSubjects((prevSubjects) => {
        const updatedSubjects = prevSubjects.filter(
          (subject) => subject.id !== id
        );
        return sortSubjects(updatedSubjects, sortField);
      });
      console.log(`Subject with ID ${id} deleted successfully!`);
      alert(`Subject with ID ${id} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "subjects"));
        const fetchedSubjects = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data()["SubjectName"],
          SubjectUpatedAt: doc.data().SubjectUpatedAt,
        }));

        const sortedSubjects = sortSubjects(fetchedSubjects, sortField);
        setSubjects(sortedSubjects);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    };
    fetchSubjects();
  }, [handleDelete, sortField]);

  const handleSort = (field: "newest" | "oldest") => {
    setSortField(field);
    setSubjects((prevSubjects) => sortSubjects(prevSubjects, field));
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  // const formatDate = (timestamp: Timestamp) => {
  //   const date = timestamp.toDate();
  //   return date.toLocaleString("en-US", {
  //     day: "numeric",
  //     month: "long",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     second: "2-digit",
  //     hour12: false,
  //   });
  // };

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
              onChange={(e) => {
                const value = e.target.value as "newest" | "oldest";
                handleSort(value);
              }}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
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
              {/* <th className="px-4 text-gray-500 py-2">Updated At</th> */}
              <th className="px-4 text-gray-500 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentSubjects.map((subject) => (
              <tr key={subject.id} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">{subject.name}</td>
                {/* <td className="px-4 py-2">
                  {formatDate(subject.SubjectUpatedAt)}
                </td> */}
                <td className="px-4 py-2 flex space-x-2">
                  <button className="p-2">
                    <Link href={`/editsubject/${subject.id}`} passHref>
                      <FaPen className="text-black" />
                    </Link>
                  </button>
                  <button
                    className="p-2"
                    onClick={() => handleDelete(subject.id)}
                  >
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
          Showing data{" "}
          {Math.min(
            (currentPage - 1) * ITEMS_PER_PAGE + 1,
            filteredSubjects.length
          )}{" "}
          to {Math.min(currentPage * ITEMS_PER_PAGE, filteredSubjects.length)}{" "}
          of {filteredSubjects.length} entries
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
                currentPage === index + 1
                  ? "bg-[#F7B696] text-white"
                  : "bg-gray-200 text-gray-600"
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
