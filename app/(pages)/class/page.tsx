import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'
import ClassList from '@/components/class/ClassList'

const page = () => {
  return (
    <div className='m-2 p-2 bg-[#FAFAF8] rounded-xl'>
        <DashboardLayout>
            <ClassList/>
        </DashboardLayout>
    </div>
  )
}

export default page