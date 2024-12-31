"use client";
import React, { useEffect, useState } from "react";
import {
  AiOutlineClose,
  AiOutlineFileText,
  AiOutlineUser,
} from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { fetchSubjectDataById } from "../helper/firebaseHelper";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

interface EditSubjectFormProps {
  subjectid: string;
}

const EditSubject: React.FC<EditSubjectFormProps> = ({ subjectid }) => {
  console.log(subjectid);
  const router = useRouter();

  const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherPosition, setNewTeacherPosition] = useState("");
  const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<
    number | null
  >(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [subjectData, setSubjectData] = useState<{
    name: string;
    teachers: { id: string; name: string; position: string }[];
  }>({ name: "", teachers: [] });

  useEffect(() => {
    if (subjectid) {
      const fetchSubjectData = async () => {
        try {
          const subjectData = await fetchSubjectDataById(subjectid); // Fetch data based on studentid
          console.log(subjectData, "Fetched subjectData Data");

          setSubjectData({
            ...subjectData,
            name: subjectData.SubjectName || "",
            teachers:
              subjectData.teachers.map(
                (teacher: { id: string; name: string; position: string }) => ({
                  id: teacher.id || "",
                  name: teacher.name,
                  position: teacher.position,
                })
              ) || [],
          });
        } catch (error) {
          console.error("Error fetching student data:", error);
        }
      };

      fetchSubjectData();
    }
  }, [subjectid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleEditTeacher = (index: number) => {
    const teacher = subjectData.teachers[index];
    setSelectedTeacherIndex(index);
    setNewTeacherName(teacher.name);
    setNewTeacherPosition(teacher.position);
    setIsEditTeacherModalOpen(true); // Open modal for editing
  };

  const handleSaveTeacher = () => {
    if (selectedTeacherIndex !== null) {
      const updatedTeachers = subjectData.teachers.map((teacher, index) =>
        index === selectedTeacherIndex
          ? { ...teacher, name: newTeacherName, position: newTeacherPosition }
          : teacher
      );
      setSubjectData({ ...subjectData, teachers: updatedTeachers });
    }

    // Close modal and reset fields
    setIsEditTeacherModalOpen(false);
    setNewTeacherName("");
    setNewTeacherPosition("");
    setSelectedTeacherIndex(null);
  };

  const handleUpload = async () => {
    return new Promise((resolve, reject) => {
      if (!selectedFile) {
        throw new Error("No file selected");
      }
      const storageRef = ref(storage, `subjectfile/${selectedFile.name}`);

      const uploadTask = uploadBytesResumable(storageRef, selectedFile);

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
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", downloadURL);
          alert("File uploaded successfully!");
          resolve(downloadURL);
        }
      );
    });
  };

  const handleUpdate = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload!");
      return;
    }

    try {
      // Wait for file upload and get the download URL
      const fileLink = await handleUpload();
      console.log(fileLink, "File Link");
      // Construct the subject data object
      const subjectDatas = {
        SubjectName: subjectData.name,
        // SubjectFile: fileLink,
        teachers: subjectData.teachers,
      };

      const subjectsRef = doc(db, "subjects", subjectid.toString());
      await updateDoc(subjectsRef, subjectDatas);

      setSubjectData({ name: "", teachers: [] });
      router.push("/subjects");
    } catch (error) {
      console.error("Error handling subject: ", error);
      alert("Failed to handle subject. Please try again.");
    }
  };

  return (
    // <></>

    <div className="p-6 rounded-md">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
          <MdEdit size={18} />
          <span className="text-sm font-bold">Edit Subject</span>
        </button>
      </div>

      {/* Title Section */}
      <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
        Edit Subject Details
      </h2>

      {/* Input Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="subjectName"
          className="block font-medium mb-2 text-gray-700"
        >
          Subject Name
        </label>

        <input
          type="text"
          id="subjectName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Subject Name"
          value={subjectData.name}
          onChange={(e) =>
            setSubjectData({ ...subjectData, name: e.target.value })
          }
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
            ) : selectedFile.type === "application/pdf" ? (
              <div className="mt-4">
                <embed
                  src={URL.createObjectURL(selectedFile)}
                  type="application/pdf"
                  className="w-full h-96 border rounded"
                />
                <a
                  href={URL.createObjectURL(selectedFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-blue-500 hover:underline text-sm"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <AiOutlineFileText size={24} className="text-gray-500" />
                <span className="text-sm text-gray-500">Selected File:</span>
                <a
                  href={URL.createObjectURL(selectedFile)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-500 hover:underline"
                >
                  {selectedFile.name}
                </a>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Subject teachers section */}
      <div className="mb-6 px-6 pt-11">
        <div className="flex items-center space-x-3 mb-4">
          <h3 className="text-lg font-medium text-gray-700">
            Subject Teachers
          </h3>
        </div>

        <table className="w-full text-left border-collapse">
          <thead></thead>
          <tbody>
            {subjectData.teachers.map((teacher, index) => (
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
                  <span className="font-medium text-gray-700">
                    {teacher.position}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    onClick={() => handleEditTeacher(index)} // Edit teacher action
                  >
                    <MdEdit size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Teacher Modal */}
      {isEditTeacherModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded-md w-full max-w-md">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-700">
                Edit Teacher
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => setIsEditTeacherModalOpen(false)}
              >
                <AiOutlineClose size={20} />
              </button>
            </div>

            {/* Teacher Form */}
            <div className="mb-4">
              <label className="block font-medium text-gray-700 mb-2">
                Teacher Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                placeholder="Teacher Name"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label className="block font-medium text-gray-700 mb-2">
                Position
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                placeholder="Position"
                value={newTeacherPosition}
                onChange={(e) => setNewTeacherPosition(e.target.value)}
              />
            </div>
            <button
              className="w-full bg-[#576086] text-white py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
              onClick={handleSaveTeacher} // Save changes
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
      <div>
        <button className="bg-gray-400 p-2 rounded-2xl" onClick={handleUpdate}>
          save
        </button>
      </div>
    </div>
  );
};

export default EditSubject;
