import DashboardLayout from "@/components/DashboardLayout";
import EditClass from "@/components/class/EditClass";
import React from "react";

export default async function Page({
  params,
}: {
  params: Promise<{ fieldid: string }>;
}) {
  const resolvedParams = await params;
  const { fieldid } = resolvedParams;
  console.log("uuuu",fieldid);


  return (
    <DashboardLayout>
      <EditClass classid={fieldid} />
    </DashboardLayout>
  );
}