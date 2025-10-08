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

    // ✅ Validate required fields
    if (!total || !items) {
      return res
        .status(400)
        .json({ error: "Missing required fields: total or items" });
    }

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

    // ✅ Validate user_id and check if it exists in Supabase
    if (
      typeof user_id === "string" &&
      /^[0-9a-fA-F-]{36}$/.test(user_id)
    ) {
      const { data: userCheck, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("id", user_id)
        .single();

      if (userError && userError.code !== "PGRST116") {
        // not found or query error
        console.warn("⚠️ Supabase user lookup error:", userError.message);
      }

      if (userCheck) {
        orderData.user_id = user_id;
      } else {
        console.warn("⚠️ user_id not found in users table — saving as guest order.");
      }
    } else {
      console.warn("⚠️ Invalid user_id format — saving as guest order.");
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
