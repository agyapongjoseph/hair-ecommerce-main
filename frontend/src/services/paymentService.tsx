// src/services/paymentService.tsx
export async function initiatePayment(order: {
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
}) {
  const res = await fetch(`${import.meta.env.VITE_ADMIN_API_BASE}/api/payment/initiate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  });

  if (!res.ok) {
    throw new Error("Payment initiation failed");
  }

  return res.json(); // Hubtel response
}
