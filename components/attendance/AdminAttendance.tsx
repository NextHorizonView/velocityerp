'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, Filter } from 'lucide-react';
import FilterComponent from './AttendanceFilter';
import type { FilterState } from './AttendanceFilter';

export default function AdminAttendanceView() {
  const router = useRouter();

  const [selectedClass, setSelectedClass] = useState('class 1');
  const [selectedDate, setSelectedDate] = useState(''); // Store date in MM-DD-YYYY format
  const [selectedYear, setSelectedYear] = useState('2025-2026');
  const [error, setError] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Handle the date change and ensure it's in MM-DD-YYYY format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value;
    if (!rawDate) return setError('Please select a valid date.');

    // Split the raw date (YYYY-MM-DD) and format it to MM-DD-YYYY
    const [year, month, day] = rawDate.split('-');
    const formattedDate = `${month}-${day}-${year}`;
    setSelectedDate(formattedDate);
    setError(null);
  };

  const isValidDate = (date: string) => /^\d{2}-\d{2}-\d{4}$/.test(date);

  const handleViewAttendance = () => {
    if (!isValidDate(selectedDate)) return setError('Invalid date format. Please use MM-DD-YYYY.');
    // Pass the MM-DD-YYYY format directly
    router.push(`/attendance/attendancemark?classId=${selectedClass}&date=${selectedDate}&year=${selectedYear}`);
  };

  const subjects = [
    { id: 'math', label: 'Mathematics' },
    { id: 'sci', label: 'Science' },
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto bg-gray-50">
      <div className="flex items-center mb-6">
        <Link href="/attendance" className="flex items-center text-[#576086]">
          <ChevronLeft className="w-5 h-5" />
          <span className="text-lg">Attendance</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-[#0E2C75] font-semibold text-lg mb-6">Today&apos;s Classes</h2>

        <div className="mb-8">
          <h3 className="text-gray-500 mb-4">Class</h3>
          <div className="relative mb-6">
            <select className="w-full p-3 border rounded-lg text-gray-700 pr-10" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
              <option value="class 1">class 1</option>
              <option value="class_1B">Class 1B</option>
              <option value="class_2A">Class 2A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <h3 className="text-gray-500 mb-4">Academic Year</h3>
          <div className="relative mb-6">
            <select className="w-full p-3 border rounded-lg text-gray-700 pr-10" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <h3 className="text-gray-500 mb-4">Date</h3>
          <div className="relative mb-6">
            <input
              type="date"
              min="2023-01-01"
              max={new Date().toISOString().split('T')[0]}
              className="w-full p-3 border rounded-lg text-gray-700"
              value={selectedDate ? selectedDate.split('-').reverse().join('-') : ''} // Display MM-DD-YYYY as input value
              onChange={handleDateChange}
            />
          </div>

          <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="px-6 py-2 border rounded-lg flex items-center gap-2 text-gray-600">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <FilterComponent onFilterApply={(filters: FilterState) => console.log('Applied filters:', filters)} subjects={subjects} isOpen={isFilterOpen} onToggle={() => setIsFilterOpen(!isFilterOpen)} />
        </div>

        <button onClick={handleViewAttendance} className="px-6 py-2 bg-[#576086] text-white rounded-lg">
          View Attendance
        </button>

        {error && <div className="mt-6 text-red-500"><p>{error}</p></div>}
      </div>
    </div>
  );
}
