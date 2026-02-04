import DashboardNav from "@/components/DashboardNav";
import DashboardGuard from "@/components/DashboardGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <DashboardNav />
        {children}
      </div>
    </DashboardGuard>
  );
}
