'use client';
import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import { TbGridDots } from "react-icons/tb";

const AddSubject: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [teachers, setTeachers] = useState<{ name: string; position: string }[]>([
        { name: 'John Doe', position: 'Math Teacher' },
        { name: 'Jane Smith', position: 'Science Teacher' },
    ]);
    const [isAddTeacherModalOpen, setIsAddTeacherModalOpen] = useState(false);
    const [newTeacherName, setNewTeacherName] = useState('');
    // const [newTeacherPosition, setNewTeacherPosition] = useState('');

    // const handleAddTeacher = () => {
    //     if (newTeacherName && newTeacherPosition) {
    //         setTeachers([...teachers, { name: newTeacherName, position: newTeacherPosition }]);
    //         setNewTeacherName('');
    //         setNewTeacherPosition('');
    //         setIsAddTeacherModalOpen(false);
    //     }
    // };

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
            <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">Please enter Subject Details</h2>

            {/* Input Section */}
            <div className="mb-6 px-6">
                <label htmlFor="firstName" className="block font-medium mb-2 text-gray-700">
                    First Name
                </label>
                <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                    placeholder="Enter First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />
            </div>

            {/* Subject teachers section */}
            <div className="mb-6 px-6 pt-11 ">
                <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Subject Teachers</h3>
                    <button
                        className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b] focus:outline-none"
                        onClick={() => setIsAddTeacherModalOpen(true)}
                    >
                        Add Teacher
                    </button>
                </div>

                <table className="w-full text-left border-collapse">
                    <thead>

                    </thead>
                    <tbody>
                        {teachers.map((teacher, index) => (
                            <tr
                                key={index}
                                className="border-b hover:bg-gray-100"
                            >
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
                                        onClick={() => {
                                            setTeachers(teachers.filter((_, i) => i !== index));
                                        }}
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
                            <h2 className="text-lg font-semibold text-gray-700">Add Teacher</h2>
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

                        {/* Teacher Information Cards */}
                        <div className="space-y-4">
                            {teachers.map((teacher, index) => (
                                <div
                                    key={index}
                                    className="p-4 bg-gray-50 rounded-lg shadow-sm flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-4">
                                        <AiOutlineUser size={28} className="text-gray-500" />
                                        <div>
                                            <p className="font-medium text-gray-700">{teacher.name}</p>
                                            <p className="text-sm text-gray-500 font-semibold">
                                                {teacher.position}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                Other subjects the teacher is teaching
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                        onClick={() =>
                                            setTeachers((prev) =>
                                                prev.filter((_, teacherIndex) => teacherIndex !== index)
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
            <div className="flex justify-between  space-x-4 mt-20">
                <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none">
                    Cancel
                </button>
                <button className="bg-[#576086] text-white px-4 py-2 rounded-md hover:bg-[#414d6b] focus:outline-none">
                    Next
                </button>
            </div>
        </div>
    );
};

export default AddSubject;
