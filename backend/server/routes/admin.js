// server/routes/admin.js
import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// ✅ Get all orders
router.get("/orders", async (req, res) => {
  const { data, error } = await supabase
    .from("orders")
    .select("id, user_id, status, total, created_at");

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

// ✅ Update order status
router.patch("/orders/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .update({ status })
    .select("id, user_id, status, total, created_at")
    .eq("id", id)
    .single();

  if (orderError) return res.status(400).json({ error: orderError.message });

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select("id, product_id, quantity, price, products(name)")
    .eq("order_id", id);

  if (itemsError) return res.status(400).json({ error: itemsError.message });

  res.json({ ...order, items });

});

// ✅ Get all products (admin)
router.get("/products", async (req, res) => {
  const adminKey = req.headers["x-admin-key"];

  // Protect the route
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { data, error } = await supabase.from("products").select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

