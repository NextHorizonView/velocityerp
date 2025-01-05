import DashboardLayout from '@/components/DashboardLayout'
import EditStudentForm from '@/components/Student/EditStudentForm'
import React from 'react'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <EditStudentForm/>
        </DashboardLayout>
    </div>
  )
}

export default page