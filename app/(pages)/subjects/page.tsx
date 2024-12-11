import DashboardLayout from '@/components/DashboardLayout'
import SubjectList from '@/components/subject/SubjectList'
import React from 'react'

const page = () => {
  return (
    <DashboardLayout>
        <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
          <SubjectList/>
        </div>
      </DashboardLayout>
  )
}

export default page