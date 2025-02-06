'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface AttendanceRecord {
  class: string;
  subject: string;
  teacher: string;
}

interface ClassSession {
  id: string;
  subject: string;
  teacher: string;
  division: string;
}

export default function AttendanceView() {
  const [date, setDate] = useState(new Date()); // Initialize with today's date
  const [classes, setClasses] = useState<ClassSession[]>([]); // Store fetched records

  // Function to handle previous day navigation
  const handlePreviousDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() - 1);
    setDate(newDate);
  };

  // Function to handle next day navigation
  const handleNextDay = () => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + 1);
    setDate(newDate);
  };

  // Fetch data from the API based on the selected date
  const fetchAttendanceData = async () => {
    const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });

    try {
      const response = await fetch(`/api/getAttendance?date=${formattedDate}&year=2025-2026`);
      const data = await response.json();

      if (data.attendance) {
        const fetchedClasses: ClassSession[] = data.attendance.map((item: AttendanceRecord, index: number) => ({
          id: `${item.class}-${item.subject}-${item.teacher}-${index}`,
          subject: item.subject,
          teacher: item.teacher,
          division: item.class,
        }));
        setClasses(fetchedClasses);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
    }
  };

  // Fetch data whenever the date changes
  useEffect(() => {
    fetchAttendanceData();
  }, [date]);

  return (
    <div className="p-10 max-w-3xl mx-auto rounded-2xl bg-gray-50 min-h-screen">
      {/* Header with back button */}
      <div className="flex items-center mb-8 pt-2">
        <Link href="/teacherclass" className="text-[#576086] mr-3 flex items-center">
          <ChevronLeft size={24} />
        </Link>
        <h1 className="text-xl font-semibold text-[#576086]">Attendance</h1>
      </div>

      {/* Header with navigation and filter */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <button onClick={handlePreviousDay} className="px-2 py-1 text-[#576086]">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-lg font-bold text-[#0E2C75]">
            {date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
          </h2>
          <button onClick={handleNextDay} className="px-2 py-1 text-[#576086]">
            <ChevronRight size={24} />
          </button>
        </div>
        <button className="px-4 py-2 bg-white border rounded-lg flex items-center gap-2 shadow-sm">
          <Filter size={16} className="text-[#576086]" />
          <span className="text-[#576086]">Filter</span>
        </button>
      </div>

      {/* Class cards displaying subject, teacher, and class */}
      <div className="space-y-4">
        {classes.map((session) => (
          <Link 
            href={`/attendance/attendancemark`}
            key={session.id}
            className="block hover:border border-[#0B235E] rounded-xl transition-shadow"
          >
            <div className="bg-[#DADEEB] p-4 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-gray-500 text-sm mb-1">{session.division}</div>
                  <div className="font-semibold text-gray-800 mb-1">{session.subject}</div>
                  <div className="text-gray-600 text-sm">{session.teacher}</div>
                </div>
                {/* Hardcoded "View Attendance" */}
                <div className="flex items-center gap-1 text-green-500">
                  <span>View Attendance</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
