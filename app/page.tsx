import DashboardLayout from "@/components/DashboardLayout";
import SuperAdminDashboard from "@/components/SuperAdminDashboard";




export default function Home() {
  return (
    <>
      
        <div>
         <DashboardLayout><SuperAdminDashboard /></DashboardLayout>
        
        </div>
    
    </>
  );
}
