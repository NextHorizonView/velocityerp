'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import Calendar from '@/components/Calender';
import Events from '@/components/Events';  // Added Events import
import { ReactNode } from 'react';
import withAdminAuth from '@/lib/withAdminAuth';
interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'All Events' | 'Exams'>('All Events');

    // Calendar data and functions
    const getDaysInMonth = (date: Date): (number | null)[] => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();

        const days: (number | null)[] = [];
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }
        return days;
    };

    const days = getDaysInMonth(new Date(2024, 2)); // March 2024

    return (
        <div className="min-h-screen">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div 
                className={`${
                    isCollapsed ? 'lg:ml-8' : 'lg:ml-64'
                } transition-all duration-300 ml-0`}
            >
                <DashboardHeader isCollapsed={isCollapsed} />
                <div className="mt-16 px-4 lg:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            <main className="space-y-6">
                                {children}
                            </main>
                        </div>

                        {/* Right Sidebar with Calendar and Events */}
                        <div className="lg:col-span-1 space-y-6">
                            {/* Calendar Component */}
                            <div className="sticky top-20">
                                <Calendar
                                    selectedTab={selectedTab}
                                    setSelectedTab={setSelectedTab}
                                    days={days}
                                />

                                {/* Events Component */}
                                <div className="mt-6">
                                    <Events />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAdminAuth(DashboardLayout);