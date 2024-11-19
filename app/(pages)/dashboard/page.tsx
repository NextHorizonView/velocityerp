import DashboardLayout from '@/components/DashboardLayout';
import SuperAdminDashboard from '@/components/SuperAdminDashboard';
import React from 'react';

const Page = () => {
  return (
    <div>
      <DashboardLayout>
        <SuperAdminDashboard />
      </DashboardLayout>
    </div>
  );
};

export default Page;
