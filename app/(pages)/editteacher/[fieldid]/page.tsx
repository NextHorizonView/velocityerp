import DashboardLayout from "@/components/DashboardLayout";
import EditTeacherForm from "@/components/Teacher/EditTeacherForm";
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
      <EditTeacherForm teacherid={fieldid} />
    </DashboardLayout>
  );
}
