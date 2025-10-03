// src/pages/Checkout.tsx
import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Checkout: React.FC = () => {
  const { cart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "momo", // default: mobile money
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setLoading(true);

      // ✅ Call your backend (which will call Hubtel API securely)
      const res = await fetch(
        `${import.meta.env.VITE_ADMIN_API_BASE}/checkout`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customer: formData,
            items: cart,
            total,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));
      console.log("Checkout response:", res.status, data);

      if (!res.ok) throw new Error(data.error || "Payment failed");

      // ✅ Hubtel returns a checkout URL
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert("Order placed, but no payment link returned.");
        clearCart();
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert("Something went wrong during checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center md:text-left">
        Checkout
      </h1>

      {cart.length === 0 ? (
        <p>Your cart is empty. Add some products before checking out.</p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-card p-4 md:p-6 rounded-xl shadow-md"
        >
          {/* Customer Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Customer Details</h2>
            <Input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
            />
            <Input
              type="text"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
            />
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <ul className="divide-y">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-2 flex justify-between text-sm flex-wrap"
                >
                  <span>
                    {item.quantity} × {item.name}
                  </span>
                  <span>₵{item.price * item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>₵{total}</span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Place Order"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
