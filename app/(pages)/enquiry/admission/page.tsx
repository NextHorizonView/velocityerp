import React from "react";
import AdmissioEnquiry from "@/components/AdmissioEnquiry";
import DashboardLayout from "@/components/DashboardLayout";

function page() {
  return (
    <div>
      <DashboardLayout>
        <AdmissioEnquiry />
      </DashboardLayout>
    </div>
  );
}

export default page;
