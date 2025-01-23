import React from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ClassTeacherNoticeComponent from '@/components/Teacher/classTeacherNotice'


const page = () => {
    return (
        <div>
            <DashboardLayout>
                <ClassTeacherNoticeComponent />
            </DashboardLayout>
        </div>
    )
}

export default page