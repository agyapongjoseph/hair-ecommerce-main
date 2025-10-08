// src/pages/TrackOrder.tsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const API_BASE = import.meta.env.VITE_BACKEND_URL;

  const handleLookup = async () => {
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE}/orders/ref/${ref}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Order not found");
      setOrder(data);
    } catch (err: any) {
      console.error("Error tracking order:", err);
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refFromQuery) handleLookup();
  }, [refFromQuery]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>

      <div className="max-w-md space-y-4">
        {/* 🟢 Input to enter order reference */}
        <Input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Enter your order reference"
        />

        <Button onClick={handleLookup} disabled={loading}>
          {loading ? "Loading..." : "Track Order"}
        </Button>

        {/* 🟠 Error message */}
        {error && <div className="text-red-500 text-sm">{error}</div>}

        {/* 🟢 Order details */}
        {order && (
          <div className="border p-4 rounded shadow-sm mt-4 bg-card">
            <div className="mb-2 font-medium">
              Reference: {order.clientReference || order.reference}
            </div>

            <div className="text-sm mb-2">
              Status:{" "}
              <span
                className={`font-bold ${
                  order.status === "paid"
                    ? "text-green-600"
                    : order.status === "pending"
                    ? "text-yellow-600"
                    : "text-red-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="text-sm mb-2">
              Total Amount: ₵
              {Number(order.totalAmount || order.total).toFixed(2)}
            </div>

            <div className="mb-2 font-medium">Items:</div>
            <ul className="list-disc pl-5 text-sm">
              {order.items?.map((it: any, i: number) => (
                <li key={i}>
                  {it.name} × {it.quantity} — ₵
                  {(it.price * it.quantity).toFixed(2)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
