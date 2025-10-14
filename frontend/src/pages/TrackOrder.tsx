// src/pages/TrackOrder.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TrackOrder: React.FC = () => {
  const q = useQuery();
  const refFromQuery = q.get("ref") ?? "";
  const [ref, setRef] = useState(refFromQuery);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState("");
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();

  const API_BASE =
    import.meta.env.VITE_BACKEND_URL || "https://hair-ecommerce-main.onrender.com";

  const formatCurrency = (v = 0) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(v);

  const handleLookup = async () => {
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders/ref/${ref}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");

      const normalized = {
        ...data,
        clientReference: data.clientReference || data.reference,
      };

      setOrder(normalized);
    } catch (err: any) {
      console.error("Error tracking order:", err);
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (refFromQuery && refFromQuery !== "null" && refFromQuery !== "undefined") {
    handleLookup();
  }
}, [refFromQuery]);


  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <div className="space-y-4">
        <Input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Enter your order reference (e.g. REF-ABC123)"
          className="border border-gray-300"
        />

        <Button onClick={handleLookup} disabled={loading} className="w-full">
          {loading ? "Loading..." : "Track Order"}
        </Button>

        {error && (
          <div className="text-red-600 text-sm border border-red-200 p-3 rounded bg-red-50">
            {error}
          </div>
        )}

        {order && (
          <div className="border rounded-lg p-5 bg-white shadow-sm mt-6">
            <div className="flex justify-between items-center mb-3">
              <div>
                <h2 className="font-semibold text-lg">
                  Ref: {order.clientReference}
                </h2>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm capitalize ${
                order.status === "delivered"
                  ? "bg-green-100 text-green-700"
                  : order.status === "paid"
                  ? "bg-blue-100 text-blue-700"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : order.status === "failed"
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-700"
              }`}>
                {order.status}
              </span>
            </div>

            <p className="text-sm mb-2">
              Total Amount: <strong>{formatCurrency(order.totalAmount || order.total)}</strong>
            </p>

            <h3 className="font-medium mb-2">Items</h3>
            <ul className="space-y-2 text-sm">
              {order.items?.map((it: any, i: number) => (
                <li key={it.id || i} className="flex justify-between border-b border-gray-100 pb-1">
                  <span>{it.name} × {it.quantity}</span>
                  <span>{formatCurrency(it.price * it.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {isAuthenticated && (
          <div className="mt-6 text-center">
            <Button variant="outline" onClick={() => nav("/orders")} className="text-sm">
              ← Back to My Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
