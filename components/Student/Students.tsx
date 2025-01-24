"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadCsv, refreshStudentList } from "./uploadCsv";
import FilterModal, { FilterState } from './StudentsFilter';
import { IoIosCloudUpload } from "react-icons/io";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Filter } from "lucide-react";

import Papa from "papaparse";
import useSWR from "swr";
import { collection,getDocs } from "firebase/firestore";
import { getFirebaseServices } from '@/lib/firebaseConfig';
import "jspdf-autotable";

const { db } = getFirebaseServices();
import { fetchFormFields, FormField } from "../helper/firebaseHelper";
import { mutate } from "swr";
import StudentsTable from "./StudentTable";
import { usePathname } from "next/navigation";
import FadeLoader from "../Loader";
import { jsPDF } from "jspdf";
import { StudentFilterState } from './StudentsFilter';

export type Student = {
  id: string;
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

  [key: string]: string | undefined;

};



export interface DynamicFields {
  City?: string;
  Email?: string;
  "First Name"?: string;
  "Last Name"?: string;
  Pincode?: string;
  State?: string;
  game?: string;
  id: string;
  undefined?: string; // Handling "undefined" key as a string key.
  [key: string]: string | undefined; // Allows additional dynamic fields.
}

// export type StudentD = {
//   id: string;
//   [key: string]: any; // Allow dynamic keys
// };

// const fetchStudent = async () => {
//   const querySnapshot = await getDocs(collection(db, "students"));
//   return querySnapshot.docs.map((doc) => {
//     const data = doc.data();
//     return {
//       id: doc.id,
//       "First Name": data["First Name"],
//       "Last Name": data["Last Name"],
//       Email: data["Email"],
//       Gender: data["Gender"],
//       City: data["City"],
//       State: data["State"],
//       Pincode: data["Pincode"],
//     } as DynamicFields;
//   });
// };


// const { data: studentsPdf, error: studentsPdfError } = useSWR<DynamicFields[]>("students", fetchStudent);


const fetchStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "students"));
  return querySnapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() } as unknown as Student)
  );
};
const ITEMS_PER_PAGE = 8;

export default function Students() {
  const path = usePathname();
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const { data: students, error } = useSWR("students", fetchStudents);

  const { data: fields = [], error: fieldsError } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    userId ? () => fetchFormFields(userId) : null,
    { revalidateOnFocus: false }
  );
  useEffect(() => {
    if (path === "/students") {
      mutate("students");
    }
  }, [path]);

  // filter states
  // const [, setFilters] = useState<FilterState | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  
  const [filters, setFilters] = useState<StudentFilterState>({
    academicYear: '',
    class: [0, 12], // Example: Grade range
    gender: null,   // Male, Female, or null
    sortBy: 'First Name',
    sortOrder: 'asc',
    disability: false, // Add missing property
  specialStudent: false,
  });
  
  // const handleFilterChange = (newFilters: FilterState) => {
  //   setFilters(newFilters);
  //   // Don't close the modal automatically
  //   console.log('Applied Filters:', newFilters);
  //   // Apply filtering logic here
  // };


  const formFields = fields[0]?.FormFields || [];

  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState("");

  // Temp
  // const [sortConfig] = useState<{
  //   key: keyof Student;
  //   direction: "asc" | "desc";
  // }>({ key: "name", direction: "asc" });

  const [isImportExportDialogOpen, setIsImportExportDialogOpen] =
    useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Temp no use
  // const handleDelete = async (student: Student) => {
  //   try {
  //     const studentDocRef = doc(db, "students", student.id.toString());

  //     // Check if the document exists
  //     const studentDocSnap = await getDoc(studentDocRef);
  //     if (!studentDocSnap.exists()) {
  //       throw new Error(`Student with ID ${student.id} does not exist`);
  //     }

  //     // Call the API to delete the document and auth account
  //     const response = await fetch("/api/deleteStudent", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ uid: student.id }), // Pass the student's uid
  //     });

  //     if (!response.ok) {
  //       const error = await response.json();
  //       throw new Error(error.message || "Failed to delete student.");
  //     }

  //     console.log(`Student with ID ${student.id} deleted successfully!`);
  //     mutate("students"); // Refresh the student list
  //   } catch (error) {
  //     console.error("Error deleting student:", error);
  //   }
  // };

  // const filteredAndSortedStudents = useMemo(() => {
  //   return [...(students || [])]
  //     .filter(
  //       (student) =>
  //         searchTerm === "" ||
  //         student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         student.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         student.phone?.includes(searchTerm) ||
  //         student.email?.toLowerCase().includes(searchTerm.toLowerCase())
  //     )
  //     .sort((a, b) => {
  //       if ((a[sortConfig.key] ?? "") < (b[sortConfig.key] ?? "")) {
  //         return sortConfig.direction === "asc" ? -1 : 1;
  //       }
  //       if ((a[sortConfig.key] ?? "") > (b[sortConfig.key] ?? "")) {
  //         return sortConfig.direction === "asc" ? 1 : -1;
  //       }
  //       return 0;
  //     });

  //     console.log("Sorted students:", filteredAndSortedStudents);

  // }, [searchTerm, sortConfig, handleDelete,students]);




  const filteredAndSortedStudents = useMemo(() => {
    return [...(students || [])].filter((student: DynamicFields) => {
      // Define the keys you want to search through
      const searchFields = [
        student["First Name"],
        student["Last Name"],
        student.Email,
        student.City,
        student.State,
        student.Pincode,
        student.game,
      ].map((field) => (field || "").toLowerCase());
  
      // Check if any field contains the search term
      return searchFields.some((field) => field.includes(searchTerm.toLowerCase()));
    });
  }, [students, searchTerm]);
  




  // const paginatedStudents = useMemo(
  //   () =>
  //     filteredAndSortedStudents.slice(
  //       (currentPage - 1) * ITEMS_PER_PAGE,
  //       currentPage * ITEMS_PER_PAGE
  //     ),
  //   [filteredAndSortedStudents, currentPage]
  // );

  if (error) return <div>Error loading students</div>;
  if (!students)
    return (
      <div>
        <FadeLoader />
      </div>
    );
  if (fieldsError) {
    console.error("Error fetching fields:", fieldsError);
    return <div>Error loading form fields</div>;
  }




  const totalPages = Math.ceil(
    filteredAndSortedStudents.length / ITEMS_PER_PAGE
  );

  // const paginatedStudents = filteredAndSortedStudents.slice(
  //   (currentPage - 1) * ITEMS_PER_PAGE,
  //   currentPage * ITEMS_PER_PAGE
  // );

  const handleImportExport = () => {
    setIsImportExportDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };
  const handleUploadCsv = async () => {
    if (file) {
      try {
        await uploadCsv(file);
        alert("CSV file uploaded successfully!");
        await refreshStudentList(() => students);
      } catch (error) {
        console.error("Error uploading CSV file: ", error);
        alert("Failed to upload CSV file.");
      }
    } else {
      alert("Please select a CSV file.");
    }
    setIsImportExportDialogOpen(false);
  };

  const handleDownloadCsv = () => {
    const csv = Papa.unparse(students);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsImportExportDialogOpen(false);
  };


  



  const handleDownloadPdf = (students: Student[]) => {
    const doc = new jsPDF();
  
    doc.text("Student List", 14, 10);
  
 
    const columns = students.length > 0 ? Object.keys(students[0]).filter(column => column !== 'id') : [];
  
    const rows = students.map((student) => {
      return columns.map((column) => (student as Record<string, unknown>)[column] || "N/A");
    });
  
  // @ts-expect-error: autoTable is not recognized due to missing type definitions
 doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });
  
    doc.save("students.pdf");
  
    setIsImportExportDialogOpen(false);
  };
  





const filteredSortedStudents = filteredAndSortedStudents
  ? filteredAndSortedStudents
      .filter((student) => {
        const matchesSearch = searchTerm
          ? student.name?.toLowerCase().includes(searchTerm.toLowerCase())
          : true;

        const matchesYear =
          !filters.academicYear || student.academicYear === filters.academicYear;

        const matchesClass =
          !filters.class ||
          (student.class &&
            parseInt(student.class) >= filters.class[0] &&
            parseInt(student.class) <= filters.class[1]);

        const matchesGender = !filters.gender || student.gender === filters.gender;

        return matchesSearch && matchesClass && matchesGender || matchesYear;
      })
      .sort((a, b) => {
        const sortKeyMap = {
          "First Name": "First Name", 
          "Last Name": "lastName",
          "Class": "class",
          "Gender": "gender",
        };

        const key = sortKeyMap[filters?.sortBy as keyof typeof sortKeyMap];

        const direction = filters.sortOrder === "asc" ? 1 : -1;

        const aValue = String(a[key] || "").toLowerCase(); 
        const bValue = String(b[key] || "").toLowerCase();

        if (typeof aValue === "string" && typeof bValue === "string") {
          return aValue.localeCompare(bValue) * direction;
        }
        
        if (typeof aValue === "number" && typeof bValue === "number") {
          return (aValue - bValue) * direction;
        }
        
        return 0;
      })
  : [];









  console.log("search",searchTerm);
  console.log("students",students);
  console.log("Filtered",filteredAndSortedStudents);
  console.log("Filtered after",filteredSortedStudents);


  console.log("Filtered students before sorting:", filteredAndSortedStudents);
  console.log("Sorting key:", filters.sortBy, "Sort order:", filters.sortOrder);
  console.log("Student sample for sorting:", filteredAndSortedStudents[0]);
  

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">All Students</h1>

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
          <Link href="/studentform">
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
            >
              + Add new Student
            </Button>
          </Link>

          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-10 pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <IoIosSearch className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setFilterOpen(true)}
              className=" flex space-x-3 px-4 py-2 justify-center bg-[#576086] text-white rounded-lg"
            >
              <Filter className="w-5 h-5 flex mt-1" />
              Filter
            </button>
            {/* Filter Modal */}
            {/* <FilterModal
              route="/students"
              onFilterChange={handleFilterChange}
              isOpen={isFilterOpen}
              onClose={() => setFilterOpen(false)}
              initialFilters={null}
            /> */}


<FilterModal
  route="/students"
  onFilterChange={(newFilters) => {
    setFilters(newFilters as StudentFilterState); // Update the filters
    console.log("Applied Filters:", newFilters);
  }}
  isOpen={isFilterOpen}
  onClose={() => setFilterOpen(false)}
  initialFilters={filters} // Pass the current filter state
/>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAF8] rounded-lg shadow-sm">
        <StudentsTable 
        // students={students} 
        students={filteredSortedStudents} 
        formFields={formFields} />

        {/* table footer  */}
        <div className="flex items-center justify-between px-6 py-4 border-t">
          <div className="text-sm text-gray-500">
            Showing data {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              filteredAndSortedStudents.length
            )}{" "}
            of {filteredAndSortedStudents.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-[#F7B696]" : ""}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Import/Export Dialog */}
      {/* upload csv */}
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
                onChange={handleFileChange}
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
                onClick={handleUploadCsv}
              >
                Upload this file
              </Button>
            )}

            {/* Download Buttons */}
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              onClick={handleDownloadCsv}
            >
              Download CSV
            </Button>
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              // onClick={handleDownloadPdf}
              onClick={() => handleDownloadPdf(students)}
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
