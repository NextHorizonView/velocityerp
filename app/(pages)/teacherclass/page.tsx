import React from 'react'
import DashboardLayout from "@/components/DashboardLayout";
import Class from '@/components/attendance/teacherclass';
const page = () => {
  return (
    <div>
        <DashboardLayout>
          <Class/>
        </DashboardLayout>
    </div>
  )
}

export default page