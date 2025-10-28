// src/pages/TrackOrder.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import {
  Package,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  TruckIcon,
  CreditCard,
  Calendar,
  MapPin,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";

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
  const { isAuthenticated } = useAuth();
  const nav = useNavigate();

  const API_BASE =
    import.meta.env.VITE_BACKEND_URL || "https://hair-ecommerce-backend.onrender.com";

  const formatCurrency = (v = 0) =>
    new Intl.NumberFormat("en-GH", {
      style: "currency",
      currency: "GHS",
    }).format(v);

  const handleLookup = async () => {
    if (!ref.trim()) return;
    setLoading(true);
    setError("");
    setOrder(null);

    try {
      const res = await fetch(`${API_BASE}/api/orders/ref/${ref}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order not found");

      const normalized = {
        ...data,
        clientReference: data.clientReference || data.reference,
      };

      setOrder(normalized);
    } catch (err: any) {
      console.error("Error tracking order:", err);
      setError(err.message || "Failed to fetch order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (refFromQuery && refFromQuery !== "null" && refFromQuery !== "undefined") {
      handleLookup();
    }
  }, [refFromQuery]);

  const getStatusConfig = (status: string) => {
    const configs: Record<
      string,
      {
        color: string;
        bgColor: string;
        icon: React.ReactNode;
        text: string;
        description: string;
      }
    > = {
      pending: {
        color: "text-yellow-700",
        bgColor: "bg-yellow-50 border-yellow-200",
        icon: <Clock className="h-5 w-5" />,
        text: "Pending",
        description: "Your order is being processed",
      },
      paid: {
        color: "text-blue-700",
        bgColor: "bg-blue-50 border-blue-200",
        icon: <CreditCard className="h-5 w-5" />,
        text: "Paid",
        description: "Payment confirmed, preparing for shipment",
      },
      shipped: {
        color: "text-purple-700",
        bgColor: "bg-purple-50 border-purple-200",
        icon: <TruckIcon className="h-5 w-5" />,
        text: "Shipped",
        description: "Your order is on its way",
      },
      delivered: {
        color: "text-green-700",
        bgColor: "bg-green-50 border-green-200",
        icon: <CheckCircle2 className="h-5 w-5" />,
        text: "Delivered",
        description: "Order successfully delivered",
      },
      failed: {
        color: "text-red-700",
        bgColor: "bg-red-50 border-red-200",
        icon: <XCircle className="h-5 w-5" />,
        text: "Failed",
        description: "There was an issue with your order",
      },
      cancelled: {
        color: "text-gray-700",
        bgColor: "bg-gray-50 border-gray-200",
        icon: <XCircle className="h-5 w-5" />,
        text: "Cancelled",
        description: "This order has been cancelled",
      },
    };
    return (
      configs[status] || {
        color: "text-gray-700",
        bgColor: "bg-gray-50 border-gray-200",
        icon: <Package className="h-5 w-5" />,
        text: status,
        description: "Order status",
      }
    );
  };

  const getProgressPercentage = (status: string) => {
    const progress: Record<string, number> = {
      pending: 25,
      paid: 50,
      shipped: 75,
      delivered: 100,
      failed: 0,
      cancelled: 0,
    };
    return progress[status] || 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-3xl">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Track Your Order
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Enter your order reference to check the status and details
          </p>
        </div>

        {/* Search Section */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                value={ref}
                onChange={(e) => setRef(e.target.value)}
                placeholder="Enter order reference (e.g., REF-ABC123)"
                className="pl-10 py-6 text-base"
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
              />
            </div>
            <Button
              onClick={handleLookup}
              disabled={loading}
              className="sm:w-auto w-full py-6 px-6"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 mr-2" />
                  Track Order
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fade-in-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Order Not Found</h3>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        {order && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Order Reference
                    </p>
                    <p className="font-mono text-lg sm:text-xl font-bold text-gray-900">
                      {order.clientReference}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      getStatusConfig(order.status).bgColor
                    } ${getStatusConfig(order.status).color}`}
                  >
                    {getStatusConfig(order.status).icon}
                    <span className="font-semibold">
                      {getStatusConfig(order.status).text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="p-4 sm:p-6 bg-gray-50">
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    {getStatusConfig(order.status).description}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        order.status === "delivered"
                          ? "bg-green-500"
                          : order.status === "failed" || order.status === "cancelled"
                          ? "bg-red-500"
                          : "bg-primary"
                      }`}
                      style={{ width: `${getProgressPercentage(order.status)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Order Info */}
              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Order Date</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Package className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Total Amount</p>
                      <p className="text-lg font-bold text-green-600">
                        {formatCurrency(order.totalAmount || order.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Order Items ({order.items?.length || 0})
                  </h3>
                  <div className="space-y-2">
                    {order.items?.map((it: any, i: number) => (
                      <div
                        key={it.id || i}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                              {it.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Quantity: {it.quantity}
                              {it.inch && ` • Length: ${it.inch}"`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-3">
                          <p className="font-semibold text-gray-900 text-sm sm:text-base">
                            {formatCurrency(it.price * it.quantity)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatCurrency(it.price)} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total Summary */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-700">
                      Total Amount
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(order.totalAmount || order.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Info (if available) */}
            {(order.customer_name || order.customer_email || order.customer_phone) && (
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Customer Information
                </h3>
                <div className="space-y-3">
                  {order.customer_name && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-xs font-semibold text-primary">
                          {order.customer_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_name}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.customer_email && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                        <span className="text-xs">📧</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Email</p>
                        <p className="text-sm font-medium text-gray-900 break-all">
                          {order.customer_email}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.customer_phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center">
                        <span className="text-xs">📱</span>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_phone}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.customer_address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <p className="text-xs text-gray-500">Delivery Address</p>
                        <p className="text-sm font-medium text-gray-900">
                          {order.customer_address}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        {isAuthenticated && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => nav("/orders")}
              className="inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to My Orders
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;