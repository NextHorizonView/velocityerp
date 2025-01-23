"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoIosCloudUpload, IoIosSearch } from "react-icons/io";
import { FaTrash, FaPen } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { uploadSubjectCsv } from "./uploadCsv";
import { refreshSubjectList } from "./uploadCsv";
import { getFirebaseServices } from '@/lib/firebaseConfig';
import "jspdf-autotable"; 
const { db } = getFirebaseServices();
import { DialogClose } from "@radix-ui/react-dialog";
import FilterModal, { FilterState,ClassFilterState } from "../Student/StudentsFilter";
import { Filter } from "lucide-react";
import jsPDF from "jspdf";
import Papa from "papaparse"; 

export type Subject = {
  id: string;
  name: string;
  SubjectUpatedAt: Timestamp;
};

export type SubjectFile ={
  Name: string;
  Url: string;
  SubjectId: string;
}

export type SubjectTeacher ={
  SubjectTeacherID: string;
  SubjectTeacherName: string;
  SubjectTeacherPosition: string;
}

export type allSubjectsData ={
  id: string; // Document ID
  SubjectCreatedAt:Timestamp;
  SubjectFile: SubjectFile[];
  SubjectName: string;
  SubjectTeachersId: SubjectTeacher[];
  SubjectUpatedAt: Timestamp;
}


const ITEMS_PER_PAGE = 8;

const SubjectTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField] = useState<"newest" | "oldest">("newest");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [allSubjects,setAllSubjects]=useState<allSubjectsData[]>([]);
  
  const [currentPage, setCurrentPage] = useState(1);

  // const [,setFilters] = useState<FilterState | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // const handleFilterChange = (newFilters: FilterState) => {
  //   setFilters(newFilters);
  //   // Don't close the modal automatically
  //   console.log('Applied Filters:', newFilters);
  //   // Apply filtering logic here
  // };



  const [filters, setFilters] = useState<ClassFilterState>({
    academicYear: "",
    subject: "",
    sortBy: "name",
    sortOrder: "asc",
  });


  // Import/Export
  const handleImportExport = () => {
    setIsImportExportDialogOpen(true);
  };

  const [isImportExportDialogOpen, setIsImportExportDialogOpen] =
    useState(false);

  const [file,setFile] = useState<File | null>(null);

  // Separate sorting logic for Firestore Timestamps
  const sortSubjects = (
    subjectsToSort: Subject[],
    field: "newest" | "oldest"
  ) => {
    return [...subjectsToSort].sort((a, b) => {
      const timeA = a.SubjectUpatedAt?.toMillis();
      const timeB = b.SubjectUpatedAt?.toMillis();

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
        const fetchedAllSubjectsData: allSubjectsData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          SubjectCreatedAt: doc.data().SubjectCreatedAt as Timestamp, // Use Timestamp directly
          SubjectFile: doc.data().SubjectFile || [], // Default to empty array if not present
          SubjectName: doc.data().SubjectName,
          SubjectTeachersId: doc.data().SubjectTeachersId || [], // Default to empty array if not present
          SubjectUpatedAt: doc.data().SubjectUpatedAt as Timestamp // Use Timestamp directly
        }));
        setAllSubjects(fetchedAllSubjectsData);
        
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


  const filteredSubjects = subjects.filter((subject) =>
    subject?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );


const filterSubjects = filteredSubjects
  .filter((subject) => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filters.academicYear || subject.SubjectUpatedAt?.toDate().getFullYear().toString() === filters.academicYear;
    const matchesSubject = !filters.subject || subject.name.toLowerCase() === filters.subject.toLowerCase();

    return matchesSearch && matchesYear && matchesSubject;
  })
  .sort((a, b) => {
    switch (filters.sortBy) {
      case "name":
        return filters.sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });



  const totalPages = Math.ceil(filterSubjects.length / ITEMS_PER_PAGE);
  const currentSubjects = filterSubjects.slice(
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

  // download csv,pdf




     const handleUploadCsv = async () => {
        if (file) {
          try {
            console.log("file is",file);
            await uploadSubjectCsv(file);
            alert("CSV file uploaded successfully!");
            await refreshSubjectList(() => currentSubjects);
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
  const csvData = allSubjects.flatMap((subject) =>
    subject.SubjectTeachersId.map((teacher) => ({
      SubjectName: subject.SubjectName,
      SubjectTeacherName: teacher.SubjectTeacherName,
      SubjectTeacherPosition: teacher.SubjectTeacherPosition,
      FileUrls: subject.SubjectFile.map((file) => file.Url).join(", "),
    }))
  );

  // Use Papa.parse to convert the data into CSV format
  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "subjects.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setIsImportExportDialogOpen(false); // Close dialog after download
};

const handleDownloadPdf = () => {
  const doc = new jsPDF();

  // Title of the PDF
  doc.text("Subject Details", 14, 10);

  // Define columns for the table in the PDF
  const columns = ["SubjectName", "SubjectTeacher Name", "SubjectTeacher Position"];

  // Create the rows using the data from allSubjects
  const rows = allSubjects.flatMap((subject) =>
    subject.SubjectTeachersId.map((teacher) => [
      subject.SubjectName,
      teacher.SubjectTeacherName,
      teacher.SubjectTeacherPosition,
      // subject.SubjectFile.map((file) => file.Url).join(", "), // Join URLs if multiple files
    ])
  );

  // @ts-expect-error: autoTable is not recognized due to missing type definitions
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 20,
  });

  // Save the PDF
  doc.save("subjects.pdf");

  setIsImportExportDialogOpen(false); // Close dialog after download
};

  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">Subject</h1>

          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none"
            onClick={handleImportExport}
          >
            <IoIosCloudUpload className="h-10 w-10 text-black" />
          </Button>
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
                onChange={(e) => setFile(e.target.files?.[0] || null)}

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
                onClick={handleDownloadPdf}
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
          <button
              onClick={() => setFilterOpen(true)}
              className=" flex space-x-3 px-4 py-2 justify-center bg-[#576086] text-white rounded-lg"
            >
              <Filter className="w-5 h-5 flex mt-1" />
              Filter
            </button>
            {/* Filter Modal */}
         <FilterModal
  route="/class" // Keep the route consistent
  onFilterChange={(newFilters) => {
    setFilters(newFilters as ClassFilterState); // Update the state with the new filters
    console.log("Applied Filters:", newFilters);
  }}
  isOpen={isFilterOpen}
  onClose={() => setFilterOpen(false)}
  initialFilters={filters} // Pass the current filters as initial values
/>
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
            filterSubjects.length
          )}{" "}
          to {Math.min(currentPage * ITEMS_PER_PAGE, filterSubjects.length)}{" "}
          of {filterSubjects.length} entries
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
              className={`px-3 py-1 rounded ${currentPage === index + 1
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
