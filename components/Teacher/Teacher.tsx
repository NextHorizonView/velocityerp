"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IoIosCloudUpload } from "react-icons/io";
import Link from "next/link";
import TeachersTable from "./TeachersTable";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();
import { fetchFormFieldsTeacher, FormField } from "../helper/firebaseHelper";
import useSWR, { mutate } from "swr";
import FadeLoader from "../Loader";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

export type Teacher = {
  id: number;
  name?: string;
  class?: string;
  phone?: string;
  email?: string;
  gender?: "Male" | "Female";
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  religion?: string;
  studentId?: string;
};
const fetchTeacher = async () => {
  const querySnapshot = await getDocs(collection(db, "teachers"));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as unknown as Teacher)
  );
};

const ITEMS_PER_PAGE = 8;

export default function Teachers() {
  const path = usePathname();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { data: teachers, error } = useSWR<Teacher[]>("teachers", fetchTeacher);

  const { data: fields = [], error: fieldsError } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    userId ? () => fetchFormFieldsTeacher(userId) : null,
    { revalidateOnFocus: false }
  );
  useEffect(() => {
    if (path === "/teacher") {
      mutate("teachers");
    }
  }, [path]);

  const formFields = fields[0]?.FormFields || [];

  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const handleImportExport = () => {
    setIsImportExportDialogOpen(true);
  };

  const [isImportExportDialogOpen, setIsImportExportDialogOpen] =
    useState(false);

    const [file] = useState<File | null>(null);

  const handleDelete = async (teacher: Teacher) => {
    try {
      const teacherDocRef = doc(db, "teachres", teacher.id.toString());

      // Check if the document exists
      const teacherDocSnap = await getDoc(teacherDocRef);
      if (!teacherDocSnap.exists()) {
        throw new Error(`Student with ID ${teacher.id} does not exist`);
      }
      await deleteDoc(teacherDocRef);
      mutate("teachers");
      console.log(`teacher with ID ${teacher.id} deleted successfully!`);

      // Call the API to delete the document and auth account
      // const response = await fetch("/api/deleteStudent", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ uid: teacher.id }), // Pass the teacher's uid
      // });

      // if (!response.ok) {
      //   const error = await response.json();
      //   throw new Error(error.message || "Failed to delete student.");
      // }

      // console.log(`teacher with ID ${teacher.id} deleted successfully!`);
      // mutate("teacher"); // Refresh the student list
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };

  const filteredAndSortedTeachers = useMemo(() => {
    return [...(teachers || [])]
      .filter(
        (teacher) =>
          teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone?.includes(searchTerm) ||
          teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if ((a[sortConfig.key] ?? "") < (b[sortConfig.key] ?? "")) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if ((a[sortConfig.key] ?? "") > (b[sortConfig.key] ?? "")) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [teachers, searchTerm, sortConfig, handleDelete]);

  if (error) return <div>Error loading students</div>;
  if (!teachers)
    return (
      <div>
        <FadeLoader />
      </div>
    );
  if (fieldsError) {
    console.error("Error fetching fields:", fieldsError);
    return <div>Error loading form fields</div>;
  }

  const handleSort = (key: keyof Teacher) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const totalPages = Math.ceil(
    filteredAndSortedTeachers.length / ITEMS_PER_PAGE
  );
  // const paginatedTeachers = filteredAndSortedTeachers.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">All Teachers</h1>
          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none"
            onClick={handleImportExport}
          >
            <IoIosCloudUpload className="h-10 w-10 text-black" />
          </Button>
          
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/teacherform">
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
            >
              + Add new Teacher
            </Button>
          </Link>
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 h-10"
          />
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#576086]"
              onChange={(e) => handleSort(e.target.value as keyof Teacher)}
            >
              <option value="name">Newest</option>
              <option value="class">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAF8] rounded-lg shadow-sm">
        {/* <Table className="border-b  ">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Teacher Name
              </TableHead>
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Class/Div
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">
                Phone Number
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">
                GR Number
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">Gender</TableHead>
              <TableHead className="py-4 text-sm font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-gray-50">
                <TableCell className="py-4">{teacher.name}</TableCell>
                <TableCell className="py-4">{teacher.class}</TableCell>
                <TableCell className="py-4">{teacher.phone}</TableCell>
                <TableCell className="py-4">{teacher.grNumber}</TableCell>
                <TableCell className="py-4">
                  <div
                    className={`w-20 h-8 flex items-center justify-center rounded-md text-xs font-medium ${
                      teacher.gender === "male"
                        ? "bg-[#86efac] text-[#166534]"
                        : "bg-[#fca5a5] text-[#991b1b]"
                    }`}
                  >
                    {teacher.gender === "male" ? "Male" : "Female"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
        <TeachersTable teachers={teachers} formFields={formFields} />

        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Showing data 1 to{" "}
            {Math.min(ITEMS_PER_PAGE, filteredAndSortedTeachers.length)} of{" "}
            {filteredAndSortedTeachers.length} entries
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </Button>
            {[...Array(totalPages)].map((_, index) => (
              <Button
                key={index}
                variant={currentPage === index + 1 ? "default" : "outline"}
                className={`w-9 h-9 ${
                  currentPage === index + 1 ? "bg-[#F7B696]" : ""
                }`}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              className="w-9 h-9"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
      <Dialog open={isImportExportDialogOpen} onOpenChange={setIsImportExportDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Import/Export</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Choose an action to import or export student data.
            </p>
          </div>

          <div className="mt-4 flex flex-col space-y-4">
            {/* File Upload */}
            <label
              htmlFor="file-upload"
              className="flex items-center justify-center w-full px-4 py-2 bg-[#576086] hover:bg-[#474d6b] text-white h-10 text-sm cursor-pointer rounded-md"
            >
              <input
                type="file"
                accept=".csv"
                // onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              Upload CSV
            </label>

            {/* Conditionally Render "Upload this file" Button */}
            {file && (
              <Button
                variant="default"
                className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
                // onClick={handleUploadCsv}
              >
                Upload this file
              </Button>
            )}

            {/* Download Buttons */}
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              // onClick={handleDownloadCsv}
            >
              Download CSV
            </Button>
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              // onClick={handleDownloadCsv}
            >
              Download PDF
            </Button>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
