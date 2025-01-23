'use client'
import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, Filter } from 'lucide-react';
import FilterComponent from './AttendanceFilter';
import type { FilterState } from './AttendanceFilter';

export default function AdminAttendanceView() {
    const [isFilterOpen, setIsFilterOpen] = useState(true);

    const handleFilterApply = (filters: FilterState) => {
        console.log('Applied filters:', filters);
        // Handle the filter application logic here
    };

    const subjects = [
        { id: 'math', label: 'Mathematics' },
        { id: 'sci', label: 'Science' },
    ];

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50">
            {/* Back Navigation */}
            <div className="flex items-center mb-6">
                <Link href="/attendance" className="flex items-center text-[#576086]">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-lg">Attendance</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Title */}
                <h2 className="text-[#0E2C75] font-semibold text-lg mb-6">Today&apos;s Classes</h2>

                {/* Academics Section */}
                <div className="mb-8">
                    <h3 className="text-gray-500 mb-4">Academics</h3>

                    {/* Academic Year Dropdown */}
                    <div className="relative mb-6">
                        <select
                            className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
                            defaultValue=""
                        >
                            <option value="" disabled>Academic year</option>
                            <option value="2023-2024">2023-2024</option>
                            <option value="2024-2025">2024-2025</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>

                    {/* Teacher and Class Selection */}
                    <div className="flex gap-4 mb-6">
                        {/* Teacher Dropdown */}
                        <div className="relative flex-1">
                            <select
                                className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
                                defaultValue="Suchitra M"
                            >
                                <option value="Suchitra M">Suchitra M</option>
                                <option value="other">Other Teachers</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        {/* Class Dropdown */}
                        <div className="relative flex-1">
                            <select
                                className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
                                defaultValue="VII"
                            >
                                <option value="VII">VII</option>
                                <option value="VIII">VIII</option>
                                <option value="IX">IX</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>

                        {/* Filter Button */}
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="px-6 py-2 border rounded-lg flex items-center gap-2 text-gray-600"
                        >
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <FilterComponent
                            onFilterApply={handleFilterApply}
                            subjects={subjects}
                            isOpen={isFilterOpen}
                            onToggle={() => setIsFilterOpen(!isFilterOpen)}
                        />
                    </div>

                    {/* View Attendance Button */}
                    <button className="px-6 py-2 bg-[#576086] text-white rounded-lg">
                        View Attendance
                    </button>
                </div>
            </div>
        </div>
    );
}