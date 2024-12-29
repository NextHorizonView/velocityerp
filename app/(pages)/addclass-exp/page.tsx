
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import AddClassExp from "@/components/class/AddClassExp";
const page = () => {
  return (
    <DashboardLayout>
      <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
        <AddClassExp />
      </div>
    </DashboardLayout>
  );
};

export default page;
