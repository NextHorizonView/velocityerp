'use client';
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { IoIosCloudUpload, IoIosSearch } from "react-icons/io";
import { FaTrash, FaPen } from "react-icons/fa";
import {refreshClassList} from "./uploadCsv";
import { uploadCsv } from "./uploadCsv";
import { Button } from "@/components/ui/button";
import { collection, getDocs } from "firebase/firestore";
import useSWR from "swr";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { doc, deleteDoc } from 'firebase/firestore';
import { getFirebaseServices } from '@/lib/firebaseConfig';
import FilterModal, { FilterState  , ClassFilterState} from "../Student/StudentsFilter";
import { Filter } from "lucide-react";
import Papa from "papaparse";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { fetchTeacherName } from "../helper/firebaseHelper";
const { db } = getFirebaseServices();
export type Subject = {
  id: number;
  name: string;
  classDiv: string | number;
};

export interface ClassData {
  id:string;
  ClassId: string;
  ClassName: string;
  ClassDivision: string;
  ClassTeacherId: string[];
  ClassSubjects: { SubjectName: string; SubjectId: string; SubjectTeacherID: string }[];
  ClassYear:string;
}

const fetcher = async (): Promise<ClassData[]> => {
  const querySnapshot = await getDocs(collection(db, 'classes'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ClassData[];
};

const route = '/class' as const;


const ITEMS_PER_PAGE = 10;

const SubjectTable = () => {

  // Import/Export of csv
// const [filters, setFilters] = useState<ClassFilterState>({
//     academicYear: '',
//     subject: '',
//     sortBy: 'name',
//     sortOrder: 'asc'
//   });

  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);

    const [filters, setFilters] = useState<ClassFilterState>({
      academicYear: '',
      subject: '',
      sortBy: 'name',
      sortOrder: 'asc'
    });


  const [searchTerm, setSearchTerm] = useState("");
  
  // const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [currentPage, setCurrentPage] = useState(1);
  const [classList, setClassList] = useState<ClassData[]>([]);

  // const [,setFileFilters] = useState<FilterState | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);

  // const handleFilterChange = (newFilters: FilterState) => {
  //   setFileFilters(newFilters);
  //   // Don't close the modal automatically
  //   console.log('Applied Filters:', newFilters);
  //   // Apply filtering logic here
  // };
  const [file, setFile] = useState<File | null>(null);


  console.log(classList);


  const { data: fetchedClasses, error } = useSWR<ClassData[]>('classes', fetcher);
  console.log("fetched claases", fetchedClasses);
  if (error) return <div>Error loading classes</div>;
  if (!fetchedClasses) return <div>Loading...</div>;
  

  const handleDelete = async (id: string) => {
    try {
        // Delete the class from Firestore
        const classDocRef = doc(db, 'classes', id);
        await deleteDoc(classDocRef);

        // Update the state
        const updatedClasses = fetchedClasses.filter((classItem) => classItem.id !== id);
        setClassList(updatedClasses);

        alert('Class deleted successfully!');
    } catch (error) {
        console.error('Error deleting class:', error);
        alert('Failed to delete class. Please try again.');
    }
};

  const filteredClasses = fetchedClasses.filter((classItem) =>
    classItem.ClassName?.toLowerCase().includes(searchTerm?.toLowerCase())
  );

  console.log("filteredd classs",filteredClasses);


  
// const filteredClass = useMemo(() => {
//     if (!filteredClasses) return []; // Fallback for undefined `filteredClasses`
//     const safeSearchTerm = searchTerm || ''; // Fallback for `searchTerm`
//     const safeFilters = filters || {}; // Fallback for `filters`

//     return filteredClasses.filter(classItem => {
//         // Safely access `ClassName`
//         const className = classItem.ClassName?.toLowerCase() || '';
//         const matchesSearch = className.includes(safeSearchTerm.toLowerCase());

//         // Safely access `ClassYear`
//         const matchesYear = !safeFilters.academicYear || classItem.ClassYear === safeFilters.academicYear;

//         // Safely access `ClassSubjects`
//         const matchesSubject = !safeFilters.subject || (classItem.ClassSubjects || []).some(subject => {
//             const subjectName = subject.SubjectName?.toLowerCase() || '';
//             const subjectId = subject.SubjectId?.toLowerCase() || '';
//             return subjectName === safeFilters.subject.toLowerCase() || subjectId === safeFilters.subject.toLowerCase();
//         });

//         return matchesSearch && matchesYear && matchesSubject;
//     }).sort((a, b) => {
//         switch (safeFilters.sortBy) {
//             case 'name':
//                 return safeFilters.sortOrder === 'asc' 
//                     ? a.ClassName.localeCompare(b.ClassName)
//                     : b.ClassName.localeCompare(a.ClassName);
//             case 'subject':
//                 const aSubjects = (a.ClassSubjects || []).map(s => s.SubjectName).join(',');
//                 const bSubjects = (b.ClassSubjects || []).map(s => s.SubjectName).join(',');
//                 return safeFilters.sortOrder === 'asc'
//                     ? aSubjects.localeCompare(bSubjects)
//                     : bSubjects.localeCompare(aSubjects);
//             default:
//                 return 0;
//         }
//     });
// }, [filteredClasses, searchTerm, filters]); // Include `filters` in dependencies







console.log("fill tets",{ filteredClasses, searchTerm, filters });



const filteredClass = fetchedClasses
  ? filteredClasses.filter(classItem => {
      const matchesSearch = classItem.ClassName?.toLowerCase().includes(
        (searchTerm || '').toLowerCase()
      );
      
      const matchesYear = !filters.academicYear || 
        classItem.ClassYear === filters.academicYear;
      
      const matchesSubject = !filters.subject || 
        classItem.ClassSubjects.some(subject => 
          subject.SubjectName.toLowerCase() === (filters.subject || '').toLowerCase()
        );

      return matchesSearch && matchesYear && matchesSubject;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return filters.sortOrder === 'asc' 
            ? (a.ClassName || '').localeCompare(b.ClassName || '')
            : (b.ClassName || '').localeCompare(a.ClassName || '');
        case 'subject':
          const aSubjects = a.ClassSubjects.map(s => s.SubjectName).join(',');
          const bSubjects = b.ClassSubjects.map(s => s.SubjectName).join(',');
          return filters.sortOrder === 'asc'
            ? aSubjects.localeCompare(bSubjects)
            : bSubjects.localeCompare(aSubjects);
        default:
          return 0;
      }
    })
  : [];






    const paginatedClasses = filteredClass.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  const totalPages = Math.ceil(fetchedClasses.length / ITEMS_PER_PAGE);
  const currentClasses = fetchedClasses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };


  // upload functions
  
    const handleImportExport = () => {
      setIsImportExportDialogOpen(true);
    };
  
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        setFile(e.target.files[0]);
        console.log("File selected:", e.target.files[0]);  
      }
    };
    
    const handleUploadCsv = async () => {
      if (file) {
        try {
          console.log("file is",file);
          await uploadCsv(file);
          alert("CSV file uploaded successfully!");
          await refreshClassList(() => currentClasses);
        } catch (error) {
          console.error("Error uploading CSV file: ", error);
          alert("Failed to upload CSV file.");
        }
      } else {
        alert("Please select a CSV file.");
      }
      setIsImportExportDialogOpen(false);
    };
 
    const handleDownloadCsv = async () => {

      const csvData = await Promise.all(
        currentClasses.map(async (classItem) => {
          const teacherNames = await Promise.all(
            classItem.ClassTeacherId.map((id) => fetchTeacherName(id))
          );
          return {
            "Class Name": classItem.ClassName,
            "Division": classItem.ClassDivision,
            "Class Year":classItem.ClassYear,
            "Class Teacher": teacherNames.join(", "), // Combine teacher names into a string
            "Subjects": classItem.ClassSubjects.map((subject) => subject.SubjectName).join(", "), // Combine subject names into a string
          };
        })
      );
    
      // Generate CSV using PapaParse
      const csv = Papa.unparse(csvData);
    
      // Download CSV
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "class_list.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    
      setIsImportExportDialogOpen(false);
    };
    



    //

const handleDownloadPdf = async () => {
  const doc = new jsPDF();

  // Title
  doc.text("Class List", 14, 10);

  // Table Columns (Remove "Class ID")
  const columns = ["Class Name", "Division", "Class Year","Class Teacher", "Subjects"];

  // Table Rows (Remove "ClassId")
  const rows = await Promise.all(
    currentClasses.map(async (classItem) => {
      const teacherNames = await Promise.all(
        classItem.ClassTeacherId.map((id) => fetchTeacherName(id))
      );
      return [
        classItem.ClassName,
        classItem.ClassDivision,
        classItem.ClassYear,
        teacherNames.join("\n"), // Join multiple teacher names
        classItem.ClassSubjects.map((subject) => subject.SubjectName).join("\n"), // Join subject names
      ];
    })
  );

  // Generate the table
  // @ts-expect-error: autoTable is not recognized due to missing type definitions
  doc.autoTable({
    head: [columns],
    body: rows,
    startY: 20,
  });

  // Save the PDF
  doc.save("class_list.pdf");

  setIsImportExportDialogOpen(false);
};



// filters
 const handleFilterChange = (newFilters: FilterState) => {
    // setFilters(newFilters);
    
    if (route === '/class') {
      setFilters(newFilters as ClassFilterState);
console.log("new filters",newFilters);
      setCurrentPage(1);
    }


    // setCurrentPage(1); // Reset to first page when filters change
  };








  
  return (
    <div className="container mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">Class</h1>
          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none"
            onClick={handleImportExport}
          >
            <IoIosCloudUpload className="h-10 w-10 text-black" />
          </Button>
          {/* <Dialog open={isImportExportDialogOpen} onOpenChange={setIsImportExportDialogOpen}>
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

                {file && (
                  <Button
                    variant="default"
                    className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
                  // onClick={handleUploadCsv}
                  >
                    Upload this file
                  </Button>
                )}

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
          </Dialog> */}
        </div>
        <div className="flex items-center space-x-6">


          <Link href="/addclass">
            <button className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm rounded-md">
              + Add New Class
            </button>
          </Link>
          <div className="relative">
            <input
              placeholder="Search"
              value={searchTerm}
              // onChange={(e) => setSearchTerm(e.target.value)}

              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to the first page when searching
              }}
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
              route="/class"
              onFilterChange={handleFilterChange}
              isOpen={isFilterOpen}
              onClose={() => setFilterOpen(false)}
              initialFilters={null}


            />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-gray-50 rounded-lg">
        <table className="w-full border-none text-left">
          <thead>
            <tr className="border-b">
              <th className="px-4 text-gray-500 py-2">Class Name</th>
              <th className="px-4 text-gray-500 py-2">Div</th>
              <th className="px-4 text-gray-500 py-2">Class Year</th>

              <th className="px-4 text-gray-500 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedClasses.map((classItem) => (
              <tr key={classItem.ClassId} className="border-b hover:bg-gray-100">
                <td className="px-4 py-2">
                

                  {classItem.ClassName}
                </td>
                <td className="px-4 py-2">{classItem.ClassDivision}</td>
                <td className="px-4 py-2">{classItem.ClassYear}</td>

                <td className="px-4 py-2 flex space-x-2">
                  <button className="p-2">
                    <Link href={`/editclass/${classItem?.id}`} passHref>
                    <FaPen className="text-black" />
                    </Link>

                  </button>
                  <button className="p-2" onClick={() => handleDelete(classItem?.id)}>
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
          Showing data {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, filteredClasses.length)} to{" "}
          {Math.min(currentPage * ITEMS_PER_PAGE, filteredClasses.length)} of {filteredClasses.length} entries
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
              className={`px-3 py-1 rounded ${currentPage === index + 1 ? "bg-[#F7B696] text-white" : "bg-gray-200 text-gray-600"
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
  );
};

export default SubjectTable;
