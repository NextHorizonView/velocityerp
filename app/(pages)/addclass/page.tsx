import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'
import AddClass from '@/components/class/AddClass'

const page = () => {
  return (
    <div>
        <DashboardLayout>
            <AddClass/>
        </DashboardLayout>
    </div>
  )
}

export default page