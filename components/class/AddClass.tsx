"use client";
import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { AiOutlineClose, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { getFirebaseServices } from '@/lib/firebaseConfig';

const { db } = getFirebaseServices();
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
import { Timestamp } from 'firebase/firestore';

interface Teacher {
    id: string;
    name: string;
    position: string;
}

interface Subject {
    toLowercase(): unknown;
    SubjectId: string;
    SubjectName: string;
    SubjectTeachersId: {
        SubjectTeacherName: string; SubjectTeacherID: string 
}[];
}

const AddClass: React.FC = () => {
    const [ClassName, setClassName] = useState<string>("");
    const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
    const [newDivision, setNewDivision] = useState<string>("");
    const [selectedDivision, setSelectedDivision] = useState<string>("");
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [Classteachers, setClassTeachers] = useState<Teacher[]>([]);

    // const [toShowClassTeachers, setToShowClassTeachers] = useState<Teacher[]>([]);

    const [selectedClassteacher,setSelectedClassteacher] =  useState<Teacher[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [selectedSubjectTeacher,setSelectedSubjectTeacher] =  useState<Teacher[]>([]);

    const [searchTerm, setSearchTerm] = useState('');
    // const [searchSubject, setSearchSubject] = useState('');

    const [ClasssearchTerm, setClassSearchTerm] = useState('');
// const [subjectDropdown, setSubjectDropdown] = useState<boolean>(false);
const [subjectDropdowns, setSubjectDropdowns] = useState<boolean[]>([]);
const [searchSubjects, setSearchSubjects] = useState<string[]>([]);
const [isDialogOpen, setIsDialogOpen] = useState(false);

const [isDialogOpenSubject, setIsDialogOpenSubject] = useState(false);


const [filterClassTeachers, setFilterClassTeachers] = useState<Teacher[]>([]);
const [filterSubjectTeachers, setFilterSubjectTeachers] = useState<Teacher[]>([]);
  const [showNewDivisionInput, setShowNewDivisionInput] = useState<boolean>(false);

    // const [newTeacherName, setNewTeacherName] = useState('');
// For pop up subject teacher 
const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "teachers"));
                const fetchedTeachers = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data()["First Name"],
                    position: doc.data().Position,
                }));
                // setTeachers(fetchedTeachers);
                // setClassTeachers(fetchedTeachers);
                setSelectedClassteacher(fetchedTeachers);
                setSelectedSubjectTeacher(fetchedTeachers);

                //
                setSearchSubjects(new Array(fetchedTeachers.length).fill(''));
                setSubjectDropdowns(new Array(fetchedTeachers.length).fill(false));
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };

        const fetchSubjects = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "subjects"));
                const fetchedSubjects = querySnapshot.docs.map((doc) => ({
                    SubjectId: doc.id,
                    SubjectName: doc.data().SubjectName,
                    SubjectTeachersId: doc.data().SubjectTeachersId,
                    toLowercase: () => doc.data().SubjectName?.toLowerCase(),
                }));
                setSubjects(fetchedSubjects);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };

        fetchTeachers();
        fetchSubjects();
    }, []);

    useEffect(() => {
        if (ClasssearchTerm) {
            const filtered = selectedClassteacher.filter((teacher) =>
                teacher?.name?.toLowerCase().includes(ClasssearchTerm?.toLowerCase())
            );
            setFilterClassTeachers(filtered);
        } else {
            setFilterClassTeachers([]);
        }
    }, [ClasssearchTerm, Classteachers]);



    useEffect(() => {
        if (searchTerm) {
            const filtered = selectedSubjectTeacher.filter((teacher) =>
                teacher?.name?.toLowerCase().includes(searchTerm?.toLowerCase())
            );
            setFilterSubjectTeachers(filtered);
        } else {
            setFilterSubjectTeachers([]);
        }
    }, [searchTerm, selectedSubjectTeacher]);

    const handleAddDivision = () => {
        if (newDivision.trim() && !divisions.includes(newDivision)) {
            setDivisions([...divisions, newDivision]);
            setNewDivision("");
          
      setShowNewDivisionInput(false); 

        }
    };

      const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (e.target.value === "add-new") {
          setShowNewDivisionInput(true);
        } else {
          setSelectedDivision(e.target.value);
          setShowNewDivisionInput(false);
        }
      };

    // const updateTeacherPosition = (index: number, newPosition: string): void => {
    //     const updatedTeachers: Teacher[] = [...teachers];
    //     updatedTeachers[index].position = newPosition;
    //     setTeachers(updatedTeachers);
    // };

    const handleSubmit = async () => {
        
        const ClassId = uuidv4();
        const ClassSubjects = subjects.map((subject) => ({
            SubjectName: subject.SubjectName,
            SubjectId: subject.SubjectId,
            SubjectTeacherID: Array.isArray(subject.SubjectTeachersId) && subject.SubjectTeachersId.length > 0 ? subject.SubjectTeachersId[0].SubjectTeacherID : "",
        }));

        const classteacherId=Classteachers.map((teacher) => teacher.id);
        const classData = {
            ClassId,
            ClassName,
            ClassDivision: selectedDivision,
            ClassTeacherId: classteacherId,
            ClassSubjects,
            ClassCreatedAt: Timestamp.fromDate(new Date()),
            ClassUpdatedAt: Timestamp.fromDate(new Date()),
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

    //
    const handleSearchChange = (index:number, value:string) => {
        const newSearchSubjects = [...searchSubjects];
        newSearchSubjects[index] = value;
        setSearchSubjects(newSearchSubjects);
      };
    
      const toggleDropdown = (index:number) => {
        const newSubjectDropdowns = [...subjectDropdowns];
        newSubjectDropdowns[index] = !newSubjectDropdowns[index];
        setSubjectDropdowns(newSubjectDropdowns);
      };

      const saveClassTeachers = () => {
        // setClassTeachers(selectedClassteacher);
        setClassTeachers([...Classteachers,...filterClassTeachers]);
        setIsDialogOpen(false);
        // console.log('Saving class teachers:', selectedClassTeachers);
    };

    const saveSubjectTeachers = () => {
        // setClassTeachers(selectedClassteacher);
        setTeachers([...teachers,...filterSubjectTeachers]);
        setIsDialogOpenSubject(false);
        // console.log('Saving class teachers:', selectedSubjectTeacher);
    };

      // selected subject 
      const handleSubjectSelect = (teacherIndex:number, SubjectName:string) :void=> {
        const newSelectedSubjects = [...selectedSubjects];
        newSelectedSubjects[teacherIndex] = SubjectName;
        setSelectedSubjects(newSelectedSubjects);
    
        const newSubjectDropdowns = [...subjectDropdowns];
        newSubjectDropdowns[teacherIndex] = false;
        setSubjectDropdowns(newSubjectDropdowns);
      };


// to filter teachers


    //   const filteredClassTeachers = selectedClassteacher.filter((teacher) =>
    //     teacher.name?.toLowerCase().includes(ClasssearchTerm?.toLowerCase())
    //   );

    //   const filteredSubjectTeachers = selectedSubjectTeacher.filter((teacher) =>
    //     teacher.name?.toLowerCase().includes(searchTerm?.toLowerCase())
    //   );

      const handleRemoveClassTeacher = (teacherId: string) => {
        setFilterClassTeachers(filterClassTeachers.filter((teacher) => teacher.id !== teacherId));
    };

    const handleRemoveSubjectTeacher = (teacherId: string) => {
        const updatedTeachers = filterSubjectTeachers.filter((teacher) => teacher.id !== teacherId);
        console.log("Updated Teachers: ", updatedTeachers);
        setFilterSubjectTeachers(updatedTeachers);
    };


    return (
        <div className="p-6 rounded-md">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
                    <MdEdit size={18} />
                    <span className="text-sm font-bold">Add Class</span>
                </button>
                <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
                    <MdEdit size={18} />
                    <span className="text-sm font-bold">Edit Class Form</span>
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
                    className="block font-medium mb-2 text-[#666666]"
                >
                    Class Name
                </label>
                <input
                    type="text"
                    id="className"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                    placeholder="Enter Class Name"
                    value={ClassName}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />
            </div>

            {/* Division Section */}
            {/* Division Section */}
            <div className="p-6">
                <div className="mb-6">
                    <h2 className="text-xl font-medium mb-4 text-[#414d6b]">Div</h2>

                    {/* Dropdown for Divisions */}
                    <div className="mb-4">
                 

                        <select
  id="division"
  className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086] 
  bg-white text-black hover:bg-[#576086] hover:text-white`}
  value={selectedDivision}
  onChange={handleDivisionChange}
  style={{
    background: selectedDivision === "" ? "white" : "#576086",
    color: selectedDivision === "" ? "black" : "white",
  }}
>
  {/* Default option */}
  <option value="" style={{ background: "white", color: "#666666" }}>
    Select Division
  </option>

  {/* Other options */}
  {divisions.map((division, index) => (
    <option
      key={index}
      value={division}
      style={{
        background: "white",
        color: "#666666",
      }}
    >
      {division}
    </option>
  ))}

  {/* Add New option */}
  <option
    value="add-new"
    style={{
      background: "white",
      color: "black",
    }}
    className="font-bold"
  >
    Add New Division
  </option>
</select>

                    </div>
       {showNewDivisionInput && (
          <div className="mt-4">
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
              placeholder="Enter New Division"
              value={newDivision}
              onChange={(e) => setNewDivision(e.target.value)}
            />
            <Button onClick={handleAddDivision} className="mt-2">
              Add Division
            </Button>
          </div>
        )}

                </div>

                {/* Add Division Button */}
  
            </div>

{/* CLassTeacher Section  */}
<div className="mb-6 px-6 pt-11">
                <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-[#666666]">Class Teacher</h3>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#576086] text-white rounded-md text-xs p-1 px-5 hover:bg-[#414d6b]"
                            >
                                Add Teacher
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Teacher</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                                {/* Search Input */}
                                <div className="relative">
                                    <Input
                                        id="searchTeacher"
                                        placeholder="Find Teacher"
                                        value={ClasssearchTerm}
                                        onChange={(e) => setClassSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                    <AiOutlineSearch className="absolute left-3 top-3 text-gray-400" />
                                </div>

                                {/* Selected Teacher Card */}
                                {filterClassTeachers.map((teacher, index) => (
                                    <div
                                        key={index}
                                        className="border rounded-lg p-4 bg-gray-50 flex items-center justify-between"

                                        onClick={()=>setClassSearchTerm(teacher.name)}
                                    >
                                        <div className="flex items-center space-x-4">
                                            <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
                                                <AiOutlineUser className="text-gray-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-700">
                                                   {teacher.name}
                                                </p>

                                     <p 
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                     
                                     > {teacher.position} </p>
                                                
                                             {/* <select
                                                    id="subjectDropdown"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
                                                >
                                                    <option value="">{teacher.position}</option>
                                                    {Classteachers.map((teacher, index) => (
                                                        <option
                                                            key={index}
                                                            value={teacher.position?.toLowerCase().replace(/\s+/g, '-')}
                                                        >
                                                            {teacher.position}
                                                        </option>
                                                    ))} 
                                                </select> */}

                                                
                                            </div>
                                        </div>
                                        <button className="text-red-600 hover:text-red-700"
                                          onClick={() => handleRemoveClassTeacher(teacher.id)}
                                        >
                                            <AiOutlineClose />
                                        </button>
                                    </div>
                                ))}









                                

                        

                                {/* Save Button */}
                                <Button className="w-full bg-[#576086] text-white hover:bg-[#414d6b]" onClick={saveClassTeachers}>
                                    Save
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>


                <table className="w-full text-left border-collapse">
                    <thead></thead>
                    {/* <tbody>
                        {Classteachers
                            .filter((teacher) =>
                                teacher.name?.toLowerCase().includes(ClasssearchTerm?.toLowerCase())
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
                                            onClick={() => setClassTeachers(Classteachers.filter((_, i) => i !== index))}
                                        >
                                            <AiOutlineClose size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody> */}


<tbody>
                        {Classteachers 

                            // .filter((teacher) =>
                            //     teacher.name?.toLowerCase().includes(ClasssearchTerm?.toLowerCase())
                            // )
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
                                            onClick={() => setClassTeachers(Classteachers.filter((_, i) => i !== index))}
                                        >
                                            <AiOutlineClose size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
               
                </table>
            </div>

            {/* Subjectteacher Section */}
            <div className="mb-6 px-6 pt-11">
                <div className="flex items-center space-x-3 mb-4">
                    <h3 className="text-lg font-medium text-[#666666]">Subject Teachers</h3>
                    <Dialog open={isDialogOpenSubject} onOpenChange={setIsDialogOpenSubject}>
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


 {/* WITHOUT SEARCH FILTER  */}
                                {/* Selected Teacher Card */}
                                {/* {teachers.map((teacher, index) => (
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
                                                Subject
                                                <select
                id="subjectDropdown"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
              >
                <option value="">Select the Subject</option>
             
                {subjects.map((subject, subjectIndex) =>
                  subject.teachers.map((as, teacherIndex) =>
                    as.name === teacher.name ? (
                        
                        
                        
                      <option key={`${subjectIndex}-${teacherIndex}`} value={teacher.name}>
                        {subject.SubjectName}
                      </option>
                    ) : null
                    // ) : null
                  )
             

                )}
              </select>


                                            </div>
                                        </div>
                                        <button className="text-red-600 hover:text-red-700">
                                            <AiOutlineClose />
                                        </button>
                                    </div>
                                ))} */}





{/* WITH SEARCH FILTER  */}

{/* {filteredTeachers.map((teacher, index) => ( */}
{filterSubjectTeachers.map((teacher, index) => (

  <div
    key={index}
    className="border rounded-lg p-4 bg-gray-50 flex items-center justify-between"
  >
    <div className="flex items-center space-x-4">
      <div className="bg-gray-300 w-10 h-10 rounded-full flex items-center justify-center">
        <AiOutlineUser className="text-gray-600" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{teacher.name}</p>
        {/* <select
          id="subjectDropdown"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
        >
          <option value="">{teacher.position}</option>
          {teachers.map((t, i) => (
            <option
              key={i}
              value={t.position.toLowerCase().replace(/\s+/g, '-')}
            >
              {t.position}
            </option>
          ))}
        </select> */}
        <div className="relative mt-2">
          <div
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086] cursor-pointer flex justify-between items-center"
            onClick={() => toggleDropdown(index)}
          >
            <span>Select the Subject</span>
            <span className="ml-2">&#9662;</span> {/* Triangle */}
          </div>
          {subjectDropdowns[index] && (
            <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto z-10">
              <div className="px-4 py-2">
                <Input
                  id="searchSubject"
                  placeholder="Search the Subject"
                  value={searchSubjects[index]}
                  onChange={(e) => handleSearchChange(index, e.target.value)}
                  className="pl-10"
                />
              </div>
              {subjects.map((subject, subjectIndex) =>
                subject.SubjectTeachersId.map((as, teacherIndex) =>
                  as.SubjectTeacherName === teacher.name &&
                  subject.SubjectName?.toLowerCase().includes(searchSubjects[index]?.toLowerCase()) ? (
                    <div key={`${subjectIndex}-${teacherIndex}`} className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleSubjectSelect(index, subject.SubjectName)}
                    >
                      {subject.SubjectName}
                    </div>
                  ) : <>
                  <h1>no</h1>
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    <button className="text-red-600 hover:text-red-700"
                     onClick={() => handleRemoveSubjectTeacher(teacher.id)}
    
    >
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
                                <Button className="w-full bg-[#576086] text-white hover:bg-[#414d6b]"
                                onClick={saveSubjectTeachers}
                                >
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
                            // .filter((teacher) =>
                            //     teacher.name?.toLowerCase().includes(searchTerm?.toLowerCase())
                            // )
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

// function setIsDialogOpen(arg0: boolean) {
//     throw new Error("Function not implemented.");
// }
