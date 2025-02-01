"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();
import {  doc, getDoc, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import FadeLoader from "../Loader";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { collection, getDocs } from "firebase/firestore";
import { fetchClassDataById } from "../helper/firebaseHelper";
import { Button } from "../ui/button";

interface EditClassFormProps {
  classid: string;
}

interface Teacher {
  id: string;
  name: string;
  position?: string;
}

interface Student {
  StudentId: string;
  StudentName: string;
}

interface ClassTeacherMap {
  id: string;
  "First Name": string;
  "Last Name": string;
  Position: string;
  City: string;
}

const EditClass: React.FC<EditClassFormProps> = ({ classid }) => {
  const router = useRouter();
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);
  const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherPosition, setNewTeacherPosition] = useState("");
  const [newStudentName, setNewStudentName] = useState("");
  const [Teachers, setTeachers] = useState<Teacher>({ id: "", name: "", position: "" });
  const [classData, setClassData] = useState<{
    ClassId: string;
    ClassName: string;
    ClassDivision: string;
    ClassTeacherId: ClassTeacherMap[];
    ClassStudentList: Student[];
    ClassCreatedAt?: Timestamp;
    ClassYear?: string;
  }>({ ClassId: "", ClassName: "", ClassDivision: "", ClassYear: "", ClassTeacherId: [], ClassStudentList: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (classid) {
      const fetchClassData = async () => {
        setLoading(true);
        try {
          const classData = await fetchClassDataById(classid);
          const teacherIds = classData.ClassTeacherId || [];
          const teacherPromises = teacherIds.map((teacherId: string) =>
            getDoc(doc(db, "teachers", teacherId))
          );
          const teacherDocs = await Promise.all(teacherPromises);
          const teachers = teacherDocs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Fetch students from the StudentsList array
          const studentsList = classData.StudentsList || [];
          const students = studentsList.map((student: { StudentId: string, StudentName: string }) => ({
            StudentId: student.StudentId,
            StudentName: student.StudentName,
          }));

          setClassData({
            ClassId: classid,
            ClassName: classData.ClassName || "",
            ClassDivision: classData.ClassDivision || "",
            ClassYear: classData.ClassYear || "",
            ClassTeacherId: teachers,
            ClassStudentList: students, // Set the fetched students
            ClassCreatedAt: classData.ClassCreatedAt || "",
          });
        } catch (error) {
          console.error("Error fetching class data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchClassData();
    }
  }, [classid]);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const fetchedTeachers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data()["First Name"],
          position: doc.data()["Position"],
        }));
        console.log("Teacher to add:", Teachers);
        setSelectedTeachers(fetchedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    const fetchStudents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "students"));
        const fetchedStudents = querySnapshot.docs.map((doc) => ({
          StudentId: doc.id, // Use StudentId
          StudentName: doc.data()["First Name"], // Use the `name` field directly
        }));
        console.log("Fetched Students:", fetchedStudents);
        setSelectedStudents(fetchedStudents);
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchTeachers();
    fetchStudents();
  }, []);

  const handleRemoveNewTeacher = (index: number) => {
    setSelectedTeachers((prevSelectedTeachers) =>
      prevSelectedTeachers.filter((_, i) => i !== index)
    );
  };

  const handleRemoveOtherTeacher = (index: number | string) => {
    setClassData((prevClassData) => ({
      ...prevClassData,
      ClassTeacherId: prevClassData.ClassTeacherId.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveStudent = (index: number | string) => {
    setClassData((prevClassData) => ({
      ...prevClassData,
      ClassStudentList: prevClassData.ClassStudentList.filter((_, i) => i !== index),
    }));
  };

  const handleAddTeacher = async () => {
    if (!newTeacherName || !newTeacherPosition) {
      alert("Please select a teacher and enter a position!");
      return;
    }

    const teacherToAdd = selectedTeachers.find(
      (teacher) => teacher.name === newTeacherName
    );

    if (!teacherToAdd) {
      alert("Selected teacher not found!");
      return;
    }
    const teacherRef = doc(db, "teachers", teacherToAdd.id);
    await updateDoc(teacherRef, {
      name: teacherToAdd.name,
      Position: newTeacherPosition || "Default Position",
    });

    setTeachers({
      id: teacherToAdd.id,
      name: teacherToAdd.name,
      position: newTeacherPosition || "Default Position",
    });

    setClassData((prevClassData) => ({
      ...prevClassData,
      ClassTeacherId: [
        ...prevClassData.ClassTeacherId,
        {
          id: teacherToAdd.id,
          "First Name": teacherToAdd.name,
          "Last Name": teacherToAdd.name,
          Position: newTeacherPosition,
          City: "",
        },
      ],
    }));
    setTeachers(
      {
        id: teacherToAdd.id,
        name: teacherToAdd.name,
        position: newTeacherPosition,
      });

    setNewTeacherName("");
    setNewTeacherPosition("");
    setIsAddTeacherModalOpen(false);
  };

  const handleAddStudent = async () => {
    if (!newStudentName) {
      alert("Please select a student!");
      return;
    }
  
    const studentToAdd = selectedStudents.find(
      (student) => student.StudentName === newStudentName
    );
  
    if (!studentToAdd) {
      alert("Selected student not found!");
      return;
    }
  
    setClassData((prevClassData) => ({
      ...prevClassData,
      ClassStudentList: [
        ...prevClassData.ClassStudentList,
        {
          StudentId: studentToAdd.StudentId, // Use StudentId
          StudentName: studentToAdd.StudentName, // Use StudentName
        },
      ],
    }));
  
    setNewStudentName("");
    setIsAddStudentModalOpen(false);
  };
  const handleUpdate = async () => {
    try {
      setLoading(true);

      if (!classid) {
        throw new Error("Class ID is not defined");
      }

      const classesRef = doc(db, "classes", classid?.toString());
      const docSnapshot = await getDoc(classesRef);

      if (!docSnapshot.exists()) {
        throw new Error("Class not found!");
      }

      const existingData = docSnapshot.data();

      const classTeacherIds = classData.ClassTeacherId.map(teacher => teacher.id);
      const classStudentList = classData.ClassStudentList.map(student => ({
        StudentId: student.StudentId,
        StudentName: student.StudentName,
      }));

      const updatedClassData = {
        ClassName: classData.ClassName || existingData?.ClassName || "",
        ClassDivision: classData.ClassDivision || existingData?.ClassDivision || "",
        ClassYear: classData.ClassYear || existingData?.ClassYear || "",
        ClassTeacherId: classTeacherIds,
        StudentsList: classStudentList, // Update StudentsList
        ClassCreatedAt: existingData?.ClassCreatedAt,
        ClassUpdatedAt: serverTimestamp(),
      };

      await updateDoc(classesRef, updatedClassData);

      setClassData({ ClassId: classid, ClassName: "", ClassDivision: "", ClassYear: "", ClassTeacherId: [], ClassStudentList: [] });
      router.push("/class");

      alert("Class updated successfully!");
    } catch (error) {
      console.error("Error updating class: ", error);
      alert("Failed to update class. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTeachers = selectedTeachers.filter((teacher) =>
    teacher?.name?.toLowerCase().includes(newTeacherName?.toLowerCase() || "")
  );

  const filteredStudents = selectedStudents.filter((student) =>
    student?.StudentName?.toLowerCase().includes(newStudentName?.toLowerCase() || "")
  );

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <FadeLoader />
        </div>
      )}

      <div className="p-6 rounded-md">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
            <MdEdit size={18} />
            <span className="text-sm font-bold">Edit Class</span>
          </button>
        </div>

        {/* Title Section */}
        <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
          Edit Class Details
        </h2>

        {/* Input Section */}
        <div className="mb-6 px-6">
          <label
            htmlFor="className"
            className="block font-medium mb-2 text-gray-700"
          >
            Class Name
          </label>
          <input
            type="text"
            id="className"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            placeholder="Enter Class Name"
            value={classData.ClassName}
            onChange={(e) =>
              setClassData({ ...classData, ClassName: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-6 px-6">
          <label
            htmlFor="classDivision"
            className="block font-medium mb-2 text-gray-700"
          >
            Class Division
          </label>
          <input
            type="text"
            id="classDivision"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            placeholder="Enter Class Division"
            value={classData.ClassDivision}
            onChange={(e) =>
              setClassData({ ...classData, ClassDivision: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-6 px-6">
          <label
            htmlFor="classYear"
            className="block font-medium mb-2 text-gray-700"
          >
            Class Year
          </label>
          <input
            type="text"
            id="classYear"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            placeholder="Enter Class Year"
            value={classData.ClassYear}
            onChange={(e) =>
              setClassData({ ...classData, ClassYear: e.target.value })
            }
            required
          />
        </div>

        {/* Class teachers section */}
        <div className="mb-6 px-6 pt-11">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Class Teachers
            </h3>
            <button
              className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b] focus:outline-none"
              onClick={() => setIsAddTeacherModalOpen(true)}
            >
              Add Teacher
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead></thead>
            <tbody>
              {classData.ClassTeacherId.map((teacher, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <div className="flex items-center text-gray-500">
                      <TbGridDots size={20} />
                    </div>
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <AiOutlineUser size={20} className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {teacher["First Name"]}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    <span className="font-medium text-gray-700">
                      {teacher.Position}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none m-2"
                      onClick={() =>
                        handleRemoveOtherTeacher(index)
                      } // Edit teacher action
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {selectedTeachers.length > 0 && (
            <>
              <div className="mb-6 pt-11">

                <div className="flex items-center space-x-2 mb-4">

                  <h3 className="text-lg font-medium text-[#666666] ">Subject Teachers</h3>
                  <Button className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b]">
                    Subject Teacher
                  </Button>
                </div>
              </div>
              <table className="w-full text-left border-collapse max-h-52 overflow-scroll overflow-x-hidden">
                <thead></thead>
                <tbody>
                  {selectedTeachers.map((teacher, index) => (
                    <tr key={index} className="border-b hover:bg-gray-100">
                      <td className="p-3">
                        <div className="flex items-center text-gray-500">
                          <TbGridDots size={20} />
                        </div>
                      </td>
                      <td className="p-3 flex items-center space-x-2">
                        <AiOutlineUser size={20} className="text-gray-500" />
                        <span className="font-medium text-gray-700">
                          {teacher.name}
                        </span>
                      </td>
                      <td className="p-3 text-gray-500">
                        {teacher.position}
                      </td>
                      <td className="p-3">
                        <button
                          className="text-gray-500 hover:text-gray-700 focus:outline-none"
                          onClick={() => handleRemoveNewTeacher(index)}
                        >
                          <AiOutlineClose size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>

        {/* Class students section */}
        <div className="mb-6 px-6 pt-11">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-lg font-medium text-gray-700">
              Class Students
            </h3>
            <button
              className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b] focus:outline-none"
              onClick={() => setIsAddStudentModalOpen(true)}
            >
              Add Student
            </button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead></thead>
            <tbody>
              {classData.ClassStudentList.map((student, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">
                    <div className="flex items-center text-gray-500">
                      <TbGridDots size={20} />
                    </div>
                  </td>
                  <td className="p-3 flex items-center space-x-2">
                    <AiOutlineUser size={20} className="text-gray-500" />
                    <span className="font-medium text-gray-700">
                      {student.StudentName} {/* Use StudentName */}
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none m-2"
                      onClick={() => handleRemoveStudent(index)}
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isAddTeacherModalOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
            <div className="bg-white p-6 rounded-md w-full max-w-md">
              {/* Modal Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">
                  Add Teacher
                </h2>
                <button
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setIsAddTeacherModalOpen(false)}
                >
                  <AiOutlineClose size={20} />
                </button>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  className="w-full px-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                  placeholder="Find Teacher"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                />
              </div>

              {newTeacherName.length > 0 && filteredTeachers.length > 0 ? (
                <>
                  <p className="font-medium text-gray-700 mb-2">
                    Select a Teacher:
                  </p>
                  <div className="mb-4 bg-gray-50 p-1 rounded-lg shadow max-h-52 overflow-scroll overflow-x-hidden">
                    {filteredTeachers.map((teacher) => (
                      <div
                        key={teacher.id}
                        className="cursor-pointer hover:bg-gray-200 bg-white p-2 m-2 rounded-md"
                        onClick={() =>
                          setNewTeacherName(teacher.name)
                        }
                      >
                        {teacher.name}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="font-medium text-gray-700 mb-2 bg-gray-50 p-2 rounded-full text-center">
                  Sorry, No teacher found Named = &quot;{`${newTeacherName}`}{" "}
                  &quot;
                </p>
              )}

              {/* Add Teacher Form */}
              <div className="mb-6">
                <input
                  type="text"
                  className="w-full px-4 py-3 mb-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#576086]"
                  placeholder="Enter Position for Selected Teacher"
                  value={newTeacherPosition}
                  onChange={(e) => setNewTeacherPosition(e.target.value)}
                />
                <button
                  className="bg-[#576086] mx-auto my-5 text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
                  onClick={handleAddTeacher}
                >
                  Add Teacher
                </button>
              </div>

              {/* Selected Teacher List */}
              <div className="space-y-4 max-h-44 overflow-scroll overflow-x-hidden">
                {selectedTeachers.map((teacher, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <AiOutlineUser size={28} className="text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-700">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {teacher.position}
                        </p>
                      </div>
                    </div>
                    <button
                      className="text-gray-500 hover:text-gray-700 focus:outline-none"
                      onClick={() => {
                        setSelectedTeachers((prev) =>
                          prev.filter((_, i) => i !== index)
                        );
                      }}
                    >
                      <AiOutlineClose size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

{isAddStudentModalOpen && (
  <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
    <div className="bg-white p-6 rounded-md w-full max-w-md">
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-700">
          Add Student
        </h2>
        <button
          className="text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setIsAddStudentModalOpen(false)}
        >
          <AiOutlineClose size={20} />
        </button>
      </div>

      {/* Search Input */}
      <div className="relative mb-6">
        <AiOutlineSearch className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          className="w-full px-10 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Find Student"
          value={newStudentName}
          onChange={(e) => setNewStudentName(e.target.value)}
        />
      </div>

      {newStudentName.length > 0 && filteredStudents.length > 0 ? (
        <>
          <p className="font-medium text-gray-700 mb-2">
            Select a Student:
          </p>
          <div className="mb-4 bg-gray-50 p-1 rounded-lg shadow max-h-52 overflow-scroll overflow-x-hidden">
            {filteredStudents.map((student) => (
              <div
                key={student.StudentId} // Use StudentId as the key
                className="cursor-pointer hover:bg-gray-200 bg-white p-2 m-2 rounded-md"
                onClick={() => setNewStudentName(student.StudentName)}
              >
                {student.StudentName} {/* Use StudentName */}
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="font-medium text-gray-700 mb-2 bg-gray-50 p-2 rounded-full text-center">
          Sorry, No student found Named = &quot;{`${newStudentName}`}&quot;
        </p>
      )}

      {/* Add Student Form */}
      <div className="mb-6">
        <button
          className="bg-[#576086] mx-auto my-5 text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
          onClick={handleAddStudent}
        >
          Add Student
        </button>
      </div>

      {/* Selected Student List */}
      <div className="space-y-4 max-h-44 overflow-scroll overflow-x-hidden">
        {selectedStudents.map((student, index) => (
          <div
            key={index}
            className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <AiOutlineUser size={28} className="text-gray-500" />
              <div>
                <p className="font-medium text-gray-700">
                  {student.StudentName}
                </p>
              </div>
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                setSelectedStudents((prev) =>
                  prev.filter((_, i) => i !== index)
                );
              }}
            >
              <AiOutlineClose size={20} />
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)}

        <div>
          <button
            onClick={handleUpdate}
            className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
          >
            Save
          </button>
        </div>
      </div>
    </>
  );
};

export default EditClass;