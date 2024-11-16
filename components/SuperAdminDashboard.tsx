'use client'
import React, { useState } from 'react';
import DashboardStats from '@/components/DashboardStats';
import AttendanceInfo from '@/components/AttendanceInfo';
import NoticeBoard from '@/components/Notice';
import Tasks from '@/components/Task';

const SuperAdminDashboard: React.FC = () => {

  
  const stats = [
    { label: 'Student', value: '790' },
    { label: 'Teachers', value: '28' },
    { label: 'Clerks', value: '2' },
    { label: 'Non Teaching', value: '4' },
  ];

  return (
    <div className="p-4 md:p-6 ml-2 md:ml-0">
      {/* Stats Grid */}
      <DashboardStats stats={stats} />
      
      {/* Tasks and Attendance Section */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[70%,30%] gap-6">
        <Tasks />
        <AttendanceInfo />
      </div>

      {/* Notice Board */}
      <div className="mt-6">
        <NoticeBoard />
      </div>
    </div>
  );
};

export default SuperAdminDashboard;