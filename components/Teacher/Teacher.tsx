"use client";

import React, { useState, useMemo } from "react";
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
import { Edit, Trash2 } from "lucide-react";
import { IoIosCloudUpload } from "react-icons/io";
import Link from "next/link";

type Teacher = {
  id: number;
  name: string;
  class: string;
  phone: string;
  grNumber: string;
  gender: "male" | "female";
};
// const fetchTeacher = async () => {
//   const querySnapshot = await getDocs(collection(db, "teachers"));
//   return querySnapshot.docs.map(
//     (doc) => ({ id: doc.id, ...doc.data() } as unknown as Teacher)
//   );
// };

const ITEMS_PER_PAGE = 8;

export default function Teachers() {
  const [teachers] = useState<Teacher[]>([
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

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Teacher;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const handleSort = (key: keyof Teacher) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc"
          ? "desc"
          : "asc",
    });
  };

  const filteredAndSortedTeachers = useMemo(() => {
    return [...teachers]
      .filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          teacher.phone.includes(searchTerm) ||
          teacher.grNumber.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
  }, [teachers, searchTerm, sortConfig]);

  const totalPages = Math.ceil(
    filteredAndSortedTeachers.length / ITEMS_PER_PAGE
  );
  const paginatedTeachers = filteredAndSortedTeachers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">All Teachers</h1>
          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none"
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
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#576086]"
              onChange={(e) => handleSort(e.target.value as keyof Teacher)}
            >
              <option value="name">Newest</option>
              <option value="class">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAF8] rounded-lg shadow-sm">
        <Table className="border-b  ">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Teacher Name
              </TableHead>
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Class/Div
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">
                Phone Number
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">
                GR Number
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">Gender</TableHead>
              <TableHead className="py-4 text-sm font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTeachers.map((teacher) => (
              <TableRow key={teacher.id} className="hover:bg-gray-50">
                <TableCell className="py-4">{teacher.name}</TableCell>
                <TableCell className="py-4">{teacher.class}</TableCell>
                <TableCell className="py-4">{teacher.phone}</TableCell>
                <TableCell className="py-4">{teacher.grNumber}</TableCell>
                <TableCell className="py-4">
                  <div
                    className={`w-20 h-8 flex items-center justify-center rounded-md text-xs font-medium ${
                      teacher.gender === "male"
                        ? "bg-[#86efac] text-[#166534]"
                        : "bg-[#fca5a5] text-[#991b1b]"
                    }`}
                  >
                    {teacher.gender === "male" ? "Male" : "Female"}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

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
    </div>
  );
}
