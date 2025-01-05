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
import useSWR from "swr";
import { fetchEnquiryDetails, Student ,Status} from "@/components/helper/firebaseHelper";
import { db } from "@/lib/firebaseConfig";
import { doc,updateDoc } from "firebase/firestore";

export default function StudentStatusTable() {
  const [openPopover, setOpenPopover] = React.useState<string | null>(null);

 
  const userId = React.useMemo(() => {
    const storedUserId = localStorage.getItem("userId");
    return storedUserId || null;
  }, []);

  const { data: students, error, mutate } = useSWR<Student[]>(
    userId ? `Admission-${userId}` : null, 
    () => (userId ? fetchEnquiryDetails("Admission", userId) : Promise.resolve([])) 
  );



  const handleStatusChange = async (id: string, newStatus: Status) => {
    if (!students) return;

    const updatedStudents = students.map((student) =>
      student.id === id ? { ...student, status: newStatus } : student
    );

    mutate(updatedStudents, false); 

    try {
      const studentRef = doc(db, "AdmissionEnquiry", id); 
      await updateDoc(studentRef, {
        EnquiryStatus: newStatus, 
      });
      console.log("Student status updated successfully in Firestore");
    } catch (error) {
      console.error("Error updating student status in Firestore:", error);
      
      mutate(); 
    }

    setOpenPopover(null);
  };

  if (error) {
    return <div>Error fetching data</div>;
  }

  if (!students) {
    return <div>Loading...</div>;
  }

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
                    onOpenChange={(isOpen) =>
                      setOpenPopover(isOpen ? student.id : null)
                    }
                  >
                    <PopoverTrigger asChild>
                      <Button className="w-[150px] bg-[#FAFAF8] text-gray-700 border rounded-3xl border-gray-300 hover:bg-gray-100">
                        {student.status.charAt(0).toUpperCase() +
                          student.status.slice(1)}
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
                            onClick={() =>
                              handleStatusChange(student.id, status)
                            }
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
