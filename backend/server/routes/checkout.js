// backend/checkout.js
import express from "express";
import axios from "axios";
import crypto from "crypto";

export default function checkoutRoutes(supabase) {
  const router = express.Router();

  // 🧾 Checkout + create order + trigger Hubtel payment
  router.post("/", async (req, res) => {
    try {
      const { customer, items, total } = req.body;
      if (!customer || !items || !Array.isArray(items) || !total) {
        return res.status(400).json({ error: "Invalid checkout data" });
      }

      // Generate a unique reference
      const reference = crypto.randomBytes(6).toString("hex");

      // 1️⃣ Create order in Supabase (status = pending)
      const { data: order, error } = await supabase
        .from("orders")
        .insert([
          {
            reference,
            items,
            total,
            status: "pending",
            customer_name: customer.name,
            customer_email: customer.email,
            customer_phone: customer.phone,
            customer_address: customer.address,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      // 2️⃣ Create Hubtel checkout session
      const hubtelResponse = await axios.post(
        "https://payproxyapi.hubtel.com/items/initiate",
        {
          totalAmount: total,
          description: "Hair Order Payment",
          callbackUrl: `${process.env.BACKEND_URL}/callback`,
          returnUrl: `${process.env.FRONTEND_URL}/track-order?ref=${reference}`,
          cancellationUrl: `${process.env.FRONTEND_URL}/checkout`,
          clientReference: reference,
          merchantAccountNumber: process.env.HUBTEL_MERCHANT_ID,
          merchantSecret: process.env.HUBTEL_SECRET,
          paymentOption: "momo",
          customerName: customer.name,
          customerPhoneNumber: customer.phone,
          customerEmail: customer.email,
        },
        {
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                `${process.env.HUBTEL_CLIENT_ID}:${process.env.HUBTEL_CLIENT_SECRET}`
              ).toString("base64"),
            "Content-Type": "application/json",
          },
        }
      );

      const checkoutUrl =
        hubtelResponse.data?.data?.checkoutUrl ||
        hubtelResponse.data?.data?.checkouturl;

      if (!checkoutUrl) {
        return res
          .status(500)
          .json({ error: "Hubtel did not return a checkout URL" });
      }

      // ✅ Return the payment link to frontend
      return res.json({
        message: "Order created successfully",
        checkoutUrl,
        reference,
      });
    } catch (err) {
      console.error("Checkout error:", err.message);
      return res
        .status(500)
        .json({ error: err.message || "Checkout failed" });
    }
  });

  return router;
}
