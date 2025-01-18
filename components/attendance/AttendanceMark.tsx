"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';

interface Student {
    rn: number;
    name: string;
    status: 'present' | 'absent' | 'leave'; 
}

export default function AttendanceMarkingPage() {
    const [students, ] = useState<Student[]>([
        { rn: 1, name: 'Rajvardhansingh', status: 'present' },
        { rn: 2, name: 'Samar Singh', status: 'leave' },
        { rn: 3, name: 'Lily', status: 'present' },
        { rn: 4, name: 'Lily', status: 'absent' },
        { rn: 5, name: 'Lily', status: 'present' },
        { rn: 6, name: 'Lily', status: 'absent' }
    ]);

    const [searchQuery, setSearchQuery] = useState('');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'present':
                return 'bg-[#7ECA48]';
            case 'absent':
                return 'bg-[#E45847]';
            default:
                return 'bg-[#939393]';
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto bg-gray-50">
            {/* Back Navigation */}
            <div className="flex items-center mb-6">
                <Link href="/attendance" className="flex items-center text-[#576086]">
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-lg text-[#576086]">Attendance</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
                {/* Class Title */}
                <h2 className="text-[#0E2C75] font-semibold text-lg mb-4">Today&apos;s Classes/VII A</h2>

                {/* Class Details Card */}
                <div className="border border-[#F7A9A0] rounded-lg p-4 mb-6">
                    <div className="grid grid-cols-2 gap-y-2">
                        <div>
                            <span className="text-[#3E494E]">Class: </span>
                            <span>VII-B</span>
                        </div>
                        <div>
                            <span className="text-[#3E494E]">Subject: </span>
                            <span>History</span>
                        </div>
                        <div>
                            <span className="text-[#3E494E]">Date: </span>
                            <span>2 Jan 2024</span>
                        </div>
                        <div>
                            <span className="text-[#3E494E]">Period: </span>
                            <span>11:30-12:30</span>
                        </div>
                        <div>
                            <span className="text-[#3E494E]">Subject Teacher: </span>
                            <span>Ms. Ruma K</span>
                        </div>
                        <div>
                            <span className="text-[#3E494E]">Class Teacher: </span>
                            <span>Mr. Das</span>
                        </div>
                    </div>
                    <button className="bg-[#576086] text-white px-4 py-1.5 rounded text-sm float-right -mt-8">
                        Generate Sheet
                    </button>
                </div>

                {/* Search and Status Controls */}
                <div className="mb-4 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="space-x-2">
                            <button className="px-4 py-1.5 rounded bg-red-50 text-red-500">
                                Absent
                            </button>
                            <button className="px-4 py-1.5 rounded bg-green-50 text-green-500">
                                Present
                            </button>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                                <span className="text-sm">Leave</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <span className="text-sm">Absent</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="text-sm">Present</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Student List */}
                <div className="border rounded-lg overflow-hidden">
                    <div className="bg-[#2C2C2CCC] text-white px-4 py-2 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <span>RN</span>
                            <span>Student Name</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>Select All</span>
                            <input type="checkbox" className="rounded" />
                        </div>
                    </div>
                    {students.map((student) => (
                        <div 
                            key={student.rn}
                            className={`px-4 py-4 flex justify-between items-center ${getStatusColor(student.status)}`}
                        >
                            <div className="flex items-center gap-8">
                                <span>{student.rn}</span>
                                <span>{student.name}</span>
                            </div>
                            <input type="checkbox" className="rounded" />
                        </div>
                    ))}
                </div>

                {/* Save Button */}
                <div className="flex justify-end mt-6">
                    <button className="bg-[#576086] text-white px-8 py-2 rounded">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}