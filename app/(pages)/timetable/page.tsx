import DashboardLayout from '@/components/DashboardLayout'
import React from 'react'
import Timetable from '@/components/Timetable/timetable'

const page = () => {
    return (
        <div>
            <DashboardLayout>
               <Timetable />
            </DashboardLayout>
        </div>
    )
}

export default page