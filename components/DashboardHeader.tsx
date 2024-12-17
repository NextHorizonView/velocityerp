"use client";

import React, { useState, useRef, useEffect, FC } from "react";
import { usePathname } from "next/navigation";
import {
  RiSearchLine,
  RiMailLine,
  RiArrowDownSLine,
  RiMenu3Line,
  RiCloseLine,
} from "react-icons/ri";
import { IoIosNotifications } from "react-icons/io";
import { GoogleTranslate } from "@/components/Translation/GoogleTranslate"; // Import your component
import { getAuth, signOut } from "firebase/auth";
interface DashboardHeaderProps {
  isCollapsed: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ isCollapsed }) => {
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getTitle = () => {
    if (pathname === "/enquiry/admission") {
      return "Enquiry - Admission";
    } else if (pathname === "/enquiry/business") {
      return "Enquiry - Business";
    } else if (pathname === "/students") {
      return "Students";
    } else if (pathname === "/teacher") {
      return "Teachers";
    } else if (pathname === "/parents") {
      return "Parents";
    } else if (pathname === "/notice") {
      return "Notice";
    } else if (pathname === "/events") {
      return "Events";
    } else if (pathname === "/class") {
      return "Class";
    } else if (pathname === "/exam") {
      return "Exams";
    } else if (pathname === "/subjects") {
      return "Subjects";
    } else if (pathname === "/account") {
      return "Account";
    } else if (pathname === "/settings") {
      return "Settings";
    } else if (pathname === "/noticeboard") {
      return "Notice Board";
    } else if (pathname === "/editstudents") {
      return "Update Student";
    }
      else if (pathname === '/studentform'){
        return "Update Student";
    }
    else if (pathname === '/addsubject'){
      return "Add Subject";
    }
    else if (pathname === '/editsubject'){
      return "Edit Subject";
    }
    return 'Dashboard'
    
  };

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear Firebase IndexedDB storage
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div
      className={`fixed top-0 right-0 bg-white border-gray-200 z-10 transition-all duration-300
      ${isCollapsed ? "lg:left-8" : "lg:left-64"} left-0`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <RiCloseLine className="h-6 w-6" />
          ) : (
            <RiMenu3Line className="h-6 w-6" />
          )}
        </button>

        {/* Title and Search Section */}
        <div className="flex items-center gap-4 lg:gap-8">
          <h1 className="text-lg lg:text-xl font-semibold text-gray-900 hidden sm:block">
            {getTitle()}
          </h1>

          {/* Search bar - Desktop */}
          <div className="hidden lg:block relative max-w-md">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <RiSearchLine className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Find student, teach, etc."
              className="pl-8 w-[350px] h-9 text-sm border bg-gray-50 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Search Icon - Mobile */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <RiSearchLine className="h-5 w-5" />
          </button>
        </div>

        {/* Logout Button */}
        <button
          className="bg-red-500 text-white px-3 py-1.5 rounded-md hover:bg-gray-600 transition"
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Right side */}
        <div className="flex items-center gap-4 lg:gap-10">
          {/* Language selector - Desktop */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            <button
              onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
              className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100"
            >
              <span>EN</span>
              <RiArrowDownSLine className="h-4 w-4" />
            </button>

            {isLangDropdownOpen && (
              <div className="absolute right-0 mt-1 w-96 bg-white rounded-md shadow-lg border p-10 border-gray-200 py-3">
                {/* Google Translate Component */}
                <GoogleTranslate />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative cursor-pointer">
            <RiMailLine className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-xs text-white flex items-center justify-center">
              8
            </span>
          </div>

          {/* Messages */}
          <div className="relative cursor-pointer">
            <IoIosNotifications className="h-5 w-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-blue-500 text-xs text-white flex items-center justify-center">
              5
            </span>
          </div>

          {/* Profile */}
          <div className="flex items-center gap-2 cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1533636721434-0e2d61030955?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D"
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-medium text-gray-900">
                Sanjay Singh
              </span>
              <span className="text-xs text-gray-500">Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {isSearchOpen && (
        <div className="lg:hidden px-4 pb-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
              <RiSearchLine className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Find student, teach, etc."
              className="pl-8 w-full h-9 text-sm border bg-gray-50 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
          <div className="px-4 py-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Language:</span>
              <GoogleTranslate />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-sm font-medium">Quick Links:</span>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Profile Settings
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Notifications
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Messages
              </a>
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900">
                Sign Out
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
