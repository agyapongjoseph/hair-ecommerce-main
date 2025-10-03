// src/pages/Orders.tsx
import React from "react";
import { useOrders } from "@/context/OrdersContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const { orders } = useOrders();
  const nav = useNavigate();

  const formatCurrency = (v = 0) => new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(v);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-muted-foreground">You have no orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.clientReference} className="border p-4 rounded flex justify-between items-center">
              <div>
                <div className="font-medium">Ref: {o.clientReference}</div>
                <div className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleString()}</div>
                <div className="text-sm">Items: {o.items.length}</div>
              </div>

              <div className="text-right">
                <div className="font-bold">{formatCurrency(o.totalAmount)}</div>
                <div className="text-sm mb-2">{o.status}</div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => nav(`/track?ref=${o.clientReference}`)}>Track</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
