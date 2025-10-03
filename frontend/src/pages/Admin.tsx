// src/pages/Admin.tsx
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <AdminOrdersTable />
    </div>
  );
}
