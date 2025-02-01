// pages/attendance/attendancemark/page.tsx
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import AttendanceMarkingPage from '@/components/attendance/AttendanceMark';

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <AttendanceMarkingPage/>
        </DashboardLayout>
    </div>
  );
};

export default page;