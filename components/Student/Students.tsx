'use client'
import React, { useState, useMemo } from 'react';
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
import { IoIosSearch } from "react-icons/io";
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type Student = {
  id: number;
  name: string;
  class: string;
  phone: string;
  email: string;
  gender: "Male" | "Female";
  // Additional fields
  address: string;
  city: string;
  state: string;
  pincode: string;
  religion: string;
};

const ITEMS_PER_PAGE = 8;

export default function Students() {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Jane Cooper",
      class: "VII A",
      phone: "(225) 555-0118",
      email: "jane@microsoft.com",
      gender: "Male",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      pincode: "10001",
      religion: "Christianity"
    },
    {
      id: 2,
      name: "Floyd Miles",
      class: "VIII B",
      phone: "(205) 555-0100",
      email: "floyd@yahoo.com",
      gender: "Female",
      address: "456 Oak St",
      city: "Los Angeles",
      state: "CA",
      pincode: "90001",
      religion: "Islam",
      
    },
    {
      id: 3,
      name: "Ronald Richards",
      class: "IX A",
      phone: "(302) 555-0107",
      email: "ronald@adobe.com",
      gender: "Female",
      address: "789 Pine St",
      city: "Chicago",
      state: "IL",
      pincode: "60601",
      religion: "Hinduism",
      
    },
    {
      id: 4,
      name: "Marvin McKinney",
      class: "X A",
      phone: "(252) 555-0126",
      email: "marvin@tesla.com",
      gender: "Male",
      address: "321 Elm St",
      city: "Houston",
      state: "TX",
      pincode: "77001",
      religion: "Buddhism",
    
    },
    {
      id: 5,
      name: "Jerome Bell",
      class: "VII A",
      phone: "(629) 555-0129",
      email: "jerome@google.com",
      gender: "Male",
      address: "654 Maple St",
      city: "Phoenix",
      state: "AZ",
      pincode: "85001",
      religion: "Christianity",
    
    },
    {
      id: 6,
      name: "Kathryn Murphy",
      class: "VIII B",
      phone: "(406) 555-0120",
      email: "kathryn@microsoft.com",
      gender: "Male",
      address: "987 Cedar St",
      city: "Philadelphia",
      state: "PA",
      pincode: "19101",
      religion: "Islam",  
      
    },
    {
      id: 7,
      name: "Jacob Jones",
      class: "IX A",
      phone: "(208) 555-0112",
      email: "jacob@yahoo.com",
      gender: "Male",
      address: "741 Birch St",
      city: "San Antonio",
      state: "TX",
      pincode: "78201",
      religion: "Judaism",
     
    },
    {
      id: 8,
      name: "Kristin Watson",
      class: "X A",
      phone: "(704) 555-0127",
      email: "kristin@facebook.com",
      gender: "Female",
      address: "852 Walnut St",
      city: "San Diego",
      state: "CA",
      pincode: "92101",
      religion: "Sikhism",
      
    },
    {
      id: 9,
      name: "Kristin Watson",
      class: "VII A",
      phone: "(704) 555-0127",
      email: "kristin@facebook.com",
      gender: "Female",
      address: "963 Oak St",
      city: "Dallas",
      state: "TX",
      pincode: "75201",
      religion: "Christianity",
     
    },
    {
      id: 10,
      name: "Kristin Watson",
      class: "VIII B",
      phone: "(704) 555-0127",
      email: "kristin@facebook.com",
      gender: "Female",
      address: "159 Pine St",
      city: "San Jose",
      state: "CA",
      pincode: "95101",
      religion: "Hinduism",
      
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const handleEdit = (student: Student) => {
    setEditingStudent({ ...student });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (student: Student) => {
    setStudentToDelete(student);
    setIsDeleteDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingStudent) {
      setStudents(students.map(student =>
        student.id === editingStudent.id ? editingStudent : student
      ));
      setIsEditDialogOpen(false);
      setEditingStudent(null);
    }
  };

  const handleConfirmDelete = () => {
    if (studentToDelete) {
      setStudents(students.filter(student => student.id !== studentToDelete.id));
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const handleSort = (key: keyof Student) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  const filteredAndSortedStudents = useMemo(() => {
    return [...students]
      .filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [students, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedStudents.length / ITEMS_PER_PAGE);
  const paginatedStudents = filteredAndSortedStudents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto p-6">
    <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold text-[#576086]">All Students</h1>
          <Button
            variant="ghost"
            size="lg"
            className="w-10 h-10 p-0 bg-transparent border-none">
            <IoIosCloudUpload className="h-10 w-10 text-black" />
          </Button>
        </div>
        <div className="flex items-center space-x-4">
          <Link href='/studentform'>
            <Button
              variant="default"
              className="bg-[#576086] hover:bg-[#474d6b] text-white h-10 px-4 text-sm"
            >
              + Add new Student
            </Button>
          </Link>

          <div className="relative">
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 h-10 pl-10"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <IoIosSearch className="text-gray-500" />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              className="border rounded-md px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#576086] bg-transparent"
              onChange={(e) => handleSort(e.target.value as keyof Student)}
            >
              <option value="name" className="bg-transparent">Newest</option>
              <option value="class" className="bg-transparent">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[#FAFAF8] rounded-lg shadow-sm">
        <Table className="border-b">
          <TableHeader>
            <TableRow className="bg-gray-50 border-b">
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Student Name
              </TableHead>
              <TableHead className="cursor-pointer py-4 text-sm font-medium">
                Class/Div
              </TableHead>
              <TableHead className="py-4 text-sm font-medium">Phone Number</TableHead>
              <TableHead className="py-4 text-sm font-medium">Email</TableHead>
              <TableHead className="py-4 text-sm font-medium">Gender</TableHead>
              <TableHead className="py-4 text-sm font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-gray-50 border-b">
                <TableCell className="py-4">{student.name}</TableCell>
                <TableCell className="py-4">{student.class}</TableCell>
                <TableCell className="py-4">{student.phone}</TableCell>
                <TableCell className="py-4">{student.email}</TableCell>
                <TableCell className="py-4">
                  <div
                    className={`w-20 h-8 flex items-center justify-center rounded-md text-xs font-medium ${
                      student.gender === "Male"
                        ? "bg-transparent text-black"
                        : "bg-transparent text-black"
                    }`}
                  >
                    {student.gender}
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0"
                      onClick={() => handleEdit(student)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-9 h-9 p-0"
                      onClick={() => handleDelete(student)}
                    >
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
          Showing data {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedStudents.length)} of {filteredAndSortedStudents.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-[#F7B696]" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

   
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="max-w-md">
    <DialogHeader>
      <DialogTitle className="text-base">Edit Student Information</DialogTitle>
    </DialogHeader>
    {editingStudent && (
      <div className="grid gap-3 py-2">
        {/* Name */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Name</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.name}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, name: e.target.value })
            }
          />
        </div>

        {/* Class */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Class</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.class}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, class: e.target.value })
            }
          />
        </div>

        {/* Phone */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Phone</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.phone}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, phone: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Email</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.email}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, email: e.target.value })
            }
          />
        </div>

        {/* Gender */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Gender</label>
          <select
            className="border rounded-md px-3 h-6 text-sm"
            value={editingStudent.gender}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                gender: e.target.value as "Male" | "Female",
              })
            }
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Address */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Address</label>
          <textarea
            className="border rounded-md px-3 py-1 h-8 text-sm resize-none"
            value={editingStudent.address}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                address: e.target.value,
              })
            }
          />
        </div>

        {/* City */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">City</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.city}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, city: e.target.value })
            }
          />
        </div>

        {/* State */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">State</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.state}
            onChange={(e) =>
              setEditingStudent({ ...editingStudent, state: e.target.value })
            }
          />
        </div>

        {/* Pincode */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Pincode</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.pincode}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                pincode: e.target.value,
              })
            }
          />
        </div>

        {/* Religion */}
        <div className="grid gap-1">
          <label className="text-sm font-medium">Religion</label>
          <Input
            className="h-6 text-sm"
            value={editingStudent.religion}
            onChange={(e) =>
              setEditingStudent({
                ...editingStudent,
                religion: e.target.value,
              })
            }
          />
        </div>
      </div>
    )}
    <DialogFooter>
      <DialogClose asChild>
        <Button variant="outline" size="sm">
          Cancel
        </Button>
      </DialogClose>
      <Button onClick={handleSaveEdit} size="sm" className="bg-[#576086]">
        Save changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this student? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
    </div>
  );
}