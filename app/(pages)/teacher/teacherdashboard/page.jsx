import React from 'react'
import DashboardLayout from "@/components/DashboardLayout";
import TeacherDashboard from '@/components/Teacher/TeacherDashboard'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <TeacherDashboard/>
        </DashboardLayout>
    </div>
  )
}

export default page