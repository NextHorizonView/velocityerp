'use client';
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';
import { ReactNode } from 'react';

interface DashboardLayoutProps {
    children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className={`${isCollapsed ? 'ml-8' : 'ml-64'} transition-all duration-300`}>
                <DashboardHeader isCollapsed={isCollapsed} />
                <main className="mt-16 px-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;