// // components/AdminAttendance.tsx

'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, Filter } from 'lucide-react';
import FilterComponent from './AttendanceFilter';
import type { FilterState } from './AttendanceFilter';

export default function AdminAttendanceView() {
  const router = useRouter();

  // State for filters
  const [selectedClass, setSelectedClass] = useState('class 1'); // Default class
  const [selectedDate, setSelectedDate] = useState('01-01-2025'); // Default date in DD-MM-YY format
  const [selectedYear, setSelectedYear] = useState('2025-2026'); // Default academic year

  // State for error handling
  const [error, setError] = useState<string | null>(null);

  // State for filter component
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  // Handle date change and convert to DD-MM-YY format
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawDate = e.target.value; // YYYY-MM-DD format
    if (!rawDate) {
      setError('Please select a valid date.');
      return;
    }

    const [year, month, day] = rawDate.split('-');
    const formattedDate = `${day}-${month}-${year}`; // Convert to DD-MM-YYYY
    setSelectedDate(formattedDate);
    setError(null);
  };

  // Validate DD-MM-YYYY format
  const isValidDate = (date: string) => {
    return /^\d{2}-\d{2}-\d{4}$/.test(date);
  };

  // Handle filter application
  const handleFilterApply = (filters: FilterState) => {
    console.log('Applied filters:', filters);
  };

  // Handle navigation to AttendanceMark page
  const handleViewAttendance = () => {
    if (!isValidDate(selectedDate)) {
      setError('Invalid date format. Please use DD-MM-YY.');
      return;
    }

    // Redirect to the AttendanceMark page with query parameters
    router.push(`/attendance/attendancemark?classId=${selectedClass}&date=${selectedDate}&year=${selectedYear}`);
  };

  // Sample subjects for the filter component
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

          {/* Class Dropdown */}
          <div className="relative mb-6">
            <select
              className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="class 1">class 1</option>
              <option value="class_1B">Class 1B</option>
              <option value="class_2A">Class 2A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Academic Year Dropdown */}
          <div className="relative mb-6">
            <h3 className="text-gray-500 mb-4">Academic Year</h3>
            <select
              className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2023-2024">2023-2024</option>
              <option value="2024-2025">2024-2025</option>
              <option value="2025-2026">2025-2026</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Date Input */}
          <div className="relative mb-6">
            <h3 className="text-gray-500 mb-4">Date</h3>
            <input
              type="date"
              className="w-full p-3 border rounded-lg appearance-none text-gray-700 pr-10"
              value={selectedDate.split('-').reverse().join('-')} // Convert DD-MM-YY to YYYY-MM-DD for the input
              onChange={handleDateChange}
            />
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
        <button
          onClick={handleViewAttendance}
          className="px-6 py-2 bg-[#576086] text-white rounded-lg"
        >
          View Attendance
        </button>

        {/* Display Error Message */}
        {error && (
          <div className="mt-6 text-red-500">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
