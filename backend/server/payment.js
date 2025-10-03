// src/server/payment.js
import express from "express";
import axios from "axios";
import "dotenv/config";

const router = express.Router();

// POST /api/payment/initiate
router.post("/initiate", async (req, res) => {
  try {
    const { amount, customerName, customerEmail, customerPhone, orderId } = req.body;

    // Hubtel requires headers + payload
    const response = await axios.post(
      process.env.HUBTEL_API_URL,
      {
        amount: amount,
        title: "Order Payment",
        description: `Payment for order ${orderId}`,
        clientReference: orderId,
        merchantAccountNumber: process.env.HUBTEL_MERCHANT_ID,
        customerName,
        customerEmail,
        customerMsisdn: customerPhone,
        channel: "momo", // mobile money default; can also use "card"
        primaryCallbackUrl: "http://localhost:5173/checkout-success", // replace in production
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.HUBTEL_MERCHANT_ID + ":" + process.env.HUBTEL_API_KEY
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error("Payment error:", err.response?.data || err.message);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

export default router;
