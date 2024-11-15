"use client";
import React, { useState, useRef, useEffect, FC } from 'react';
import { usePathname } from "next/navigation"; // Import usePathname for the current path
import {
    RiSearchLine,
    RiMailLine,
    RiArrowDownSLine
} from 'react-icons/ri';
import { IoIosNotifications } from "react-icons/io";

interface DashboardHeaderProps {
    isCollapsed: boolean;
}

const DashboardHeader: FC<DashboardHeaderProps> = ({ isCollapsed }) => {
    const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname(); // Get the current path

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsLangDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const languages = [
        { code: 'EN', name: 'English' },
        { code: 'ES', name: 'Español' },
        { code: 'FR', name: 'Français' },
        { code: 'DE', name: 'Deutsch' },
        { code: 'HI', name: 'हिंदी' }
    ];

    // Determine the title based on the current path
    const getTitle = () => {
        if (pathname.includes("/enquiry")) {
            if (pathname === "/enquiry/admission") {
                return "Enquiry - Admission";
            } else if (pathname === "/enquiry/business") {
                return "Enquiry - Business";
            }
            // Add more conditional cases if you have more enquiry subpages
        }
        return "Dashboard"; // Default to Dashboard if no enquiry path
    };

    return (
        <div className={`fixed top-0 ${isCollapsed ? 'left-8' : 'left-64'} right-0 bg-white border-b border-gray-200 z-10 transition-all duration-300`}>
            <div className="flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-8">
                    <h1 className="text-xl mr-10 font-semibold text-gray-900">{getTitle()}</h1> {/* Dynamic title */}

                    {/* Search bar */}
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-2 flex items-center pointer-events-none">
                            <RiSearchLine className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Find student, teach, etc."
                            className="pl-8 w-[350px] h-9 text-sm border bg-gray-50 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-10">
                    {/* Language selector */}
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                            className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100"
                        >
                            <span>EN</span>
                            <RiArrowDownSLine className="h-4 w-4" />
                        </button>

                        {isLangDropdownOpen && (
                            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className="w-full px-3 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                                    >
                                        <span className="font-medium">{lang.code}</span>
                                        <span className="text-gray-500 text-sm">{lang.name}</span>
                                    </button>
                                ))}
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
                            src="https://images.unsplash.com/photo-1725714834412-7d7154ac4e4e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwzfHx8ZW58MHx8fHx8"
                            alt="Profile"
                            className="h-8 w-8 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Sanjay Singh</span>
                            <span className="text-xs text-gray-500">Admin</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
