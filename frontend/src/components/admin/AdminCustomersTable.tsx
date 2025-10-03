// src/components/admin/AdminCustomersTable.tsx
import React, { useEffect, useState } from "react";

type Customer = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export default function AdminCustomersTable() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const fetchCustomers = async () => {
    const res = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE}/admin/customers`, {
      headers: { "x-admin-key": import.meta.env.VITE_ADMIN_KEY },
    });
    const data = await res.json();
    setCustomers(data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="font-semibold mb-2">Customers</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.name}</td>
              <td className="p-2">{c.email}</td>
              <td className="p-2">{c.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

