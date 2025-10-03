// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

import { OrdersProvider } from "@/context/OrdersContext";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <AuthProvider>
        <OrdersProvider>
            <CartProvider>
              <App />
            </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </React.StrictMode>
  );
}
