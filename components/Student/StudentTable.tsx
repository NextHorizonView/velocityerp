"use client";
import React, { useState } from "react";
import { mutate } from "swr";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Student } from "./Students";
import { FormField } from "../helper/firebaseHelper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import Link from "next/link";

interface StudentsTableProps {
  students: Student[];
  formFields: FormField[];
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  students,
  formFields,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const handleDelete = async (student: Student) => {
    try {
      const studentDocRef = doc(db, "students", student.id.toString());

      // Check if the document exists
      const studentDocSnap = await getDoc(studentDocRef);
      if (!studentDocSnap.exists()) {
        throw new Error(`Student with ID ${student.id} does not exist`);
      }

      // Delete the document
      await deleteDoc(studentDocRef);
      mutate("students");
      console.log(`Student with ID ${student.id} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  return (
    <Table className="border-b">
      <TableHeader>
        <TableRow className="bg-gray-50">
          {formFields.map((field: FormField, index: number) => (
            <TableHead key={index} className="py-4 text-sm font-medium">
              {field.FieldName}
            </TableHead>
          ))}
          <TableHead className="py-4 text-sm font-medium">Action</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {students.map((student) => (
          <TableRow
            key={student.id}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            {formFields.map((field, index) => (
              <TableCell
                key={index}
                className="py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {student[field.FieldName as keyof Student] || "N/A"}
              </TableCell>
            ))}
            <TableCell className="py-4 whitespace-nowrap text-sm text-gray-900">
              <div className="flex space-x-2">
                <Link href={`/editstudent/${student.id}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    // onClick={() => handleEdit(student.id.toString())} // Safely call handleEdit
                  >
                    <span className="sr-only">Edit Field</span>
                    <Edit className="h-4 w-4" />
                  </Button>
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0"
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <span className="sr-only">Delete</span>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {isDeleteDialogOpen && (
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Student</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this student? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedStudent) {
                    handleDelete(selectedStudent);
                    setIsDeleteDialogOpen(false);
                  }
                }}
                className="bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Table>
  );
};

export default StudentsTable;
