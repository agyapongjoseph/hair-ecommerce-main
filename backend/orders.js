// backend/routes/orders.js
import express from "express";
import { supabase } from "../frontend/src/lib/supabaseClient.js";

const router = express.Router();

// Create new order
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

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id,
          total,
          items,
          customer_name,
          customer_email,
          customer_phone,
          customer_address,
          client_reference,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error("Error creating order:", err.message);
    res.status(500).send(err.message);
  }
});

// Get all orders for a user
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
    console.error("Error fetching orders:", err.message);
    res.status(500).send(err.message);
  }
});

export default router;
