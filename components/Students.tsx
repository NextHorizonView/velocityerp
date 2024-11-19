"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Plus, ArrowUpDown, Edit, Trash2 } from "lucide-react";

type Student = {
  id: number;
  name: string;
  class: string;
  phone: string;
  grNumber: string;
  gender: "male" | "female";
};

type SortableFields = "name" | "class" | "grNumber";

export default function Students() {
  const [students] = useState<Student[]>([
    {
      id: 1,
      name: "John Doe",
      class: "10A",
      phone: "1234567890",
      grNumber: "GR001",
      gender: "male",
    },
    {
      id: 2,
      name: "Jane Smith",
      class: "9B",
      phone: "2345678901",
      grNumber: "GR002",
      gender: "female",
    },
    {
      id: 3,
      name: "Mike Johnson",
      class: "11C",
      phone: "3456789012",
      grNumber: "GR003",
      gender: "male",
    },
    {
      id: 4,
      name: "Emily Brown",
      class: "8A",
      phone: "4567890123",
      grNumber: "GR004",
      gender: "female",
    },
    {
      id: 5,
      name: "David Lee",
      class: "12B",
      phone: "5678901234",
      grNumber: "GR005",
      gender: "male",
    },
    {
      id: 6,
      name: "Sarah Wilson",
      class: "10C",
      phone: "6789012345",
      grNumber: "GR006",
      gender: "female",
    },
    {
      id: 7,
      name: "Tom Taylor",
      class: "9A",
      phone: "7890123456",
      grNumber: "GR007",
      gender: "male",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      class: "11B",
      phone: "8901234567",
      grNumber: "GR008",
      gender: "female",
    },
    {
      id: 9,
      name: "Chris Martin",
      class: "8C",
      phone: "9012345678",
      grNumber: "GR009",
      gender: "male",
    },
    {
      id: 10,
      name: "Emma Davis",
      class: "12A",
      phone: "0123456789",
      grNumber: "GR010",
      gender: "female",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortableFields>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const filteredAndSortedStudents = useMemo(() => {
    return students
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm) ||
          student.grNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
  }, [students, searchTerm, sortBy, sortOrder]);

  const handleSort = (column: SortableFields) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All Students</h1>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
        <Button variant="outline" size="icon">
          <Upload className="h-4 w-4" />
          <span className="sr-only">Upload</span>
        </Button>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
          <Button className="bg-gray-400">
            <Plus className="h-4 w-4 mr-2 " />
            Add New Student
          </Button>
          <div className="flex w-full sm:w-auto">
            <Input
              placeholder="Search student"
              className="mr-2"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={sortBy}
              onValueChange={(value: SortableFields) => setSortBy(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="grNumber">GR Number</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer w-1/4"
                onClick={() => handleSort("name")}
              >
                Student Name{" "}
                {sortBy === "name" && (
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                )}
              </TableHead>
              <TableHead
                className="cursor-pointer w-1/6"
                onClick={() => handleSort("class")}
              >
                Class/Div{" "}
                {sortBy === "class" && (
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="w-1/6">Phone No</TableHead>
              <TableHead
                className="cursor-pointer w-1/6"
                onClick={() => handleSort("grNumber")}
              >
                GR Number{" "}
                {sortBy === "grNumber" && (
                  <ArrowUpDown className="inline ml-2 h-4 w-4" />
                )}
              </TableHead>
              <TableHead className="w-1/12">Gender</TableHead>
              <TableHead className="w-1/6">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="h-[400px] overflow-y-auto">
            {filteredAndSortedStudents.length > 0 ? (
              filteredAndSortedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.class}</TableCell>
                  <TableCell>{student.phone}</TableCell>
                  <TableCell>{student.grNumber}</TableCell>
                  <TableCell>
                    <Button
                      variant={
                        student.gender === "male" ? "green" : "destructive"
                      }
                      className="w-20"
                    >
                      {student.gender === "male" ? "Male" : "Female"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-[400px] text-center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
