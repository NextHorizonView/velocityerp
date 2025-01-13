import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import TeacherClass from '@/components/Teacher/classTeacher'


const page = () => {
    return (
        <div>
            <DashboardLayout>
                <TeacherClass />
            </DashboardLayout>
        </div>
    )
}

export default page