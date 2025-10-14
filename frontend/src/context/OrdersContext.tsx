// src/context/OrdersContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { apiFetch } from "@/lib/api";

export type OrderItem = {
  id: number | string;
  name: string;
  inch?: string;
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
  "REF-" + Date.now().toString(36).toUpperCase();

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ Load orders for logged-in users
  const loadOrders = async () => {
    if (!user) return;
    try {
      const data = await apiFetch(`/api/orders/user/${user.id}`);
      setOrders(
        data.map((o: any) => ({
          ...o,
          clientReference:
            o.clientReference ||
            o.reference ||
            o.client_reference ||
            o.ref ||
            o.id,
          createdAt: o.createdAt || o.created_at,
        }))
      );
      console.log("Loaded orders:", data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // ✅ Guest orders by email
  const loadGuestOrders = async (email: string) => {
    if (!email) return;
    try {
      const data = await apiFetch(`/api/orders/guest/${encodeURIComponent(email)}`);
      setOrders(
        data.map((o: any) => ({
          ...o,
          clientReference: o.clientReference || o.reference,
        }))
      );
    } catch (err) {
      console.error("Failed to load guest orders:", err);
    }
  };

  // ✅ Create new order
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
      const nOrder = await fetch(
        "https://hair-ecommerce-main.onrender.com/api/orders/place-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user?.id || null,
            items: order.items,
            total: order.totalAmount,
            customer_name: order.customerName,
            customer_email: order.customerEmail,
            customer_phone: order.customerPhone,
            clientReference: order.clientReference,
          }),
        }
      );

      const newOrder = await nOrder.json();
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  };

  const getOrder = (clientReference: string) =>
    orders.find((o) => o.clientReference === clientReference);

  const refresh = async () => {
    await loadOrders();
  };

  const updateStatus = async (
    clientReference: string,
    status: Order["status"]
  ) => {
    try {
      await apiFetch(`/api/orders/update-status/${clientReference}`, {
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
