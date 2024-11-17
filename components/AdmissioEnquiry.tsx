
//
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getFirestore, collection, getDocs } from "firebase/firestore";

import { query, where } from "firebase/firestore";

import { db, auth, storage } from "@/firebaseConfig"; 


type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

interface Student {
  id: string;
  name: string;
  number: string;
  status: Status;
}

export default function StudentStatusTable() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [openPopover, setOpenPopover] = React.useState<string | null>(null);

  // React.useEffect(() => {
  //   const fetchStudents = async () => {
  //     const querySnapshot = await getDocs(collection(db, "AdmissionEnquiry"));
  //     const data = querySnapshot.docs.map((doc) => {
  //       const enquiry = doc.data();
  //       return {
  //         id: doc.id,
  //         name: `${enquiry.EnquiryFirstName} ${enquiry.EnquiryLastName}`,
  //         number: enquiry.EnquiryPhoneNumber,
  //         status: "new" as Status, // Default status; adjust based on your backend logic
  //       };
  //     });
  //     setStudents(data);
  //   };

  //   fetchStudents();
  // }, []);




React.useEffect(() => {
  const fetchStudents = async () => {
    try {
      // Constructing a Firestore query
      const studentsQuery = query(
        collection(db, "AdmissionEnquiry"),
        where("EnquiryType", "==", "Admission")
      );
      const querySnapshot = await getDocs(studentsQuery);

      // Mapping the query snapshot to the required format
      const data = querySnapshot.docs.map((doc) => {
        const enquiry = doc.data();
        return {
          id: doc.id,
          name: `${enquiry.EnquiryFirstName} ${enquiry.EnquiryLastName}`,
          number: enquiry.EnquiryPhoneNumber,
          status: enquiry.EnquiryStatus as Status, // Use the actual status from the database
        };
      });

      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  fetchStudents();
}, []);


  const handleStatusChange = (id: string, newStatus: Status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
    setOpenPopover(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="overflow-x-auto">
        <Table className="min-w-full border">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left p-4 w-[150px]">Name</TableHead>
              <TableHead className="text-left p-4 w-[100px]">Number</TableHead>
              <TableHead className="text-center p-4 w-[200px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id} className="border-t border-gray-200">
                <TableCell className="p-4 font-medium">{student.name}</TableCell>
                <TableCell className="p-4">{student.number}</TableCell>
                <TableCell className="p-4 text-center">
                  <Popover
                    open={openPopover === student.id}
                    onOpenChange={(isOpen) => setOpenPopover(isOpen ? student.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        className="w-[150px] bg-[#FAFAF8] text-gray-700 border rounded-3xl border-gray-300 hover:bg-gray-100"
                      >
                        {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 space-y-2 w-[200px] border border-gray-300 bg-[#FAFAF8]">
                      {(
                        ["connected", "new", "declined", "pending", "enrolled"] as Status[]
                      )
                        .filter((status) => status !== student.status)
                        .map((status) => (
                          <Button
                            key={status}
                            className="w-full bg-gray-200 rounded-3xl text-gray-700 hover:bg-gray-300"
                            onClick={() => handleStatusChange(student.id, status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
