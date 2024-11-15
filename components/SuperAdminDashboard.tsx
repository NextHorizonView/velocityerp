// pages/SuperAdminDashboard.tsx
'use client'
import React, { useState } from 'react';
import DashboardStats from '@/components/DashboardStats';
import AttendanceInfo from '@/components/AttendanceInfo';
import Calendar from '@/components/Calender';
import NoticeBoard from '@/components/Notice';
import UpcomingEvents from '@/components/Events';
import Tasks from '@/components/Task';

const SuperAdminDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"All Events" | "Exams">('All Events');
  const [currentDate] = useState<Date>(new Date(2024, 2));

  const stats = [
    { label: 'Student', value: '790' },
    { label: 'Teachers', value: '28' },
    { label: 'Clerks', value: '2' },
    { label: 'Non Teaching', value: '4' },
  ];

  const getDaysInMonth = (date: Date): (number | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: (number | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-4 md:p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          {/* Stats Grid */}
          <DashboardStats stats={stats} />

          {/* Tasks and Attendance Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[70%,30%] gap-6">
            <Tasks />
            <AttendanceInfo />
          </div>

          {/* Notice Board */}
          <NoticeBoard />
        </div>

        {/* Right Section */}
        <div className="space-y-6">
          {/* Calendar */}
          <Calendar selectedTab={selectedTab} setSelectedTab={setSelectedTab} days={days} />

          {/* Upcoming Events */}
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
