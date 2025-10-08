// src/components/admin/AdminOrdersTable.tsx
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type OrderItem = {
  id: string;
  name?: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  user_id?: string | null;
  status: string;
  total: number;
  created_at: string;
  items?: OrderItem[];
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  client_reference?: string;
};

const STATUS_OPTIONS = ["pending", "paid", "shipped", "completed", "cancelled"];

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

  // ✅ Fetch all orders (including guest ones)
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders/admin/all`, {
        headers: { "x-admin-key": ADMIN_KEY },
      });
      const data = await res.json();
      setOrders(data || []);
    } catch (err) {
      console.error("🔥 Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ Update order status
  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`${API_BASE}/orders/admin/${orderId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-admin-key": ADMIN_KEY,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  // ✅ Fetch specific order details (items)
  const fetchOrderDetails = async (orderId: string) => {
    const res = await fetch(`${API_BASE}/orders/${orderId}`, {
      headers: { "x-admin-key": ADMIN_KEY },
    });
    const data = await res.json();

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, items: data.items } : o))
    );
    setExpandedOrder(orderId);
  };

  if (loading) return <div className="p-4">Loading orders...</div>;

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
      <h2 className="font-semibold mb-2">Orders</h2>

      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Order ID</th>
            <th className="p-2">Customer</th>
            <th className="p-2">Email</th>
            <th className="p-2">Type</th>
            <th className="p-2">Total</th>
            <th className="p-2">Status</th>
            <th className="p-2">Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const isGuest = !o.user_id;
            return (
              <React.Fragment key={o.id}>
                <tr className="border-t">
                  <td className="p-2 text-xs">{o.id}</td>
                  <td className="p-2">
                    {o.customer_name || (isGuest ? "Guest" : "Registered User")}
                  </td>
                  <td className="p-2">{o.customer_email || "—"}</td>
                  <td className="p-2 capitalize">{isGuest ? "Guest" : "Registered"}</td>
                  <td className="p-2">₵{o.total}</td>
                  <td className="p-2">
                    <select
                      className="border p-1 rounded"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2">
                    {new Date(o.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() =>
                        expandedOrder === o.id
                          ? setExpandedOrder(null)
                          : fetchOrderDetails(o.id)
                      }
                    >
                      {expandedOrder === o.id ? "Hide" : "View Details"}
                    </Button>
                  </td>
                </tr>

                {expandedOrder === o.id && o.items && (
                  <tr className="bg-gray-50">
                    <td colSpan={8} className="p-4">
                      <h4 className="font-semibold mb-2">Order Items</h4>
                      <table className="w-full text-left border">
                        <thead>
                          <tr>
                            <th className="p-2">Product</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {o.items.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-2">{item.name || "Unnamed product"}</td>
                              <td className="p-2">{item.quantity}</td>
                              <td className="p-2">₵{item.price}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
