'use client';
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineFileText, AiOutlineUser } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { TbGridDots } from "react-icons/tb";

const EditSubject: React.FC = () => {
    const [firstName, setFirstName] = useState('Mathematics'); // Dummy Data
    const [teachers, setTeachers] = useState<{ name: string; position: string }[]>([
        { name: 'John Doe', position: 'Math Teacher' },
        { name: 'Jane Smith', position: 'Science Teacher' },
    ]);
    const [isEditTeacherModalOpen, setIsEditTeacherModalOpen] = useState(false);
    const [newTeacherName, setNewTeacherName] = useState('');
    const [newTeacherPosition, setNewTeacherPosition] = useState('');
    const [selectedTeacherIndex, setSelectedTeacherIndex] = useState<number | null>(null); // Index of the teacher being edited
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isFileEdited, setIsFileEdited] = useState(false); // Track if file is edited

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
            setIsFileEdited(true); // Mark as edited
        }
    };

    const handleEditTeacher = (index: number) => {
        const teacher = teachers[index];
        setSelectedTeacherIndex(index);
        setNewTeacherName(teacher.name);
        setNewTeacherPosition(teacher.position);
        setIsEditTeacherModalOpen(true); // Open modal for editing
    };

    const handleSaveTeacher = () => {
        if (selectedTeacherIndex !== null) {
            const updatedTeachers = teachers.map((teacher, index) =>
                index === selectedTeacherIndex
                    ? { name: newTeacherName, position: newTeacherPosition }
                    : teacher
            );
            setTeachers(updatedTeachers);
        }

        // Close modal and reset fields
        setIsEditTeacherModalOpen(false);
        setNewTeacherName('');
        setNewTeacherPosition('');
        setSelectedTeacherIndex(null);
    };

    return (
        <div className="p-6 rounded-md">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
                    <MdEdit size={18} />
                    <span className="text-sm font-bold">Edit Subject</span>
                </button>
            </div>

            {/* Title Section */}
            <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">Edit Subject Details</h2>

            {/* Input Section */}
            <div className="mb-6 px-6">
                <label htmlFor="firstName" className="block font-medium mb-2 text-gray-700">
                    Subject Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                    placeholder="Enter Subject Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>

            {/* File Upload Section */}
            <div className="mb-6 px-6">
                <label htmlFor="fileUpload" className="block font-medium mb-2 text-gray-700">
                    Upload Subject File
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                    onChange={handleFileChange}
                />
                {!isFileEdited && selectedFile === null && (
                    <div className="mt-2 text-gray-500">
                        {/* Display existing file if no new file is selected */}
                        <div className="flex items-center space-x-2">
                            <AiOutlineFileText size={24} className="text-gray-500" />
                            <span className="text-sm text-gray-500">Existing File:</span>
                            <span className="font-semibold">SubjectFile.pdf</span> {/* Dummy Data */}
                        </div>
                    </div>
                )}
                {selectedFile && (
                    <div className="mt-2">
                        {/* Display file preview if it's an image */}
                        {selectedFile.type.startsWith('image/') ? (
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
            <div className="mb-6 px-6 pt-11">
                <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Subject Teachers</h3>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead></thead>
                    <tbody>
                        {teachers.map((teacher, index) => (
                            <tr key={index} className="border-b hover:bg-gray-100">
                                <td className="p-3">
                                    <div className="flex items-center text-gray-500">
                                        <TbGridDots size={20} />
                                    </div>
                                </td>
                                <td className="p-3 flex items-center space-x-2">
                                    <AiOutlineUser size={20} className="text-gray-500" />
                                    <span className="font-medium text-gray-700">{teacher.name}</span>
                                </td>
                                <td className="p-3 text-gray-500">{teacher.position}</td>
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
                            <h2 className="text-lg font-semibold text-gray-700">Edit Teacher</h2>
                            <button
                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                onClick={() => setIsEditTeacherModalOpen(false)}
                            >
                                <AiOutlineClose size={20} />
                            </button>
                        </div>

                        {/* Teacher Form */}
                        <div className="mb-4">
                            <label className="block font-medium text-gray-700 mb-2">Teacher Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                placeholder="Teacher Name"
                                value={newTeacherName}
                                onChange={(e) => setNewTeacherName(e.target.value)}
                            />
                        </div>
                        <div className="mb-6">
                            <label className="block font-medium text-gray-700 mb-2">Position</label>
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
        </div>
    );
};

export default EditSubject;
