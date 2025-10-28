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
  delivery_method?: string;
};

const STATUS_OPTIONS = ["pending", "paid", "shipped", "completed", "cancelled"];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  paid: "bg-blue-100 text-blue-800 border-blue-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  completed: "bg-green-100 text-green-800 border-green-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminOrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_BACKEND_URL;
  const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY;

  const fetchOrders = async () => {
    try {
      const res = await fetch(`https://hair-ecommerce-main.onrender.com/api/orders/all`, {
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

  const updateStatus = async (orderId: string, newStatus: string) => {
    await fetch(`${API_BASE}/api/orders/admin/${orderId}/status`, {
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

  const fetchOrderDetails = async (orderId: string) => {
    const res = await fetch(`https://hair-ecommerce-main.onrender.com/api/orders/${orderId}`, {
      headers: { "x-admin-key": ADMIN_KEY },
    });
    const data = await res.json();

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, items: data.items } : o))
    );
    setExpandedOrder(orderId);
  };

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      fetchOrderDetails(orderId);
    }
  };

  if (loading) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white mt-4">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-3 text-gray-600">Loading orders...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-2 sm:p-4 border rounded-lg shadow-sm bg-white mt-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-semibold">Orders</h2>
        <span className="text-sm text-gray-500">{orders.length} orders</span>
      </div>

      {/* Desktop table view */}
      <div className="hidden xl:block overflow-x-auto">
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-sm font-semibold">Order ID</th>
              <th className="p-3 text-sm font-semibold">Customer</th>
              <th className="p-3 text-sm font-semibold">Email</th>
              <th className="p-3 text-sm font-semibold">Delivery</th>
              <th className="p-3 text-sm font-semibold">Type</th>
              <th className="p-3 text-sm font-semibold">Total</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Date</th>
              <th className="p-3 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => {
              const isGuest = !o.user_id;
              return (
                <React.Fragment key={o.id}>
                  <tr className="border-t hover:bg-gray-50 transition-colors">
                    <td className="p-3 text-xs font-mono text-gray-600">
                      {o.id.substring(0, 8)}...
                    </td>
                    <td className="p-3 font-medium">
                      {o.customer_name || (isGuest ? "Guest" : "Registered User")}
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {o.customer_email || "—"}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isGuest
                            ? "bg-gray-100 text-gray-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {isGuest ? "Guest" : "Registered"}
                      </span>
                    </td>
                    <td>
                      {o.delivery_method === "pickup"
                        ? "Pickup at store"
                        : o.customer_address || "Delivery"}
                    </td>
                    <td className="p-3 font-semibold text-green-600">₵{o.total}</td>
                    <td className="p-3">
                      <select
                        className={`border px-3 py-1 rounded-md text-sm font-medium ${
                          STATUS_COLORS[o.status as keyof typeof STATUS_COLORS]
                        }`}
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-3 text-sm text-gray-600">
                      {new Date(o.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleOrderDetails(o.id)}
                      >
                        {expandedOrder === o.id ? "Hide" : "Details"}
                      </Button>
                    </td>
                  </tr>

                  {expandedOrder === o.id && o.items && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-blue-50 border-t-2 border-blue-200 p-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <h4 className="font-semibold mb-3 text-gray-700">
                              Order Items
                            </h4>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left border">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="p-2 text-sm">Product</th>
                                    <th className="p-2 text-sm">Quantity</th>
                                    <th className="p-2 text-sm">Price</th>
                                    <th className="p-2 text-sm">Subtotal</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {o.items.map((item) => (
                                    <tr key={item.id} className="border-t">
                                      <td className="p-2">
                                        {item.name || "Unnamed product"}
                                      </td>
                                      <td className="p-2">{item.quantity}</td>
                                      <td className="p-2">₵{item.price}</td>
                                      <td className="p-2 font-semibold">
                                        ₵{(item.price * item.quantity).toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet card view */}
      <div className="xl:hidden space-y-4">
        {orders.map((o) => {
          const isGuest = !o.user_id;
          const isExpanded = expandedOrder === o.id;

          return (
            <div key={o.id} className="border rounded-lg bg-white shadow-sm">
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-base">
                        {o.customer_name || (isGuest ? "Guest" : "Registered User")}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isGuest
                            ? "bg-gray-100 text-gray-800"
                            : "bg-indigo-100 text-indigo-800"
                        }`}
                      >
                        {isGuest ? "Guest" : "Registered"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono mb-1">
                      ID: {o.id.substring(0, 12)}...
                    </p>
                    {o.customer_email && (
                      <p className="text-sm text-gray-600 break-all">
                        {o.customer_email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="font-semibold text-green-600 text-lg">
                      ₵{o.total}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Order Date</p>
                    <p className="text-sm text-gray-700">
                      {new Date(o.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Delivery Option</p>
                  <p className="text-sm text-gray-700">
                    {o.delivery_method
                      ? o.delivery_method === "pickup"
                        ? "Pickup at store"
                        : "Delivery to address"
                      : "—"}
                  </p>
                </div>
                <div className="mb-3">
                  <p className="text-xs text-gray-500 mb-2">Status</p>
                  <select
                    className={`w-full border px-3 py-2 rounded-md text-sm font-medium ${
                      STATUS_COLORS[o.status as keyof typeof STATUS_COLORS]
                    }`}
                    value={o.status}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() => toggleOrderDetails(o.id)}
                >
                  {isExpanded ? "Hide Details" : "View Order Details"}
                </Button>
              </div>

              {isExpanded && o.items && (
                <div className="border-t bg-gray-50 p-4">
                  <h4 className="font-semibold mb-3 text-sm text-gray-700">
                    Order Items
                  </h4>
                  <div className="space-y-2">
                    {o.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg p-3 border shadow-sm"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium text-sm flex-1">
                            {item.name || "Unnamed product"}
                          </p>
                          <p className="font-semibold text-green-600 ml-2">
                            ₵{(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex justify-between text-xs text-gray-600">
                          <span>Qty: {item.quantity}</span>
                          <span>₵{item.price} each</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {orders.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">No orders found</p>
          <p className="text-sm text-gray-400">
            Orders will appear here once customers make purchases
          </p>
        </div>
      )}
    </div>
  );
}