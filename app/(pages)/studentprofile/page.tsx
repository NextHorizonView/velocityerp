
import DashboardLayout from '@/components/DashboardLayout'
import StudentProfile from '@/components/Student/StudentProfile'
import React from 'react'

const page = () => {
    return (
        <div>
            <DashboardLayout>
                <StudentProfile />
            </DashboardLayout>

        </div>
    )
}

export default page