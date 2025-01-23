import AdminAttendanceView from '@/components/attendance/AdminAttendance'
import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'


const page = () => {
  return (
    <div><DashboardLayout>
            <AdminAttendanceView/>
        </DashboardLayout></div>
  )
}

export default page