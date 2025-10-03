// src/pages/TrackOrder.tsx
import React, { useState, useEffect } from "react";
import { useOrders } from "@/context/OrdersContext";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TrackOrder: React.FC = () => {
  const q = useQuery();
  const refFromQuery = q.get("ref") ?? "";
  const [ref, setRef] = useState(refFromQuery);
  const { getOrder } = useOrders();
  const [order, setOrder] = useState<any | undefined>(undefined);

  useEffect(() => {
    if (refFromQuery) {
      const o = getOrder(refFromQuery);
      setOrder(o);
    }
  }, [refFromQuery, getOrder]);

  const handleLookup = () => {
    setOrder(getOrder(ref));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Track Order</h1>

      <div className="max-w-md space-y-4">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="Enter order reference"
          className="w-full border px-3 py-2 rounded"
        />
        <Button onClick={handleLookup}>Lookup</Button>

        {!order ? (
          <div className="text-muted-foreground">No order found. Try another reference.</div>
        ) : (
          <div className="border p-4 rounded">
            <div className="mb-2 font-medium">Ref: {order.clientReference}</div>
            <div className="text-sm mb-2">Status: <span className="font-bold">{order.status}</span></div>
            <div className="text-sm mb-2">Amount: ₵{order.totalAmount}</div>
            <div className="mb-2">Items:</div>
            <ul className="list-disc pl-5">
              {order.items.map((it:any) => (
                <li key={it.id}>{it.name} × {it.quantity} — ₵{it.price * it.quantity}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
