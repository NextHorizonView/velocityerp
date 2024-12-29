
"use client";
import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { AiOutlineClose, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { db } from "@/lib/firebaseConfig";
import {
    collection,
    addDoc,
    getDocs,

} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TbGridDots } from "react-icons/tb";


interface Teacher {
    id: string;
    name: string;
    position: string;
}

interface Subject {
    subjectId: string;
    subjectName: string;
    assignedTeachers: { id: string }[];
}

const AddClass: React.FC = () => {
    const [className, setClassName] = useState<string>("");
    const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
    const [newDivision, setNewDivision] = useState<string>("");
    const [selectedDivision, setSelectedDivision] = useState<string>("A");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [selectedClassteacher] =
        useState<string>("");
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    // const [newTeacherName, setNewTeacherName] = useState('');


    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "teachers"));
                const fetchedTeachers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data()["First Name"],
                    position: doc.data().Position,
                }));
                setTeachers(fetchedTeachers);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };

        const fetchSubjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "subjects"));
                const fetchedSubjects = querySnapshot.docs.map((doc) => ({
                    subjectId: doc.id,
                    subjectName: doc.data().subjectName,
                    assignedTeachers: doc.data().assignedTeachers,
                }));
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchTeachers();
        fetchSubjects();
    }, []);



    const handleAddDivision = () => {
        if (newDivision.trim() && !divisions.includes(newDivision)) {
            setDivisions([...divisions, newDivision]);
            setNewDivision("");
        }
    };

    // const updateTeacherPosition = (index: number, newPosition: string): void => {
    //     const updatedTeachers: Teacher[] = [...teachers];
    //     updatedTeachers[index].position = newPosition;
    //     setTeachers(updatedTeachers);
    // };

    const handleSubmit = async () => {
        const classId = uuidv4();
        const classSubjects = subjects.map((subject) => ({
            subjectName: subject.subjectName,
            subjectId: subject.subjectId,
            subjectTeacherId: subject.assignedTeachers[0]?.id || "",
        }));

        const classData = {
            classId,
            className,
            classDivision: selectedDivision,
            classTeacherId: selectedClassteacher,
            classSubjects,
        };

        console.log("Submitting Class Data: ", classData);

        try {
            await addDoc(collection(db, "classes"), classData);
            alert("Class added successfully!");
        } catch (error) {
            console.error("Error adding class: ", error);
            alert("Failed to add class.");
        }
    };

    return (
        <div className="p-6 rounded-md">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
                    <MdEdit size={18} />
                    <span className="text-sm font-bold">Add Class</span>
                </button>
            </div>

            {/* Title Section */}
            <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
                Please enter Class Details
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
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
            </div>

            {/* Division Section */}
            {/* Division Section */}
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-4">Divisions</h2>

                    {/* Dropdown for Divisions */}
                    <div className="mb-4">
                        <label htmlFor="divisionDropdown" className="text-sm font-medium text-gray-700">
                            Select Division
                        </label>
                        <select
                            id="divisionDropdown"
                            value={selectedDivision}
                            onChange={(e) => setSelectedDivision(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                        >
                            {divisions.map((division, index) => (
                                <option key={index} value={division}>
                                    {division}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Add Division Button */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="default" className="bg-[#576086] text-white">
                            Add New Division
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Add a New Division</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="divisionName" className="text-sm font-medium text-gray-700">
                                    Division Name
                                </label>
                                <input
                                    id="divisionName"
                                    value={newDivision}
                                    onChange={(e) => setNewDivision(e.target.value)}
                                    placeholder="Enter division name"
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                />
                            </div>
                            <Button
                                onClick={handleAddDivision}
                                variant="default"
                                className="w-full bg-[#576086] text-white hover:bg-green-700"
                            >
                                Add Division
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>


            {/* Classteacher Section */}
            <div className="mb-6 px-6 pt-11">
                <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-gray-700">Subject Teachers</h3>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b]">
                                Add Subject Teacher
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Subject Teacher</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* Search Input */}
                                <div className="relative">
                                    <Input
                                        id="searchTeacher"
                                        placeholder="Find Teacher"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                    <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
                                </div>

                                {/* Selected Teacher Card */}
                                {teachers.map((teacher, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 bg-gray-50 flex items-center justify-between"
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                                                <AiOutlineUser className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                    {teacher.name}
                                                </p>
                                                <select
                                                    id="subjectDropdown"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                                >
                                                    <option value="">{teacher.position}</option>
                                                    {teachers.map((teacher, index) => (
                                                        <option
                                                            key={index}
                                                            value={teacher.position.toLowerCase().replace(/\s+/g, '-')}
                                                        >
                                                            {teacher.position}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <button className="text-red-600 hover:text-red-700">
                                            <AiOutlineClose />
                                        </button>
                                    </div>
                                ))}

                                {/* Subject Dropdown */}
                                {/* <div>
                                    <select
                                        id="subjectDropdown"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                    >
                                        <option value="">Select the Subject</option>
                                        {teachers.map((teacher, index) => (
                                            <option
                                                key={index}
                                                value={teacher.position.toLowerCase().replace(/\s+/g, '-')}
                                            >
                                                {teacher.position}
                                            </option>
                                        ))}
                                    </select>
                                </div> */}

                                {/* Save Button */}
                                <Button className="w-full bg-[#576086] text-white hover:bg-[#414d6b]">
                                    Save
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>


                <table className="w-full text-left border-collapse">
                    <thead></thead>
                    <tbody>
                        {teachers
                            .filter((teacher) =>
                                teacher.name.toLowerCase().includes(searchTerm.toLowerCase())
                            )
                            .map((teacher, index) => (
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
                                            onClick={() => setTeachers(teachers.filter((_, i) => i !== index))}
                                        >
                                            <AiOutlineClose size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Button Section */}
            <div className="flex justify-end">
                <Button onClick={handleSubmit} className="bg-[#576086] text-white">
                    Add Class
                </Button>
            </div>
        </div>
    );
};

export default AddClass;