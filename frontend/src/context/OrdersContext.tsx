// src/context/OrdersContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

export type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type Order = {
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
  createOrder: (payload: Omit<Order, "clientReference" | "createdAt" | "status">) => Order;
  getOrder: (clientReference: string) => Order | undefined;
  refresh: () => void;
  updateStatus: (clientReference: string, status: Order["status"]) => void;
};

const KEY_PREFIX = "fa_orders_v1_";

const storageKeyFor = (userId?: string | null) => KEY_PREFIX + (userId ?? "guest");

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const makeRef = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

export const OrdersProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const key = storageKeyFor(user?.id);
  const [orders, setOrders] = useState<Order[]>([]);

  const load = () => {
    const raw = localStorage.getItem(key);
    setOrders(raw ? JSON.parse(raw) : []);
  };

  useEffect(() => load(), [key]);

  const persist = (next: Order[]) => {
    setOrders(next);
    localStorage.setItem(key, JSON.stringify(next));
  };

  const createOrder = (payload: Omit<Order, "clientReference" | "createdAt" | "status">): Order => {
    const order: Order = {
      ...payload,
      clientReference: makeRef(),
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    const next = [order, ...orders];
    persist(next);
    return order;
  };

  const getOrder = (clientReference: string) => orders.find((o) => o.clientReference === clientReference);

  const updateStatus = (clientReference: string, status: Order["status"]) => {
    const next = orders.map((o) => (o.clientReference === clientReference ? { ...o, status } : o));
    persist(next);
  };

  const refresh = () => load();

  return (
    <OrdersContext.Provider value={{ orders, createOrder, getOrder, refresh, updateStatus }}>
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
};
