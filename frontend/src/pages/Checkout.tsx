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
    paymentMethod: "momo", // default: Mobile Money
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty.");

    try {
      setLoading(true);

      // ✅ Send order details to your backend
      const res = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: formData,
          items: cart,
          total,
        }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Checkout response:", data);

      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // ✅ If backend created order & got Hubtel checkout URL
      if (data.checkoutUrl) {
        clearCart(); // empty cart immediately
        window.location.href = data.checkoutUrl; // redirect to Hubtel
      } else if (data.reference) {
        // fallback: order created but no link (manual payment)
        clearCart();
        alert(`Order placed successfully! Reference: ${data.reference}`);
        window.location.href = `/track?ref=${data.reference}`;
      } else {
        throw new Error("No payment link or reference returned.");
      }
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong during checkout.");
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
        <p className="text-gray-600">Your cart is empty. Add some products before checking out.</p>
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
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
            <Input
              type="text"
              placeholder="Delivery Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  <span>₵{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg pt-2">
              <span>Total</span>
              <span>₵{total.toFixed(2)}</span>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Processing..." : "Place Order & Pay"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Checkout;
