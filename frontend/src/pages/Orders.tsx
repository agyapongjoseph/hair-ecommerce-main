import React, { useState } from "react";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const { orders, loadGuestOrders } = useOrders();
  const { user } = useAuth();
  const [guestEmail, setGuestEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const formatCurrency = (v = 0) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(v);

  // ✅ Handle guest order lookup
  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail) return alert("Please enter your email");
    setLoading(true);
    await loadGuestOrders(guestEmail);
    setLoading(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {/* ✅ Guest order lookup */}
      {!user && (
        <form
          onSubmit={handleGuestLookup}
          className="mb-6 border p-4 rounded bg-gray-50"
        >
          <label className="block mb-2 font-medium">
            Enter your email to view guest orders
          </label>
          <div className="flex gap-2">
            <input
              type="email"
              value={guestEmail}
              onChange={(e) => setGuestEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="border p-2 rounded w-full"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Find Orders"}
            </Button>
          </div>
        </form>
      )}

      {/* ✅ No orders found */}
      {orders.length === 0 ? (
        <p className="text-center text-muted-foreground mt-6">
          {user
            ? "You have no orders yet."
            : "No orders found. Enter your email above to check guest orders."}
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div
              key={o.id || o.clientReference}
              className="border p-4 rounded flex justify-between items-center bg-white shadow-sm"
            >
              <div>
                <div className="font-medium">
                  <strong>Reference:</strong> {o.clientReference}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(o.createdAt).toLocaleString()}
                </div>

                <div className="text-sm mt-1">
                  Items: {o.items?.length || 0}
                </div>

                {/* ✅ Show product names and inches */}
                <ul className="text-sm text-gray-700 mt-1 list-disc pl-4">
                  {o.items?.map((it, idx) => (
                    <li key={idx}>
                      {it.name}
                      {it.inch ? ` - ${it.inch}"` : ""} × {it.quantity}
                    </li>
                  ))}
                </ul>
              </div>

              {/* ✅ Right side (price + status + button) */}
              <div className="text-right">
                <div className="font-bold">
                  {formatCurrency(o.totalAmount)}
                </div>
                <div
                  className={`text-sm mb-2 capitalize ${
                    o.status === "delivered"
                      ? "text-green-600"
                      : o.status === "paid"
                      ? "text-blue-600"
                      : o.status === "pending"
                      ? "text-yellow-600"
                      : o.status === "failed"
                      ? "text-red-600"
                      : "text-gray-600"
                  }`}
                >
                  {o.status}
                </div>
                <Button
                  size="sm"
                  onClick={() =>
                    nav(`/track?ref=${o.clientReference}`)
                  }
                >
                  Track
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
