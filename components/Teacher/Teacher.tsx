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
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import FilterModal, { FilterState } from "../Student/StudentsFilter";
import { Filter } from "lucide-react";
import { fetchFormFieldsTeacher, FormField } from "../helper/firebaseHelper";
import useSWR, { mutate } from "swr";
import FadeLoader from "../Loader";
import Papa from "papaparse";
import { uploadTeacherCsv,refreshTeacherList } from "./uploadCsv";
const { db } = getFirebaseServices();

export type Teacher = {
  id: string;
  name?: string;
  class?: string;
  phone?: string;
  email?: string;
  position?: string;
  lastname?: string;
  gender?: "Male" | "Female";
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  religion?: string;
  studentId?: string;
  [key: string]: string | undefined; // Add index signature for dynamic fields

};


export type TeacherFormat={
    id: string; // Firebase ID, typically a string
    "First Name": string;
    "Last Name": string;
    Email: string;
    Position: string;
    City: string;
    State: string;
    Pincode: string;
}

const convertTeacherFormat = (teachers: TeacherFormat[]): Teacher[] => {
  return teachers.map((teacher) => ({
    id: teacher.id, // Convert ID to number if necessary
    name: teacher["First Name"],
    email: teacher.Email || "",
    position: teacher.Position || "",
    lastname: teacher["Last Name"] || "",
    city: teacher.City || "",
    state: teacher.State || "",
    pincode: teacher.Pincode || "",
  }));
};

const ITEMS_PER_PAGE = 8;

export default function Teachers() {
  const path = usePathname();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  
  // State declarations
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportExportDialogOpen, setIsImportExportDialogOpen] = useState(false);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);
  const [filters, setFilters] = useState<FilterState | null>(null);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Data fetching functions
  const fetchTeacher = async () => {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as unknown as Teacher)
    );
  };

  const fetchTeachers = async () => {
    const querySnapshot = await getDocs(collection(db, "teachers"));
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        "First Name": data["First Name"],
        "Last Name": data["Last Name"],
        Email: data["Email"],
        Position: data["Position"],
        City: data["City"],
        State: data["State"],
        Pincode: data["Pincode"],
      } as TeacherFormat;
    });

  
  };

  // SWR hooks for data fetching
  const { data: teachers, error } = useSWR<Teacher[]>("teachers", fetchTeacher);
  const { data: teachersPdf, error: teachersPdfError } = useSWR<TeacherFormat[]>("teachers", fetchTeachers);
  const { data: fields = [], error: fieldsError } = useSWR<FormField[]>(
    userId ? `formFields-${userId}` : null,
    userId ? () => fetchFormFieldsTeacher(userId) : null,
    { revalidateOnFocus: false }
  );

  // Effects
  useEffect(() => {
    if (path === "/teacher") {
      mutate("teachers");
    }
  }, [path]);

 

  // Event handlers
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    console.log('Applied Filters:', newFilters);
  };

  const handleDelete = async (teacher: Teacher) => {
    try {
      const teacherDocRef = doc(db, "teachers", teacher.id.toString());
      const teacherDocSnap = await getDoc(teacherDocRef);
      
      if (!teacherDocSnap.exists()) {
        throw new Error(`Teacher with ID ${teacher.id} does not exist`);
      }
      
      await deleteDoc(teacherDocRef);
      mutate("teachers");
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  };



     const handleUploadCsv = async () => {
        if (file) {
          try {
            await uploadTeacherCsv(file);
            alert("CSV file uploaded successfully!");
            await refreshTeacherList(() => teachers);
          } catch (error) {
            console.error("Error uploading CSV file: ", error);
            alert("Failed to upload CSV file.");
          }
        } else {
          alert("Please select a CSV file.");
        }
        setIsImportExportDialogOpen(false);
      };



  const handleDownloadPdf = (teachers: TeacherFormat[]) => {
    const doc = new jsPDF();
    doc.text("Teacher Details", 14, 10);

    const columns = [
      "Name",
      "Email",
      "Position",
      "Last Name",
      "City",
      "State",
      "Pincode",
    ];

    const rows = teachers.map((teacher) => [
      teacher["First Name"] ,
      teacher["Last Name"],
      teacher.Email,
      teacher.Position,
      teacher.City,
      teacher.State,
      teacher.Pincode,
    ]);

    // @ts-expect-error: autoTable is not recognized due to missing type definitions
    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 20,
    });

    doc.save("teachers.pdf");
  };

  const handleDownloadCsv = (teachers: TeacherFormat[]) => {
    // Map TeacherFormat objects into a flat array of key-value pairs
    const csvData = teachers.map((teacher) => ({
      "First Name": teacher["First Name"],
      "Last Name": teacher["Last Name"],
      Email: teacher.Email,
      Position: teacher.Position,
      City: teacher.City,
      State: teacher.State,
      Pincode: teacher.Pincode,
    }));
  
    // Convert the data to CSV format
    const csv = Papa.unparse(csvData);
  
    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  
    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
  
    link.setAttribute("href", url);
    link.setAttribute("download", "teachers.csv");
  
    // Append the link to the document, trigger the download, then remove the link
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

 

  // const filteredAndSortedTeachers = useMemo(() => {
  //   return [...(teachers || [])]
  //     .filter(teacher =>
  //       teacher.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       teacher.class?.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       teacher.phone?.includes(searchTerm) ||
  //       teacher.email?.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  // }, [teachers, searchTerm]);



console.log('teachers',teachers);

  // const filteredAndSortedTeachers = useMemo(() => {
  //   return [...(teachersPdf || [])].filter((teacher) => {
  //     const name = teacher["First Name"]?.toLowerCase() || "";
  //     const lastname = teacher["Last Name"]?.toLowerCase() || "";
  //     const className = teacher.Position?.toLowerCase() || "";
  //     const phone = teacher["Last Name"] || "";
  //     const email = teacher.Email?.toLowerCase() || "";
  
  //     return (
  //       name.includes(searchTerm.toLowerCase()) ||
  //       lastname.includes(searchTerm.toLowerCase()) ||
  //       className.includes(searchTerm.toLowerCase()) ||
  //       phone.includes(searchTerm) ||
  //       email.includes(searchTerm.toLowerCase())
  //     );
  //   });
  // }, [teachers, searchTerm]);
  
  const filteredAndSortedTeachers = useMemo(() => {
    return [...(teachersPdf || [])].filter((teacher) => {
      const searchFields = [
        teacher["First Name"],
        teacher["Last Name"],
        teacher.Position,
        teacher.Email,
      ].map(field => (field || "").toLowerCase());
      
      return searchFields.some(field => field.includes(searchTerm.toLowerCase()));
    });
  }, [teachersPdf, searchTerm]);

  // Error and loading states
  if (error) return <div>Error loading teachers</div>;
  if (teachersPdfError) return <div>Error loading teachers for PDF</div>;
  if (!teachers) return <div><FadeLoader /></div>;
  if (fieldsError) {
    console.error("Error fetching fields:", fieldsError);
    return <div>Error loading form fields</div>;
  }

  const totalPages = Math.ceil(filteredAndSortedTeachers.length / ITEMS_PER_PAGE);
  const formFields = fields[0]?.FormFields || [];


  console.log("converted teachers",convertTeacherFormat(filteredAndSortedTeachers));
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">All Teachers</h1>
          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none"
            onClick={() => setIsImportExportDialogOpen(true)}
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
          <button
            onClick={() => setFilterOpen(true)}
            className="flex space-x-3 px-4 py-2 justify-center bg-[#576086] text-white rounded-lg"
          >
            <Filter className="w-5 h-5 flex mt-1" />
            Filter
          </button>
          <FilterModal
            onFilterChange={handleFilterChange}
            isOpen={isFilterOpen}
            onClose={() => setFilterOpen(false)}
            initialFilters={null}
          />
        </div>
      </div>

      <div className="bg-[#FAFAF8] rounded-lg shadow-sm">
        <TeachersTable 
        // teachers={teachers} 

        teachers={filteredAndSortedTeachers} 
        // teachers={convertTeacherFormat(filteredAndSortedTeachers)} 
        // formFields={formFields}
        
        formFields={formFields.map(field => ({
          ...field,
          // Map the field names to match the data structure
          FieldName: field.FieldName === "name" ? "First Name" :
                    field.FieldName === "lastname" ? "Last Name" :
                    field.FieldName === "email" ? "Email" :
                    field.FieldName === "position" ? "Position" :
                    field.FieldName === "city" ? "City" :
                    field.FieldName === "state" ? "State" :
                    field.FieldName === "pincode" ? "Pincode" :
                    field.FieldName
        }))}
        />


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

      <Dialog 
        open={isImportExportDialogOpen} 
        onOpenChange={setIsImportExportDialogOpen}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base">Import/Export</DialogTitle>
          </DialogHeader>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Choose an action to import or export teacher data.
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
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
          
              />
              Upload CSV
            </label>

            {file && (
              <Button
                variant="default"
                className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
                onClick={handleUploadCsv}
              >
                Upload this file
              </Button>
            )}

            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              onClick={() => {
                if (teachersPdf && teachersPdf.length > 0) {
                  handleDownloadCsv(teachersPdf);
                } else {
                  console.error("Teachers data is not available for PDF download");
                }
              }}
            >
              Download CSV
            </Button>
            
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
              onClick={() => {
                if (teachersPdf && teachersPdf.length > 0) {
                  handleDownloadPdf(teachersPdf);
                } else {
                  console.error("Teachers data is not available for PDF download");
                }
              }}
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