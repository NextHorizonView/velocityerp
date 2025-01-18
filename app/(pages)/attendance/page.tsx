import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'
import AttendanceView from '@/components/attendance/Attendance'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <AttendanceView/>
        </DashboardLayout>
    </div>
  )
}

export default page