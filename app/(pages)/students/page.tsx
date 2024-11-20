import DashboardLayout from "@/components/DashboardLayout";
import Students from "@/components/Student/Students";
import React from "react";

function page() {
  return (
    <div>
      <DashboardLayout>
        <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
          <Students />
        </div>
      </DashboardLayout>
    </div>
  );
}

export default page;
