"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";

type Status = "connected" | "new" | "declined" | "pending" | "enrolled";

interface BusinessEnquiry {
  id: number;
  name: string;
  number: string;
  companyName: string;
  status: Status;
}

const businessEnquiriesData: BusinessEnquiry[] = [
  { id: 1, name: "John Doe", number: "101", companyName: "ABC Corp.", status: "connected" },
  { id: 2, name: "Jane Smith", number: "102", companyName: "XYZ Inc.", status: "new" },
  { id: 3, name: "Sam Wilson", number: "103", companyName: "Samson Enterprises", status: "declined" },
  { id: 4, name: "Nancy Adams", number: "104", companyName: "Tech Solutions", status: "pending" },
  { id: 5, name: "Ethan Hunt", number: "105", companyName: "Mission Enterprises", status: "enrolled" },
];

const getStatusButtonStyle = () => {
  return "bg-[#FAFAF8] text-gray-900 border border-gray-300 px-4 py-1 rounded-full text-sm shadow-sm font-medium w-[150px]";
};

export default function BusinessEnquiryTable() {
  const [enquiries, setEnquiries] = React.useState<BusinessEnquiry[]>(businessEnquiriesData);
  const [openPopover, setOpenPopover] = React.useState<number | null>(null);

  const handleStatusChange = (id: number, newStatus: Status) => {
    setEnquiries((prev) =>
      prev.map((enquiry) =>
        enquiry.id === id ? { ...enquiry, status: newStatus } : enquiry
      )
    );
    setOpenPopover(null);
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <Table className="border-separate">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left w-1/4">Name</TableHead>
            <TableHead className="text-left w-1/4">Number</TableHead>
            <TableHead className="text-left w-1/4">Company Name</TableHead>
            <TableHead className="text-center w-1/4">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enquiries.map((enquiry, index) => (
            <React.Fragment key={enquiry.id}>
              <TableRow className="bg-white rounded-lg">
                <TableCell className="font-medium">{enquiry.name}</TableCell>
                <TableCell>{enquiry.number}</TableCell>
                <TableCell>{enquiry.companyName}</TableCell>
                <TableCell className="text-center">
                  <Popover
                    open={openPopover === enquiry.id}
                    onOpenChange={(isOpen) => setOpenPopover(isOpen ? enquiry.id : null)}
                  >
                    <PopoverTrigger asChild>
                      <Button className={getStatusButtonStyle()} variant="ghost">
                        {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-4 space-y-2 w-48">
                      {(
                        ["connected", "new", "declined", "pending", "enrolled"] as Status[]
                      )
                        .filter((status) => status !== enquiry.status)
                        .map((status) => (
                          <Button
                            key={status}
                            className={getStatusButtonStyle()}
                            onClick={() => handleStatusChange(enquiry.id, status)}
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </Button>
                        ))}
                    </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
              {index < enquiries.length - 1 && (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="w-full border-t border-gray-300"></div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
