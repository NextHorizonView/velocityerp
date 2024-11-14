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

const students: Student[] = [
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
      return "secondary"; // Changed to 'secondary' or another valid variant
    case "enrolled":
      return "default";
    default:
      return "default"; // In case of any undefined status
  }
};

export default function StudentStatusTable() {
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
                <Button variant={getStatusButtonVariant(student.status)}>
                  {student.status.charAt(0).toUpperCase() +
                    student.status.slice(1)}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
