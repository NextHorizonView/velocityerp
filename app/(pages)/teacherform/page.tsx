import DashboardLayout from "@/components/DashboardLayout";
import TeacherForm from "@/components/Teacher/TeacherForm";
import React from "react";

const page = () => {
  return (
    <div>
      <DashboardLayout>
        <TeacherForm />
      </DashboardLayout>
    </div>
  );
};

export default page;
