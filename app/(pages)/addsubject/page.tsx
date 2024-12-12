import DashboardLayout from '@/components/DashboardLayout'
import AddSubject from '@/components/subject/AddSubject'
import React from 'react'

const page = () => {
  return (
    <DashboardLayout>
        <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
            <AddSubject />
        </div>
      </DashboardLayout>
  )
}

export default page