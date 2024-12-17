import DashboardLayout from '@/components/DashboardLayout'
import EditSubject from '@/components/subject/EditSubject'
import React from 'react'

const page = () => {
  return (
    <div>
        <DashboardLayout>

            <EditSubject/>
        </DashboardLayout>
    </div>
  )
}

export default page