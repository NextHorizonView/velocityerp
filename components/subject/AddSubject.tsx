"use client";
import React, { useState, useEffect } from "react";
import {
  AiOutlineClose,
  AiOutlineFileText,
  AiOutlineSearch,
  AiOutlineUser,
} from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db, storage } from "@/lib/firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

interface Teacher {
  id: string;
  name: string;
}
interface SelectedTeacher {
  id: string;
  name: string;
  position: string;
}

const AddSubject: React.FC = () => {
  const [SubjectName, setSubjectName] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeachers, setSelectedTeachers] = useState<SelectedTeacher[]>(
    []
  );
  const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherPosition, setNewTeacherPosition] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "teachers"));
        const fetchedTeachers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data()["First Name"],
        }));

        setTeachers(fetchedTeachers);
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const subjectData = {
      SubjectName,
      teachers: selectedTeachers,
    };
    console.log(subjectData);
    try {
      const subjectsRef = collection(db, "subjects");
      const q = query(subjectsRef, where("subject", "==", SubjectName));
      const querySnapshot = await getDocs(q);
      if (!selectedFile) {
        alert("Please select a file to upload!");
        return;
      }
      const storageRef = ref(storage, `subjectfile/${selectedFile.name}`);
      const uploadTask = uploadBytesResumable(storageRef, selectedFile);
      if (!querySnapshot.empty) {
        // const docRef = querySnapshot.docs[0].ref;
        const existingTeachers =
          querySnapshot.docs[0].data().assignedTeachers || [];

        const updatedTeachers = [
          ...existingTeachers,
          ...teachers.filter(
            (newTeacher) =>
              !existingTeachers.some(
                (t: { id: string }) => t.id === newTeacher.id
              )
          ),
        ];

        await updateDoc(querySnapshot.docs[0].ref, {
          assignedTeachers: updatedTeachers,
          subjectId: querySnapshot.docs[0].data().subjectId,
        });

        alert("Subject updated successfully!");
      } else {
        await addDoc(subjectsRef, {
          ...subjectData,
        });
        // Upload file to storage
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Upload failed:", error);
            alert("File upload failed. Please try again.");
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at:", downloadURL);
            alert("File uploaded successfully!");
          }
        );
        alert("Subject added successfully!");
      }

      setSubjectName("");
      setSelectedFile(null);
      setSelectedTeachers([]);
    } catch (error) {
      console.error("Error handling subject: ", error);
      alert("Failed to handle subject. Please try again.");
    }
  };

  const filteredTeachers = teachers.filter((teacher) =>
    teacher?.name?.toLowerCase().includes(newTeacherName?.toLowerCase() || "")
  );

  const handleAddTeacher = () => {
    if (!newTeacherName || !newTeacherPosition) {
      alert("Please select a teacher and enter a position!");
      return;
    }

    const teacherToAdd = teachers.find(
      (teacher) => teacher.name === newTeacherName
    );

    if (!teacherToAdd) {
      alert("Selected teacher not found!");
      return;
    }

    setSelectedTeachers([
      ...selectedTeachers,
      {
        id: teacherToAdd.id,
        name: teacherToAdd.name,
        position: newTeacherPosition,
      },
    ]);
    setNewTeacherName("");
    setNewTeacherPosition("");
  };

  return (
    <div className="p-6 rounded-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Add Student</span>
        </button>
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Edit Student Form</span>
        </button>
      </div>

      {/* Title Section */}
      <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
        Please enter Subject Details
      </h2>

      {/* Input Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="SubjectName"
          className="block font-medium mb-2 text-gray-700"
        >
          Subject Name
        </label>
        <input
          type="text"
          id="SubjectName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter First Name"
          value={SubjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          required
        />
      </div>

      {/* File Upload Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="fileUpload"
          className="block font-medium mb-2 text-gray-700"
        >
          Upload Subject File
        </label>
        <input
          type="file"
          id="fileUpload"
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          onChange={handleFileChange}
        />
        {selectedFile && (
          <div className="mt-2">
            {/* Display file preview if it's an image */}
            {selectedFile.type.startsWith("image/") ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="File Preview"
                className="w-32 h-32 object-cover rounded-md"
              />
            ) : (
              <div className="flex items-center space-x-2">
                <AiOutlineFileText size={24} className="text-gray-500" />
                <span className="text-sm text-gray-500">Selected File:</span>
                <span className="font-semibold">{selectedFile.name}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject teachers section */}
      <div className="mb-6 px-6 pt-11 ">
        <div className="flex items-center space-x-3 mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Subject Teachers
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
                <td className="p-3 text-gray-500">{teacher.position}</td>
                <td className="p-3">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() =>
                      setSelectedTeachers(
                        selectedTeachers.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Teacher Modal */}
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

            {/* Filtered Teacher List */}
            {filteredTeachers.length > 0 ? (
              <>
                <p className="font-medium text-gray-700 mb-2">
                  Select a Teacher:
                </p>
                <div className="mb-4 bg-gray-50 p-1 rounded-lg shadow  max-h-52 overflow-scroll overflow-x-hidden">
                  {filteredTeachers.map((teacher) => (
                    <div
                      key={teacher.id}
                      className="cursor-pointer hover:bg-gray-200 bg-white p-2 m-2 rounded-md"
                      onClick={() => setNewTeacherName(teacher.name)}
                    >
                      {teacher.name}
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="font-medium text-gray-700 mb-2 bg-gray-50 p-2 rounded-full  text-center">
                Sorry, No teacher found
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
            <div className="space-y-4">
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
                    onClick={() =>
                      setSelectedTeachers((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    <AiOutlineClose size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <div className="flex justify-between space-x-4 mt-20">
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none">
          Cancel
        </button>
        <button className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none">
          Next
        </button>
        <button
          onClick={handleSubmit}
          className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default AddSubject;
