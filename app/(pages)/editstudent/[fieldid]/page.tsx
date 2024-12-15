import DashboardLayout from "@/components/DashboardLayout";
import EditStudentForm from "@/components/Student/EditStudentForm";

export default async function Page({
  params,
}: {
  params: Promise<{ fieldid: string }>;
}) {
  const resolvedParams = await params;
  const { fieldid } = resolvedParams;

  return (
    <DashboardLayout>
      {/* Post: {params.fieldid} */}
      <EditStudentForm studentid={fieldid} />
    </DashboardLayout>
  );
}
