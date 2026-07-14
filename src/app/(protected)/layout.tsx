import AdminGuard from "@/src/components/AdminGuard";
import Header from "@/src/components/Header";
import { adminRoutes } from "@/src/constants/routes";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header
        title="Admin FC PFF Management"
        routes={adminRoutes}
      />
      <AdminGuard>{children}</AdminGuard>
    </>
  );
}