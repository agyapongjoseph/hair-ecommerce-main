// src/context/OrdersContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "@/lib/api";

export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
  id?: string;
  clientReference: string;
  totalAmount: number;
  status:
    | "pending"
    | "paid"
    | "failed"
    | "cancelled"
    | "shipped"
    | "delivered";
  createdAt: string;
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

type OrdersContextType = {
  orders: Order[];
  createOrder: (
    payload: Omit<Order, "clientReference" | "createdAt" | "status">
  ) => Promise<Order>;
  getOrder: (clientReference: string) => Order | undefined;
  refresh: () => Promise<void>;
  updateStatus: (
    clientReference: string,
    status: Order["status"]
  ) => Promise<void>;
  loadGuestOrders: (email: string) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const makeRef = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ Fetch orders (user or guest)
  const loadOrders = async () => {
    if (!user) return; // don't auto-load for guests
    try {
      const res = await fetch(`https://hair-ecommerce-main.onrender.com/api/orders/user/${user.id}`);
      const data = await res.json();  
      console.log("Loaded user orders:", data);
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // ✅ Fetch guest orders manually by email
  const loadGuestOrders = async (email: string) => {
    if (!email) return;
    try {
      const data = await apiFetch(
        `/orders/guest/${encodeURIComponent(email)}`
      );
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load guest orders:", err);
    }
  };

  // ✅ Create a new order (works for both guests & users)
  const createOrder = async (
    payload: Omit<Order, "clientReference" | "createdAt" | "status">
  ): Promise<Order> => {
    const order: Order = {
      ...payload,
      clientReference: makeRef(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };

    try {
      const nOrder = await fetch("https://hair-ecommerce-main.onrender.com/api/orders/place-order", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id || null,
          items: order.items,
          total: order.totalAmount,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
        }),
      });

      const newOrder = await nOrder.json();
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  };

  // ✅ Get order by client reference
  const getOrder = (clientReference: string) =>
    orders.find((o) => o.clientReference === clientReference);

  // ✅ Refresh user’s orders
  const refresh = async () => {
    await loadOrders();
  };

  // ✅ Update order status (for admin)
  const updateStatus = async (
    clientReference: string,
    status: Order["status"]
  ) => {
    try {
      await apiFetch(`/orders/update-status/${clientReference}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setOrders((prev) =>
        prev.map((o) =>
          o.clientReference === clientReference ? { ...o, status } : o
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        createOrder,
        getOrder,
        refresh,
        updateStatus,
        loadGuestOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
