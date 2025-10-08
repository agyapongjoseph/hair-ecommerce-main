// src/components/admin/AdminCustomersTable.tsx
import React, { useEffect, useState } from "react";

type Customer = {
  id?: string;
  name: string;
  email: string;
  role?: string;
  type: "registered" | "guest";
};

export default function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async () => {
    try {
      // Fetch registered customers
      const registeredRes = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE}/admin/customers`, {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
      });
      const registered = await registeredRes.json();

      // Fetch guest customers (unique emails from orders)
      const guestRes = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE}/orders/all`, {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
      });
      const guestOrders = await guestRes.json();

      // Extract unique guest customers by email
      const guestMap: Record<string, Customer> = {};
      guestOrders.forEach((order: any) => {
        if (order.customer_email && !order.user_id) {
          guestMap[order.customer_email] = {
            name: order.customer_name || "Guest",
            email: order.customer_email,
            type: "guest",
          };
        }
      });

      // Format registered customers
      const registeredCustomers: Customer[] = (registered || []).map((c: any) => ({
        id: c.id,
        name: c.name || "N/A",
        email: c.email,
        role: c.role || "user",
        type: "registered",
      }));

      const guestCustomers = Object.values(guestMap);
      const combined = [...registeredCustomers, ...guestCustomers];

      setCustomers(combined);
    } catch (err) {
      console.error("🔥 Error fetching customers:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) return <div className="p-4">Loading customers...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="font-semibold mb-2">Customers</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2 capitalize">{c.type}</td>
              <td className="p-2">{c.role || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
