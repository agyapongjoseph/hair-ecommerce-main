import React, { useState } from "react";
import { useOrders } from "@/context/OrdersContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, Search, Mail, Calendar, ShoppingBag, TrendingUp } from "lucide-react";

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

  const handleGuestLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestEmail) return alert("Please enter your email");
    setLoading(true);
    await loadGuestOrders(guestEmail);
    setLoading(false);
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; bgColor: string; icon: string }> = {
      delivered: { color: "text-green-700", bgColor: "bg-green-100 border-green-200", icon: "✓" },
      paid: { color: "text-blue-700", bgColor: "bg-blue-100 border-blue-200", icon: "💳" },
      pending: { color: "text-yellow-700", bgColor: "bg-yellow-100 border-yellow-200", icon: "⏳" },
      failed: { color: "text-red-700", bgColor: "bg-red-100 border-red-200", icon: "✗" },
      shipped: { color: "text-purple-700", bgColor: "bg-purple-100 border-purple-200", icon: "🚚" },
      default: { color: "text-gray-700", bgColor: "bg-gray-100 border-gray-200", icon: "•" },
    };
    return configs[status] || configs.default;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            {user
              ? `Welcome back, ${user.name || "valued customer"}! Track and manage your orders.`
              : "Enter your email to view your guest orders"}
          </p>
        </div>

        {/* Guest Order Lookup */}
        {!user && (
          <form
            onSubmit={handleGuestLookup}
            className="mb-8 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-fade-in-up"
          >
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-4 sm:p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-900">Find Your Orders</h2>
              </div>
              <p className="text-sm text-gray-600">
                Enter the email address you used during checkout
              </p>
            </div>
            <div className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    required
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loading}
                  className="sm:w-auto w-full py-3 px-6"
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
                      Find Orders
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 sm:p-12 text-center shadow-sm animate-fade-in-up">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                No Orders Found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {user
                  ? "You haven't placed any orders yet. Start shopping to see your orders here!"
                  : "No orders found with this email. Please check your email address and try again."}
              </p>
              {user && (
                <Button onClick={() => nav("/")}>
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Orders Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {orders.length}
                    </p>
                  </div>
                  <Package className="h-8 w-8 text-primary opacity-20" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Total Spent</p>
                    <p className="text-lg sm:text-xl font-bold text-green-600">
                      {formatCurrency(
                        orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
                      )}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-500 opacity-20" />
                </div>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm col-span-2 sm:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Items Ordered</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {orders.reduce(
                        (sum, o) =>
                          sum +
                          (o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0),
                        0
                      )}
                    </p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-primary opacity-20" />
                </div>
              </div>
            </div>

            {/* Order Cards */}
            {orders.map((o) => {
              const statusConfig = getStatusConfig(o.status);
              return (
                <div
                  key={o.id || o.clientReference}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow animate-fade-in-up"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-4 sm:p-5 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-gray-500">
                            Order Reference
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold border ${statusConfig.bgColor} ${statusConfig.color}`}
                          >
                            {statusConfig.icon} {o.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="font-mono text-sm sm:text-base font-semibold text-gray-900">
                          {o.clientReference}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {new Date(o.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="p-4 sm:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      {/* Items List */}
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Order Items ({o.items?.length || 0})
                        </h3>
                        <ul className="space-y-2">
                          {o.items?.map((it, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                            >
                              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 text-sm sm:text-base">
                                  {it.name}
                                </p>
                                <div className="flex flex-wrap gap-2 mt-1 text-xs text-gray-600">
                                  {it.inch && (
                                    <span className="bg-white px-2 py-1 rounded border border-gray-200">
                                      Length: {it.inch}"
                                    </span>
                                  )}
                                  <span className="bg-white px-2 py-1 rounded border border-gray-200">
                                    Qty: {it.quantity}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Order Summary */}
                      <div className="lg:w-64 bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">
                          Order Summary
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Items</span>
                            <span className="font-medium text-gray-900">
                              {o.items?.length || 0}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Quantity</span>
                            <span className="font-medium text-gray-900">
                              {o.items?.reduce((s, i) => s + (i.quantity || 0), 0) || 0}
                            </span>
                          </div>
                          <div className="pt-2 border-t border-gray-300">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-gray-700">
                                Total Amount
                              </span>
                              <span className="text-xl font-bold text-green-600">
                                {formatCurrency(o.totalAmount)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => nav(`/track?ref=${o.clientReference}`)}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Track Order
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;