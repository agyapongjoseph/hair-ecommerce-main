// backend/orders.js
import express from "express";
import { supabase } from "./supabaseClient.js";

const router = express.Router();

// 🟢 Create new order
router.post("/", async (req, res) => {
  try {
    const {
      user_id,
      total,
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      client_reference,
    } = req.body;

    // ✅ Build order data
    let orderData = {
      total,
      items,
      customer_name,
      customer_email,
      customer_phone,
      customer_address,
      client_reference,
      status: "pending",
    };

    // ✅ Only include user_id if it's valid (avoids FK violation)
    if (user_id && user_id !== "undefined" && user_id !== "null") {
      orderData.user_id = user_id;
    }

    // ✅ Insert order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([orderData])
      .select()
      .single();

    if (error) {
      console.error("❌ Supabase insert error:", error);
      throw error;
    }

    console.log("✅ Order created:", data.id);
    res.status(201).json(data);
  } catch (err) {
    console.error("🔥 Error creating order:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Get all orders for a specific user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("🔥 Error fetching orders:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
