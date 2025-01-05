"use client";
import React, { useState } from "react";
import { mutate } from "swr";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
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

export type Teacher = {
  id: number;
  name?: string;
  class?: string;
  phone?: string;
  email?: string;
  gender?: "Male" | "Female";
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  religion?: string;
  studentId?: string;
};
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();

interface TeachersTableProps {
  teachers: Teacher[];
  formFields: FormField[];
}
const TeachersTable: React.FC<TeachersTableProps> = ({
  teachers,
  formFields,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const handleDelete = async (teacher: Teacher) => {
    try {
      const teacherDocRef = doc(db, "teachers", teacher.id.toString());

      // Check if the document exists
      const teacherDocSnap = await getDoc(teacherDocRef);
      if (!teacherDocSnap.exists()) {
        throw new Error(`Teacher with ID ${teacher.id} does not exist`);
      }

      // Delete the document
      await deleteDoc(teacherDocRef);
      mutate("teachers");
      console.log(`Teacher with ID ${teacher.id} deleted successfully!`);
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
        {teachers.map((teacher) => (
          <TableRow
            key={teacher.id}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            {formFields.map((field, index) => (
              <TableCell
                key={index}
                className="py-4 whitespace-nowrap text-sm text-gray-900"
              >
                {teacher[field.FieldName as keyof Teacher] || "N/A"}
              </TableCell>
            ))}
            <TableCell className="py-4 whitespace-nowrap text-sm text-gray-900">
              <div className="flex space-x-2">
                <Link href={`/editteacher/${teacher.id}`} passHref>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-8 h-8 p-0"
                    // onClick={() => handleEdit(teacher.id.toString())} // Safely call handleEdit
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
                    setSelectedTeacher(teacher);
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
              <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this Teacher? This action cannot
                be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedTeacher) {
                    handleDelete(selectedTeacher);
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
export default TeachersTable;
