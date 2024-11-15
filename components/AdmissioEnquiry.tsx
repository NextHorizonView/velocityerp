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

type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

type ButtonVariant =
  | "outline"
  | "secondary"
  | "destructive"
  | "default"
  | "link"
  | "ghost";

interface Student {
  id: number;
  name: string;
  number: string;
  schoolType: string;
  status: Status;
}

const studentsData: Student[] = [
  {
    id: 1,
    name: "Alice Johnson",
    number: "001",
    schoolType: "High School",
    status: "connected",
  },
  {
    id: 2,
    name: "Bob Smith",
    number: "002",
    schoolType: "Middle School",
    status: "new",
  },
  {
    id: 3,
    name: "Charlie Brown",
    number: "003",
    schoolType: "Elementary",
    status: "declined",
  },
  {
    id: 4,
    name: "Diana Prince",
    number: "004",
    schoolType: "High School",
    status: "pending",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    number: "005",
    schoolType: "Middle School",
    status: "enrolled",
  },
];

const getStatusButtonVariant = (status: Status): ButtonVariant => {
  switch (status) {
    case "connected":
      return "outline";
    case "new":
      return "secondary";
    case "declined":
      return "destructive";
    case "pending":
      return "secondary";
    case "enrolled":
      return "default";
    default:
      return "default";
  }
};

export default function StudentStatusTable() {
  const [students, setStudents] = React.useState<Student[]>(studentsData);
  const [openPopover, setOpenPopover] = React.useState<number | null>(null);

  const handleStatusChange = (id: number, newStatus: Status) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, status: newStatus } : student
      )
    );
    setOpenPopover(null);
  };

  return (
    <div className="container mx-auto py-10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>School Type</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.number}</TableCell>
              <TableCell>{student.schoolType}</TableCell>
              <TableCell className="text-right">
                <Popover
                  open={openPopover === student.id}
                  onOpenChange={(isOpen) =>
                    setOpenPopover(isOpen ? student.id : null)
                  }
                >
                  <PopoverTrigger asChild>
                    <Button
                      className="w-44"
                      variant={getStatusButtonVariant(student.status)}
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-4 space-y-2 w-44">
                    {(
                      [
                        "connected",
                        "new",
                        "declined",
                        "pending",
                        "enrolled",
                      ] as Status[]
                    )
                      .filter((status) => status !== student.status)
                      .map((status) => (
                        <Button
                          key={status}
                          variant={getStatusButtonVariant(status)}
                          className="w-full"
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
  );
}
