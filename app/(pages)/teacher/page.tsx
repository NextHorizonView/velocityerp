import DashboardLayout from "@/components/DashboardLayout";
import Teacher from "@/components/Teacher";
import React from "react";

function page() {
  return (
    <div>
      <DashboardLayout>
        <div className="m-2 p-2 bg-slate-100 rounded-xl">
          <Teacher />
        </div>
      </DashboardLayout>
    </div>
  );
}

export default page;
