import React, { useState } from "react";
import { mutate } from "swr";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebaseConfig"; // Adjust your Firebase import
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
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
interface FormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: string | number | boolean | undefined;
}
const StudentsTable = ({
  students,
  formFields,
}: {
  students: Student[];
  formFields: FormField[];
}) => {
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  //   const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const [formData, setFormData] = useState<FormData>({});
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData(student);
  };

  //   const handleInputChange = (
  //     fieldName: string,
  //     value: string | number | boolean | undefined
  //   ) => {
  //     setFormData((prev) => ({ ...prev, [fieldName]: value }));
  //   };
  const handleInputChange = (fieldName: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = async () => {
    if (!editingStudent) return;

    try {
      const studentDocRef = doc(db, "students", editingStudent.id.toString());
      await updateDoc(studentDocRef, formData);

      console.log("Student updated successfully!");

      // Re-fetch the data
      mutate("students");

      // Close the modal
      setEditingStudent(null);
      setFormData({});
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };
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

  const handleCancel = () => {
    setEditingStudent(null);
    setFormData({});
  };

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-50 border-b flex justify-between flex-1">
          {formFields.map((field: FormField, index: number) => (
            <TableHead key={index} className=" py-4 text-sm font-medium ">
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
            className="hover:bg-gray-50 border-b flex justify-between flex-1"
          >
            {formFields.map((field, index) => (
              <TableCell key={index} className="py-4 ">
                {student[field.FieldName as keyof Student] || "N/A"}
              </TableCell>
            ))}
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
                  onClick={() => {
                    setSelectedStudent(student);
                    setIsDeleteDialogOpen(true);
                  }}
                >
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
      {/* Edit Modal */}

      <Dialog
        open={!!editingStudent}
        onOpenChange={(open) => !open && handleCancel()}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Student</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="grid gap-4 py-4">
              {formFields.map((field) => (
                <div
                  key={field.FieldName}
                  className="grid grid-cols-4 items-center gap-4"
                >
                  <Label htmlFor={field.FieldName} className="text-right">
                    {field.FieldName}
                  </Label>
                  <Input
                    id={field.FieldName}
                    className="col-span-3"
                    value={
                      typeof formData[field.FieldName] === "boolean"
                        ? formData[field.FieldName]
                          ? "true"
                          : "false"
                        : (formData[field.FieldName] as
                            | string
                            | number
                            | undefined) || ""
                    }
                    onChange={(e) =>
                      handleInputChange(field.FieldName, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Table>
  );
};

export default StudentsTable;
