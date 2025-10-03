// src/pages/admin/AdminDashboard.tsx
import React, { useState } from "react";
import AdminUploadProducts from "@/components/admin/AdminUploadProducts";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import AdminOrdersTable from "@/components/admin/AdminOrdersTable";
import AdminCustomersTable from "@/components/admin/AdminCustomersTable";
import { Button } from "@/components/ui/button";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";


export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("products");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="mb-4 text-right">
        <AdminLogoutButton />
      </div>
      <div className="flex gap-2 mb-6">
        <Button variant={activeTab === "products" ? "default" : "outline"} onClick={() => setActiveTab("products")}>
          Products
        </Button>
        <Button variant={activeTab === "orders" ? "default" : "outline"} onClick={() => setActiveTab("orders")}>
          Orders
        </Button>
        <Button variant={activeTab === "customers" ? "default" : "outline"} onClick={() => setActiveTab("customers")}>
          Customers
        </Button>
        <Button variant={activeTab === "upload" ? "default" : "outline"} onClick={() => setActiveTab("upload")}>
          Upload
        </Button>
      </div>

      {activeTab === "upload" && <AdminUploadProducts />}
      {activeTab === "products" && <AdminProductsTable />}
      {activeTab === "orders" && <AdminOrdersTable />}
      {activeTab === "customers" && <AdminCustomersTable />}
    </div>
  );
}
