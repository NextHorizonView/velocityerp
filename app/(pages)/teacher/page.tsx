import DashboardLayout from "@/components/DashboardLayout";
import Teacher from "@/components/Teacher/Teacher";
import React from "react";

function page() {
  return (
    <div>
      <DashboardLayout>
        <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
          <Teacher />
        </div>
      </DashboardLayout>
    </div>
  );
}

export default page;
