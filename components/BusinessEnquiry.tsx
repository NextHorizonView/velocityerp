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

interface BusinessEnquiry {
  id: number;
  name: string;
  number: string;
  companyName: string;
  status: Status;
}

const businessEnquiries: BusinessEnquiry[] = [
  {
    id: 1,
    name: "John Doe",
    number: "101",
    companyName: "ABC Corp.",
    status: "connected",
  },
  {
    id: 2,
    name: "Jane Smith",
    number: "102",
    companyName: "XYZ Inc.",
    status: "new",
  },
  {
    id: 3,
    name: "Sam Wilson",
    number: "103",
    companyName: "Samson Enterprises",
    status: "declined",
  },
  {
    id: 4,
    name: "Nancy Adams",
    number: "104",
    companyName: "Tech Solutions",
    status: "pending",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    number: "105",
    companyName: "Mission Enterprises",
    status: "enrolled",
  },
];

const getStatusButtonVariant = (status: Status) => {
  switch (status) {
    case "connected":
      return "outline";
    case "new":
      return "secondary";
    case "declined":
      return "destructive";
    case "pending":
      return "secondary"; // or any other variant you prefer
    case "enrolled":
      return "default";
    default:
      return "default";
  }
};

export default function BusinessEnquiryTable() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Business Enquiries</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businessEnquiries.map((enquiry) => (
            <TableRow key={enquiry.id}>
              <TableCell className="font-medium">{enquiry.name}</TableCell>
              <TableCell>{enquiry.number}</TableCell>
              <TableCell>{enquiry.companyName}</TableCell>
              <TableCell className="text-right">
                <Button variant={getStatusButtonVariant(enquiry.status)}>
                  {enquiry.status.charAt(0).toUpperCase() +
                    enquiry.status.slice(1)}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
