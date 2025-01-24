import DashboardLayout from '@/components/DashboardLayout'
import GradeEntryForm from '@/components/Marks/grade'
import React from 'react'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <GradeEntryForm/>
        </DashboardLayout>
    </div>
  )
}

export default page