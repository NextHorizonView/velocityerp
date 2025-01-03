import DashboardLayout from "@/components/DashboardLayout";
import EditSubject from "@/components/subject/EditSubject";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ fieldid: string }>;
}) {
  const resolvedParams = await params;
  const { fieldid } = resolvedParams;

  return (
    <DashboardLayout>
      <EditSubject subjectid={fieldid} />
    </DashboardLayout>
  );
}
