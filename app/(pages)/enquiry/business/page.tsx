import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import BusinessEnquiryTable from "@/components/BusinessEnquiry";

function page() {
  return (
    <div>
      <DashboardLayout>
        <BusinessEnquiryTable />
      </DashboardLayout>
    </div>
  );
}

export default page;
