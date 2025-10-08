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
  status: "pending" | "paid" | "failed" | "cancelled" | "shipped" | "delivered";
  createdAt: string;
  items: OrderItem[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

type OrdersContextType = {
  orders: Order[];
  createOrder: (payload: Omit<Order, "clientReference" | "createdAt" | "status">) => Promise<Order>;
  getOrder: (clientReference: string) => Order | undefined;
  refresh: () => Promise<void>;
  updateStatus: (clientReference: string, status: Order["status"]) => Promise<void>;
};

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const makeRef = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  // ✅ Fetch user orders from backend
  const loadOrders = async () => {
    if (!user) return setOrders([]);
    try {
      const data = await apiFetch(`/orders/user/${user.id}`);
      setOrders(data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [user]);

  // ✅ Create a new order
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
      const newOrder = await apiFetch("/orders", {
        method: "POST",
        body: JSON.stringify({
          user_id: user?.id,
          items: order.items,
          total: order.totalAmount,
          customer_name: order.customerName,
          customer_email: order.customerEmail,
          customer_phone: order.customerPhone,
        }),
      });

      // Update frontend state
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      console.error("Failed to create order:", err);
      throw err;
    }
  };

  // ✅ Get order by reference
  const getOrder = (clientReference: string) =>
    orders.find((o) => o.clientReference === clientReference);

  // ✅ Refresh manually (reload orders)
  const refresh = async () => {
    await loadOrders();
  };

  // ✅ Update order status (for admin)
  const updateStatus = async (clientReference: string, status: Order["status"]) => {
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
      value={{ orders, createOrder, getOrder, refresh, updateStatus }}
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
