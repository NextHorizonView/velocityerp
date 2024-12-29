"use client";

// "use client";
// import React, { useState, useEffect } from "react";
// import { MdEdit } from "react-icons/md";
// import { Button } from "@/components/ui/button";
// import { db } from "@/lib/firebaseConfig";
// import {
//   collection,
//   addDoc,
//   getDocs,

// } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

// interface Teacher {
//   id: string;
//   name: string;
//   position: string;
// }

// interface Subject {
//   subjectId: string;
//   subjectName: string;
//   assignedTeachers: { id: string }[];
// }

// const AddClassExp: React.FC = () => {
  
//   const [className, setClassName] = useState<string>("");
//   const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
//   const [newDivision, setNewDivision] = useState<string>("");
//   const [selectedDivision, setSelectedDivision] = useState<string>("");
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedClassteacher, setSelectedClassteacher] =
//     useState<string>("");
//   const [subjects, setSubjects] = useState<Subject[]>([]);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "teachers"));
//         const fetchedTeachers = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data()["First Name"],
//           position: doc.data().Position,
//         }));
//         setTeachers(fetchedTeachers);
//       } catch (error) {
//         console.error("Error fetching teachers:", error);
//       }
//     };

//     const fetchSubjects = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "subjects"));
//         const fetchedSubjects = querySnapshot.docs.map((doc) => ({
//           subjectId: doc.id,
//           subjectName: doc.data().subjectName,
//           assignedTeachers: doc.data().assignedTeachers,
//         }));
//         setSubjects(fetchedSubjects);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };

//     fetchTeachers();
//     fetchSubjects();
//   }, []);

//   const handleAddDivision = () => {
//     if (newDivision.trim() && !divisions.includes(newDivision)) {
//       setDivisions([...divisions, newDivision]);
//       setNewDivision(""); 
//     }
//   };

//   const handleSubmit = async () => {
//     const classId = uuidv4(); 
//     const classSubjects = subjects.map((subject) => ({
//       subjectName: subject.subjectName,
//       subjectId: subject.subjectId,
//       subjectTeacherId: subject.assignedTeachers[0]?.id || "", 
//     }));

//     const classData = {
//       classId,
//       className,
//       classDivision: selectedDivision,
//       classTeacherId: selectedClassteacher,
//       classSubjects,
//     };

//     console.log("Submitting Class Data: ", classData);

//     try {
//       await addDoc(collection(db, "classes"), classData);
//       alert("Class added successfully!");
//     } catch (error) {
//       console.error("Error adding class: ", error);
//       alert("Failed to add class.");
//     }
//   };

//   // dummy static
//   const [classTeachers, setClassTeachers] = useState([
//     { name: "Teacher Name", position: "Position" },
//   ]);
//   const [subjectTeachersList, setSubjectTeachersList] = useState([
//     { name: "Teacher Name", subject: "Subject Name", position: "Position" },
//   ]);
  
//   const handleAddClassTeacher = () => {
//     setClassTeachers([...classTeachers, { name: "", position: "" }]);
//   };
  
//   const handleAddSubjectTeacher = () => {
//     setSubjectTeachersList([
//       ...subjectTeachersList,
//       { name: "", subject: "", position: "" },
//     ]);
//   };
  
//   const handleDeleteClassTeacher = (index: number) => {
//     const updatedClassTeachers = classTeachers.filter((_, i) => i !== index);
//     setClassTeachers(updatedClassTeachers);
//   };
  
//   const handleDeleteSubjectTeacher = (index: number) => {
//     const updatedSubjectTeachersList = subjectTeachersList.filter(
//       (_, i) => i !== index
//     );
//     setSubjectTeachersList(updatedSubjectTeachersList);
//   };
  

//   return (
//     <div className="p-6 rounded-md bg-[#FAFAF8]">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//        <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
//             <MdEdit size={18} />
//             <span className="text-sm font-bold">Add Student</span>
//           </button>
//           <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
//             <MdEdit size={18} />
//             <span className="text-sm font-bold">Edit Student Form</span>
//           </button>
//       </div>

//       {/* Title Section */}
//       <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
//         Please enter Class Details
//       </h2>

//       {/* Input Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="className"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Class Name
//         </label>
//         <input
//           type="text"
//           id="className"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           placeholder="Enter Class Name"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           required
//         />
//       </div>

//       {/* Division Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="newDivision"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Add Division
//         </label>
//         <input
//           type="text"
//           id="newDivision"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           placeholder="Enter Division"
//           value={newDivision}
//           onChange={(e) => setNewDivision(e.target.value)}
//         />
//         <Button onClick={handleAddDivision} className="mt-2">
//           Add Division
//         </Button>
//       </div>

//       {/* Division Options */}
{/* <div className="mb-6 px-6">
<label
  htmlFor="division"
  className="block font-medium mb-2 text-gray-700"
>
  Select Division
</label>
<select
  id="division"
  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
  value={selectedDivision}
  onChange={handleDivisionChange}
>
  <option value="">Select Division</option>
  {divisions.map((division) => (
    <option key={division} value={division}>
      {division}
    </option>
  ))}
  <option value="add-new">Add New Division</option>
</select>
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
</div> */}

//       {/* Classteacher Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="classteacher"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Select ClassTeacher
//         </label>
//         <select
//           id="classteacher"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           value={selectedClassteacher}
//           onChange={(e) => setSelectedClassteacher(e.target.value)}
//         >
//           <option value="">Select a teacher</option>
//           {teachers.map((teacher) => (
//             <option key={teacher.id} value={teacher.id}>
//               {teacher.name}
//             </option>
//           ))}
//         </select>
//       </div>
//       <div>
//   end 

//   <div className="mb-6">
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="text-lg font-semibold text-gray-700">Class Teacher</h3>
//       <button
//         onClick={handleAddClassTeacher}
//         className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
//       >
//         Add Teacher
//       </button>
//     </div>
//     <ul className="space-y-2">
//       {classTeachers.map((teacher, index) => (
//         <li
//           key={index}
//           className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="text-gray-400">
//               <i className="fas fa-grip-vertical"></i>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="text-gray-500">
//                 <i className="fas fa-user"></i>
//               </div>
//               <div>
//                 <p className="text-gray-800 font-medium">{teacher.name}</p>
//               </div>
//             </div>
//           </div>
//           <div className="text-gray-700">{teacher.position}</div>
//           <button
//             onClick={() => handleDeleteClassTeacher(index)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <i className="fas fa-times"></i>
//           </button>
//         </li>
//       ))}
//     </ul>
//   </div>

//   {/* Subject Teacher Section */}
//   <div>
//     <div className="flex justify-between items-center mb-4">
//       <h3 className="text-lg font-semibold text-gray-700">Subject Teacher</h3>
//       <button
//         onClick={handleAddSubjectTeacher}
//         className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
//       >
//         Add Subject Teacher
//       </button>
//     </div>
//     <ul className="space-y-2">
//       {subjectTeachersList.map((teacher, index) => (
//         <li
//           key={index}
//           className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border"
//         >
//           <div className="flex items-center space-x-4">
//             <div className="text-gray-400">
//               <i className="fas fa-grip-vertical"></i>
//             </div>
//             <div className="flex items-center space-x-2">
//               <div className="text-gray-500">
//                 <i className="fas fa-user"></i>
//               </div>
//               <div>
//                 <p className="text-gray-800 font-medium">{teacher.name}</p>
//                 <p className="text-gray-500 text-sm">{teacher.subject}</p>
//               </div>
//             </div>
//           </div>
//           <div className="text-gray-700">{teacher.position}</div>
//           <button
//             onClick={() => handleDeleteSubjectTeacher(index)}
//             className="text-red-500 hover:text-red-700"
//           >
//             <i className="fas fa-times"></i>
//           </button>
//         </li>
//       ))}
//     </ul>
//   </div>
//   end here 
// </div>

//       {/* Button Section */}
//       <div className="flex justify-end">
//         <Button onClick={handleSubmit} className="bg-[#576086] text-white">
//           Add Class
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default AddClassExp;
// neww

// "use client";
// import React, { useState, useEffect } from "react";
// import { MdEdit } from "react-icons/md";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { db } from "@/lib/firebaseConfig";
// import {
//   collection,
//   addDoc,
//   getDocs,
//   query,
//   where,
// } from "firebase/firestore";
// import { v4 as uuidv4 } from "uuid";

// interface Teacher {
//   id: string;
//   name: string;
//   position: string;
// }

// interface Subject {
//   id: string;
//   name: string;
// }

// const AddClassExp: React.FC = () => {
//   const [className, setClassName] = useState<string>("");
//   const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
//   const [newDivision, setNewDivision] = useState<string>("");
//   const [selectedDivision, setSelectedDivision] = useState<string>("");
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [selectedClassteacher, setSelectedClassteacher] = useState<string>("");
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [showNewDivisionInput, setShowNewDivisionInput] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchTeachers = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "teachers"));
//         const fetchedTeachers = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data()["First Name"],
//           position: doc.data().Position,
//         }));

//         setTeachers(fetchedTeachers);
//       } catch (error) {
//         console.error("Error fetching teachers:", error);
//       }
//     };

//     const fetchSubjects = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, "subjects"));
//         const fetchedSubjects = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           name: doc.data().name,
//         }));

//         setSubjects(fetchedSubjects);
//       } catch (error) {
//         console.error("Error fetching subjects:", error);
//       }
//     };

//     fetchTeachers();
//     fetchSubjects();
//   }, []);

//   const handleAddDivision = () => {
//     if (newDivision.trim() && !divisions.includes(newDivision)) {
//       setDivisions([...divisions, newDivision]);
//       setNewDivision(""); // Clear input after adding
//       setShowNewDivisionInput(false); // Hide input after adding
//     }
//   };

//   const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     if (e.target.value === "add-new") {
//       setShowNewDivisionInput(true);
//     } else {
//       setSelectedDivision(e.target.value);
//       setShowNewDivisionInput(false);
//     }
//   };

//   const handleSubmit = async () => {
//     const classData = {
//       classId: uuidv4(),
//       className,
//       classDivision: selectedDivision,
//       classTeacherId: selectedClassteacher,
//       classSubjects: subjects.map((subject) => ({
//         subjectId: subject.id,
//         subjectTeacherId: "",
//       })),
//     };

//     console.log("Submitting Class Data: ", classData);

//     try {
//       await addDoc(collection(db, "classes"), classData);
//       alert("Class added successfully!");
//     } catch (error) {
//       console.error("Error adding class: ", error);
//       alert("Failed to add class.");
//     }
//   };

//   return (
//     <div className="p-6 rounded-md">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <button className="flex items-center space-x-2 text-black hover:text-[#414d6b]">
//           <MdEdit size={18} />
//           <span className="text-sm font-bold">Add Class</span>
//         </button>
//       </div>

//       {/* Title Section */}
//       <h2 className="text-xl font-medium mb-4 text-[#414d6b] p-6">
//         Please enter Class Details
//       </h2>

//       {/* Input Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="className"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Class Name
//         </label>
//         <input
//           type="text"
//           id="className"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           placeholder="Enter Class Name"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           required
//         />
//       </div>

//       {/* Division Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="division"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Select Division
//         </label>
//         <select
//           id="division"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           value={selectedDivision}
//           onChange={handleDivisionChange}
//         >
//           <option value="">Select Division</option>
//           {divisions.map((division) => (
//             <option key={division} value={division}>
//               {division}
//             </option>
//           ))}
//           <option value="add-new">Add New Division</option>
//         </select>
//         {showNewDivisionInput && (
//           <div className="mt-4">
//             <input
//               type="text"
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//               placeholder="Enter New Division"
//               value={newDivision}
//               onChange={(e) => setNewDivision(e.target.value)}
//             />
//             <Button onClick={handleAddDivision} className="mt-2">
//               Add Division
//             </Button>
//           </div>
//         )}
//       </div>

//       {/* Classteacher Section */}
//       <div className="mb-6 px-6">
//         <label
//           htmlFor="classteacher"
//           className="block font-medium mb-2 text-gray-700"
//         >
//           Select Classteacher
//         </label>
//         <select
//           id="classteacher"
//           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//           value={selectedClassteacher}
//           onChange={(e) => setSelectedClassteacher(e.target.value)}
//         >
//           <option value="">Select a teacher</option>
//           {teachers.map((teacher) => (
//             <option key={teacher.id} value={teacher.id}>
//               {teacher.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Subjects Section */}
//       {/* <div className="mb-6 px-6">
//         <h3 className="text-lg font-medium mb-4 text-gray-700">Subjects</h3>
//         {subjects.map((subject) => (
//           <div key={subject.id} className="mb-4">
//             <label className="block font-medium mb-2 text-gray-700">
//               {subject.name}
//             </label>
//             <select
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
//               value={
//                 classSubjects.find((s) => s.subjectId === subject.id)
//                   ?.subjectTeacherId || ""
//               }
//               onChange={(e) =>
//                 handleSubjectTeacherChange(subject.id, e.target.value)
//               }
//             >
//               <option value="">Select a teacher</option>
//               {teachers.map((teacher) => (
//                 <option key={teacher.id} value={teacher.id}>
//                   {teacher.name}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div> */}

//       {/* Button Section */}
//       <div className="flex justify-end">
//         <Button onClick={handleSubmit} className="bg-[#576086] text-white">
//           Add Class
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default AddClassExp;

// new
import React, { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

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

const AddClassExp: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  const [divisions, setDivisions] = useState<string[]>(["A", "B"]);
  const [newDivision, setNewDivision] = useState<string>("");
  const [selectedDivision, setSelectedDivision] = useState<string>("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedClassteacher, setSelectedClassteacher] =
    useState<string>("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showNewDivisionInput, setShowNewDivisionInput] = useState<boolean>(false);

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
      setShowNewDivisionInput(false); // Hide input after adding
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

  // dummy static
  const [classTeachers, setClassTeachers] = useState([
    { name: "Teacher Name", position: "Position" },
  ]);
  const [subjectTeachersList, setSubjectTeachersList] = useState([
    { name: "Teacher Name", subject: "Subject Name", position: "Position" },
  ]);
  
  const handleAddClassTeacher = () => {
    setClassTeachers([...classTeachers, { name: "", position: "" }]);
  };
  
  const handleAddSubjectTeacher = () => {
    setSubjectTeachersList([
      ...subjectTeachersList,
      { name: "", subject: "", position: "" },
    ]);
  };
  
  const handleDeleteClassTeacher = (index: number) => {
    const updatedClassTeachers = classTeachers.filter((_, i) => i !== index);
    setClassTeachers(updatedClassTeachers);
  };
  
  const handleDeleteSubjectTeacher = (index: number) => {
    const updatedSubjectTeachersList = subjectTeachersList.filter(
      (_, i) => i !== index
    );
    setSubjectTeachersList(updatedSubjectTeachersList);
  };
  

  return (
    <div className="p-6 rounded-md bg-[#FAFAF8]">
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
      <div className="mb-6 px-6">
        <label
          htmlFor="newDivision"
          className="block font-medium mb-2 text-gray-700"
        >
          Add Division
        </label>
        <input
          type="text"
          id="newDivision"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          placeholder="Enter Division"
          value={newDivision}
          onChange={(e) => setNewDivision(e.target.value)}
        />
        <Button onClick={handleAddDivision} className="mt-2">
          Add Division
        </Button>
      </div>

      {/* Division Options */}
      <div className="mb-6 px-6">
        <label
          htmlFor="division"
          className="block font-medium mb-2 text-gray-700"
        >
          Select Division
        </label>
        <select
          id="division"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          value={selectedDivision}
          onChange={handleDivisionChange}
          style={{ color: selectedDivision === "" ? "gray" : "black" }}
        >
          <option value="" style={{ color: "gray" }}>Select Division</option>
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
          <option value="add-new" style={{ color: "blue" }}>Add New Division</option>
        </select>
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

      {/* Classteacher Section */}
      <div className="mb-6 px-6">
        <label
          htmlFor="classteacher"
          className="block font-medium mb-2 text-gray-700"
        >
          Select ClassTeacher
        </label>
        <select
          id="classteacher"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#576086] focus:border-[#576086]"
          value={selectedClassteacher}
          onChange={(e) => setSelectedClassteacher(e.target.value)}
        >
          <option value="">Select a teacher</option>
          {teachers.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name}
            </option>
          ))}
        </select>
      </div>
      <div>
  end 

  <div className="mb-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Class Teacher</h3>
      <button
        onClick={handleAddClassTeacher}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
      >
        Add Teacher
      </button>
    </div>
    <ul className="space-y-2">
      {classTeachers.map((teacher, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border"
        >
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <i className="fas fa-grip-vertical"></i>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-gray-500">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{teacher.name}</p>
              </div>
            </div>
          </div>
          <div className="text-gray-700">{teacher.position}</div>
          <button
            onClick={() => handleDeleteClassTeacher(index)}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </li>
      ))}
    </ul>
  </div>

  {/* Subject Teacher Section */}
  <div>
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold text-gray-700">Subject Teacher</h3>
      <button
        onClick={handleAddSubjectTeacher}
        className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md hover:bg-blue-600"
      >
        Add Subject Teacher
      </button>
    </div>
    <ul className="space-y-2">
      {subjectTeachersList.map((teacher, index) => (
        <li
          key={index}
          className="flex justify-between items-center bg-gray-50 p-3 rounded-md shadow-sm border"
        >
          <div className="flex items-center space-x-4">
            <div className="text-gray-400">
              <i className="fas fa-grip-vertical"></i>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-gray-500">
                <i className="fas fa-user"></i>
              </div>
              <div>
                <p className="text-gray-800 font-medium">{teacher.name}</p>
                <p className="text-gray-500 text-sm">{teacher.subject}</p>
              </div>
            </div>
          </div>
          <div className="text-gray-700">{teacher.position}</div>
          <button
            onClick={() => handleDeleteSubjectTeacher(index)}
            className="text-red-500 hover:text-red-700"
          >
            <i className="fas fa-times"></i>
          </button>
        </li>
      ))}
    </ul>
  </div>
  end here 
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

export default AddClassExp;