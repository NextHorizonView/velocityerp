import DashboardLayout from '@/components/DashboardLayout'
import MarksEntryForm from '@/components/Marks/marks'
import React from 'react'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <MarksEntryForm/>
        </DashboardLayout>

    </div>
  )
}

export default page