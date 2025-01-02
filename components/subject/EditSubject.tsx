"use client";
import React, { useEffect, useState } from "react";
import { AiOutlineFileText, AiOutlineUser } from "react-icons/ai";
import { MdEdit } from "react-icons/md";
import { TbGridDots } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { fetchSubjectDataById } from "../helper/firebaseHelper";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "@/lib/firebaseConfig";
import { doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import FadeLoader from "../Loader";
import { Trash2 } from "lucide-react";

interface EditSubjectFormProps {
  subjectid: string;
}

const EditSubject: React.FC<EditSubjectFormProps> = ({ subjectid }) => {
  console.log(subjectid);
  const router = useRouter();

  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  interface Teacher {
    id: string;
    name: string;
    position: string;
  }

  const [subjectData, setSubjectData] = useState<{
    name: string;
    files: { name: string; url: string }[];
    teachers: Teacher[];
  }>({ name: "", files: [], teachers: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subjectid) {
      const fetchSubjectData = async () => {
        setLoading(true);
        try {
          const subjectData = await fetchSubjectDataById(subjectid);
          console.log(subjectData, "Fetched subjectData Data");

          setSubjectData({
            ...subjectData,
            name: subjectData.SubjectName || "",
            files: subjectData.SubjectFile || [],
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
        } finally {
          setLoading(false);
        }
      };

      fetchSubjectData();
    }
  }, [subjectid]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(Array.from(e.target.files));
    }
  };

  const handleUpload = async (): Promise<{ name: string; url: string }[]> => {
    setLoading(true);
    const uploadPromises = selectedFile.map((file) => {
      return new Promise<{ name: string; url: string }>((resolve, reject) => {
        const storageRef = ref(storage, `subjectfile/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(`Upload for ${file.name} is ${progress}% done`);
          },
          (error) => {
            console.error(`Upload failed for ${file.name}:`, error);
            alert(`File upload failed for ${file.name}. Please try again.`);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve({ name: file.name, url: downloadURL });
            } catch (error) {
              console.error(
                `Error fetching download URL for ${file.name}:`,
                error
              );
              reject(error);
            }
          }
        );
      });
    });
    const fileLinks = await Promise.all(uploadPromises);
    setLoading(false);
    return fileLinks;
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Upload new files and get their metadata (name and URL)
      const newFileLinks = await handleUpload();
      console.log(newFileLinks, "New File Links");

      const subjectsRef = doc(db, "subjects", subjectid.toString());
      const docSnapshot = await getDoc(subjectsRef);

      if (!docSnapshot.exists()) {
        throw new Error("Subject not found!");
      }

      const existingData = docSnapshot.data();
      const existingSubjectFile = existingData?.SubjectFile || [];

      // Combine existing files with new files
      const updatedSubjectFile = [...existingSubjectFile, ...newFileLinks];

      // Update subject data
      const updatedSubjectData = {
        SubjectName: subjectData.name || existingData?.SubjectName || "",
        SubjectFile: updatedSubjectFile, // Contains both name and URL now
        teachers: subjectData.teachers || existingData?.teachers || [],
        updatedAt: serverTimestamp(),
      };

      // Update Firestore document
      await updateDoc(subjectsRef, updatedSubjectData);

      setSubjectData({ name: "", files: [], teachers: [] });
      router.push("/subjects");

      alert("Subject updated successfully!");
    } catch (error) {
      console.error("Error updating subject: ", error);
      alert("Failed to update subject. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteTeacher = async (teacherId: string) => {
    try {
      setLoading(true);

      // Reference to the subject document in Firestore
      const subjectsRef = doc(db, "subjects", subjectid.toString());
      const docSnapshot = await getDoc(subjectsRef);

      if (!docSnapshot.exists()) {
        throw new Error("Subject not found!");
      }

      const existingData = docSnapshot.data();
      const existingTeachers: Teacher[] = existingData?.teachers || [];

      // Filter out the teacher to be deleted
      const updatedTeachers = existingTeachers.filter(
        (teacher) => teacher.id !== teacherId
      );

      // Prepare the updated subject data
      const updatedSubjectData = {
        SubjectName: subjectData.name || existingData?.SubjectName || "",
        SubjectFile: existingData?.SubjectFile || [],
        teachers: updatedTeachers, // Updated list of teachers after deletion
        updatedAt: serverTimestamp(),
      };

      // Update Firestore document
      await updateDoc(subjectsRef, updatedSubjectData);

      // Update the local state after deletion
      setSubjectData((prev) => ({
        ...prev,
        teachers: updatedTeachers,
      }));

      alert("Teacher deleted successfully!");
    } catch (error) {
      console.error("Error deleting teacher: ", error);
      alert("Failed to delete teacher. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            // value={subjectData.files}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
            onChange={handleFileChange}
            multiple
          />
          {selectedFile.length > 0 && (
            <div className="mt-4 space-y-4">
              {selectedFile.map((file, index) => (
                <div key={index}>
                  {file.type.startsWith("image/") ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`File Preview ${index}`}
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ) : file.type === "application/pdf" ? (
                    <div className="mt-4">
                      <embed
                        src={URL.createObjectURL(file)}
                        type="application/pdf"
                        className="w-full h-96 border rounded"
                      />
                      <a
                        href={URL.createObjectURL(file)}
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
                      <span className="text-sm text-gray-500">
                        Selected File:
                      </span>
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-blue-500 hover:underline"
                      >
                        {file.name}
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {subjectData.files.length > 0 && (
            <>
              {subjectData.files.map((file, index) => {
                const fileUrl = file.url;
                const fileName = file.name;

                if (!fileUrl) {
                  return null;
                }

                const isImage =
                  fileUrl.startsWith("https://") &&
                  (fileUrl.endsWith(".jpg") ||
                    fileUrl.endsWith(".jpeg") ||
                    fileUrl.endsWith(".png") ||
                    fileUrl.endsWith(".gif"));

                const isPdf = fileUrl.endsWith(".pdf");

                return (
                  <div key={index} className="my-4">
                    {isImage ? (
                      <img
                        src={fileUrl}
                        alt={`File Preview ${fileName}`}
                        className="w-full max-w-sm object-cover rounded-md"
                      />
                    ) : isPdf ? (
                      <div className="mt-4">
                        <embed
                          src={fileUrl}
                          type="application/pdf"
                          className="w-full h-96 border rounded"
                        />
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block mt-2 text-blue-500 hover:underline text-sm"
                        >
                          Open PDF in new tab
                        </a>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <AiOutlineFileText
                          size={24}
                          className="text-gray-500"
                        />
                        <span className="text-sm text-gray-500">File:</span>
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-blue-500 hover:underline"
                        >
                          {fileName}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </>
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
                      className="text-gray-500 hover:text-gray-700 focus:outline-none m-2"
                      onClick={() => handleDeleteTeacher(teacher.id)} // Edit teacher action
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <button
            onClick={handleUpdate}
            className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none"
          >
            save
          </button>
        </div>
      </div>
    </>
  );
};

export default EditSubject;
