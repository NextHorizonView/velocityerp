'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import Calendar from '@/components/Calender';
import Events from '@/components/Events';
import { ReactNode } from 'react';
import withAdminAuth from '@/lib/withAdminAuth';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedTab, setSelectedTab] = useState<'All Events' | 'Exams'>('All Events');
    const [isCalendarCollapsed, setIsCalendarCollapsed] = useState(false);

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

    const days = getDaysInMonth(new Date(2024, 2));

    return (
        <div className="min-h-screen">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={cn(
                "transition-all duration-300 ml-0",
                isCollapsed ? 'lg:ml-8' : 'lg:ml-64'
            )}>
                <DashboardHeader isCollapsed={isCollapsed} />
                <div className="mt-16 px-4 lg:px-6">
                    <div className={cn(
                        "grid grid-cols-1 gap-6",
                        "transition-all duration-500 ease-in-out",
                        isCalendarCollapsed ? "lg:grid-cols-1" : "lg:grid-cols-4"
                    )}>
                        {/* Main Content Area - Expands when calendar is collapsed */}
                        <div className={cn(
                            "transition-all duration-500 ease-in-out",
                            isCalendarCollapsed ? "lg:col-span-1" : "lg:col-span-3"
                        )}>
                            <main className="space-y-6">
                                {children}
                            </main>
                        </div>

                        {/* Calendar Sidebar */}
                        <div className={cn(
                            "transition-all duration-500 ease-in-out",
                            isCalendarCollapsed ? "!w-0 !h-0 !m-0 !p-0 overflow-hidden" : "lg:col-span-1"
                        )}>
                            <div className={cn(
                                "transition-all duration-500 ease-in-out transform",
                                isCalendarCollapsed ? 
                                    "opacity-0 invisible !w-0 !h-0 !m-0 !p-0 scale-0" : 
                                    "opacity-100 visible w-full h-auto scale-100"
                            )}>
                                <div className="sticky top-20 space-y-6">
                                    {/* Calendar Component */}
                                    <div className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-4">Calendar</h3>
                                        <Calendar selectedTab={selectedTab} setSelectedTab={setSelectedTab} days={days} />
                                    </div>

                                    {/* Events Component */}
                                    <div className="bg-white p-4 rounded-lg shadow-md">
                                        <h3 className="text-lg font-semibold mb-4">Events</h3>
                                        <Events />
                                    </div>
                                </div>
                            </div>

                            {/* Toggle Bar */}
                            <div className={cn(
                                "fixed right-0 top-0 bottom-0 w-8 bg-white shadow-lg",
                                "flex flex-col items-center justify-center cursor-pointer z-20",
                                "hover:bg-gray-50 transition-colors duration-200"
                            )}
                                onClick={() => setIsCalendarCollapsed(!isCalendarCollapsed)}
                            >
                                {isCalendarCollapsed ? (
                                    <>
                                        <ChevronsLeft className="w-5 h-5 text-gray-400 mb-2" />
                                        <span className="vertical-text text-gray-400 text-sm font-medium">
                                            Show Calendar
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <ChevronsRight className="w-5 h-5 text-gray-400 mb-2" />
                                        <span className="vertical-text text-gray-400 text-sm font-medium">
                                            Hide Calendar
                                        </span>
                                    </>
                                )}
                            </div>

                            <style jsx>{`
                                .vertical-text {
                                    writing-mode: vertical-rl;
                                    text-orientation: mixed;
                                    transform: rotate(180deg);
                                    white-space: nowrap;
                                }
                            `}</style>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAdminAuth(DashboardLayout);