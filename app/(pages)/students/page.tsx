import DashboardLayout from "@/components/DashboardLayout";
import Students from "@/components/Students";
import React from "react";

function page() {
  return (
    <div>
      <DashboardLayout>
        <div className="m-2 p-2 bg-slate-100 rounded-xl">
          <Students />
        </div>
      </DashboardLayout>
    </div>
  );
}

export default page;
