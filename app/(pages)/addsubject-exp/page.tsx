
import DashboardLayout from "@/components/DashboardLayout";
import AddSubjectExp from "@/components/subject/AddSubjectExp";
import React from "react";

const page = () => {
  return (
    <DashboardLayout>
      <div className="m-2 p-2 bg-[#FAFAF8] rounded-xl">
        <AddSubjectExp />
      </div>
    </DashboardLayout>
  );
};

export default page;
