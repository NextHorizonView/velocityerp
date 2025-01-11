"use client";
import React, { FC, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiUserLine,
  RiTeamLine,
  RiParentLine,
  RiAccountCircleLine,
  RiFileListLine,
  RiNotificationLine,
  RiArrowLeftLine,
  RiArrowRightDoubleFill,
  RiUserAddLine,
  RiLogoutBoxLine,
} from "react-icons/ri";

import { MdClass, MdOutlineSubject } from "react-icons/md";
import Image from "next/image";
import castEducation from "@/public/castEducation.jpg";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FaUserGraduate } from "react-icons/fa";
import withAdminAuth from '@/lib/withAdminAuth';
import { signOut } from "firebase/auth";
import { getFirebaseServices } from "@/lib/firebaseConfig"; 
<<<<<<< HEAD
=======
import { useRouter } from "next/navigation"; // Import useRouter

>>>>>>> b36b764e60d1702314fdeb821a075ae88b2dd979

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar: FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const pathname = usePathname() || "";
  const [isEnquiryExpanded, setIsEnquiryExpanded] = useState(false);
  const router = useRouter(); // Initialize the router

  const handleLogout = () => {
    // Show confirmation popup
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (!userConfirmed) return; // Do nothing if the user clicks "Cancel"
    
    // Proceed with logout
    localStorage.clear(); // Clear localStorage
  
    // Clear IndexedDB databases
    const databasesToDelete = [
      "firebase-heartbeat-database",
      "firebaseLocalStorageDb",
    ];
  
    databasesToDelete.forEach((dbName) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => {
        console.log(`Database "${dbName}" deleted successfully`);
      };
      request.onerror = (e) => {
        console.error(`Error deleting database "${dbName}":`, e);
      };
      request.onblocked = () => {
        console.warn(`Database "${dbName}" deletion is blocked`);
      };
    });
  
    // Get Firebase services (auth, db, etc.)
    const { auth } = getFirebaseServices();
  
    // Sign out of Firebase
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
        
        // Get saved domain URL from localStorage or another source
        const savedDomain = sessionStorage.getItem("savedDomain") || "/"; // Default to '/' if not found
        router.push(savedDomain);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  

  const handleLogout = () => {
    // Show confirmation popup
    const userConfirmed = window.confirm("Are you sure you want to logout?");
    if (!userConfirmed) return; // Do nothing if the user clicks "Cancel"
  
    // Proceed with logout
    localStorage.clear(); // Clear localStorage
  
    // Clear IndexedDB databases
    const databasesToDelete = [
      "firebase-heartbeat-database",
      "firebaseLocalStorageDb",
    ];
  
    databasesToDelete.forEach((dbName) => {
      const request = indexedDB.deleteDatabase(dbName);
      request.onsuccess = () => {
        console.log(`Database "${dbName}" deleted successfully`);
      };
      request.onerror = (e) => {
        console.error(`Error deleting database "${dbName}":`, e);
      };
      request.onblocked = () => {
        console.warn(`Database "${dbName}" deletion is blocked`);
      };
    });
  
    // Get Firebase services (auth, db, etc.)
    const { auth } = getFirebaseServices();
  
    // Sign out of Firebase
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
        // Redirect to home page after logout
        window.location.href = '/'; // Option 1: Simple redirection
        // OR
        // router.push('/'); // Option 2: Using Next.js useRouter
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  

  const menuItems = [
    {
      icon: <RiDashboardLine size={20} />,
      label: "Dashboard",
      path: "/dashboard",
    },
    { icon: <RiUserLine size={20} />, label: "Students", path: "/students" },
    { icon: <RiTeamLine size={20} />, label: "Teacher", path: "/teacher" },
    { icon: <RiParentLine size={20} />, label: "Parents", path: "/parents" },
    { icon: <MdOutlineSubject size={20} />, label: "Subject", path: "/subjects" },
    {
      icon: <RiAccountCircleLine size={20} />,
      label: "Account",
      path: "/account",
    },
    { icon: <MdClass size={20} />, label: "Class", path: "/class" },
    { icon: <RiFileListLine size={20} />, label: "Exam", path: "/exam" },
    {
      icon: <RiNotificationLine size={20} />,
      label: "Notice",
      path: "/notice",
    },
  ];

  if (isCollapsed) {
    return (
      <div
        className="fixed left-0 top-0 bottom-0 w-8 bg-white shadow-lg flex items-center justify-center cursor-pointer z-20"
        onClick={() => setIsCollapsed(false)}
      >
        <RiArrowRightDoubleFill size={20} className="text-gray-400" />
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-[#FAFAF8] shadow-lg transition-all duration-300 z-20">
      {/* Header */}
      <div className="flex items-center p-4">
        <div className="text-red-500 mr-2">
          <Image src={castEducation} alt="Logo" width={50} height={50} />
        </div>
        <span className="text-xl font-semibold">Velocity</span>
      </div>

      {/* Menu Items */}
      <nav className="mt-4 flex flex-col h-[calc(100%-180px)]">
        <div className="flex-grow">
          {menuItems.map((item, index) => {
            // Check active condition
            let isActive = false;

            // Custom logic for "Subjects"
            if (item.label === "Subject") {
              isActive =
                pathname === "/subjects" ||
                pathname === "/addsubject" ||
                pathname === "/editsubject";
            }
            // Custom logic for "Students"
            else if (item.label === "Students") {
              isActive =
                pathname === "/students" ||
                pathname === "/studentform" ||
                pathname.startsWith("/editstudent/");
            } else if (item.label === "Teacher") {
              isActive =
                pathname === "/teacher" ||
                pathname === "/teacherform" ||
                pathname.startsWith("/editteacher/");
            } else if (item.label === "Class") {
              isActive =
                pathname === "/class" ||
                pathname === "/addclass" ||
                pathname.startsWith("/editclass/");
            }
            // Default logic for other menu items
            else {
              isActive = pathname === item.path;
            }

            return (
              <Link
                key={index}
                href={item.path}
                className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${isActive ? "bg-gray-100 border-r-4 border-red-500" : "hover:bg-gray-50"
                  }`}
              >
                <div className={`${isActive ? "text-red-500" : "text-gray-600"}`}>
                  {item.icon}
                </div>
                <span
                  className={`ml-4 ${isActive ? "text-red-500 font-medium" : "text-gray-700"
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}

          {/* Enquiry Section */}
          <div
            className="relative group"
            onMouseEnter={() => setIsEnquiryExpanded(true)}
            onMouseLeave={() => setIsEnquiryExpanded(false)}
            onClick={() => setIsEnquiryExpanded((prev) => !prev)}
          >
            <div
              className={`flex items-center px-4 py-3 cursor-pointer transition-colors duration-200 ${isEnquiryExpanded ? "bg-gray-100 border-r-4 border-red-500" : "hover:bg-gray-50"
                }`}
            >
              <AiOutlineQuestionCircle size={20} className="text-gray-700" />
              <span className="ml-4 text-gray-700">Enquiry</span>
            </div>

            {/* Dropdown: Positioned within Sidebar */}
            {isEnquiryExpanded && (
              <div className="flex flex-col bg-[#FAFAF8] pl-8 pr-4 py-2">
                <Link
                  href="/enquiry/admission"
                  className={`flex items-center py-2 text-sm cursor-pointer transition-colors duration-200 ${pathname === "/enquiry/admission"
                    ? "text-red-500 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <RiUserAddLine size={20} />
                  <span className="ml-4">Admission</span>
                </Link>
                <Link
                  href="/enquiry/business"
                  className={`flex items-center py-2 text-sm cursor-pointer transition-colors duration-200 ${pathname === "/enquiry/business"
                    ? "text-red-500 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                    }`}
                >
                  <FaUserGraduate size={20} />
                  <span className="ml-4">Business</span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto">
          {/* Hide Sidebar Button */}
          <div
            onClick={() => setIsCollapsed(true)}
            className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-50"
          >
            <RiArrowLeftLine size={20} className="text-gray-600" />
            <span className="ml-4 text-gray-700">Hide Sidebar</span>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 w-full cursor-pointer transition-colors duration-200 text-red-700 "
          >
            <RiLogoutBoxLine size={20} />
            <span className="ml-4">Logout</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default withAdminAuth(Sidebar);