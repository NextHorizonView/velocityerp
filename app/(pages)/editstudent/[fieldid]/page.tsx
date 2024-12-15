import DashboardLayout from "@/components/DashboardLayout";
import EditStudentForm from "@/components/Student/EditStudentForm";

export default async function Page({
  params,
}: {
  params: { fieldid: string };
}) {
  return (
    <DashboardLayout>
      Post: {params.fieldid}
      <EditStudentForm studentid={params.fieldid} />
    </DashboardLayout>
  );
}
