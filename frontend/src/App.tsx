import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import Orders from "@/pages/Orders";
import TrackOrder from "@/pages/TrackOrder";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminRoute from "@/components/admin/AdminRoute"; // ✅ import
// import OrderSuccess from "./pages/OrderSuccess";

const queryClient = new QueryClient();

const App = () => {
  const [filters, setFilters] = useState({
    search: "",
    length: "",
    color: "",
    texture: "",
    minPrice: undefined as number | undefined,
    maxPrice: undefined as number | undefined,
  });

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* User-facing routes */}
            <Route
              path="/"
              element={<Index filters={filters} setFilters={setFilters} />}
            />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/track" element={<TrackOrder />} />

            {/* Admin route (protected) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
