"use client";
import React, { useState, useRef, useEffect, FC } from 'react';
import { usePathname } from "next/navigation";
import {
    RiSearchLine,
    RiMailLine,
    RiArrowDownSLine,
    RiMenu3Line,
    RiCloseLine
} from 'react-icons/ri';
import { IoIosNotifications } from "react-icons/io";

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

    const getTitle = () => {
        if (pathname.includes("/enquiry")) {
            if (pathname === "/enquiry/admission") {
                return "Enquiry - Admission";
            } else if (pathname === "/enquiry/business") {
                return "Enquiry - Business";
            }
        }
        return "Dashboard";
    };

    return (
        <div className={`fixed top-0 right-0 bg-white border-b border-gray-200 z-10 transition-all duration-300
            ${isCollapsed ? 'lg:left-8' : 'lg:left-64'} left-0`}>
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
                    <h1 className="text-lg lg:text-xl font-semibold text-gray-900 hidden sm:block">{getTitle()}</h1>

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
                            src="/api/placeholder/32/32"
                            alt="Profile"
                            className="h-8 w-8 rounded-full"
                        />
                        <div className="hidden sm:flex flex-col">
                            <span className="text-sm font-medium text-gray-900">Sanjay Singh</span>
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
                            <select className="border rounded px-2 py-1 text-sm">
                                {languages.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <span className="text-sm font-medium">Quick Links:</span>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Profile Settings</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Notifications</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Messages</a>
                            <a href="#" className="text-sm text-gray-600 hover:text-gray-900">Sign Out</a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DashboardHeader;